import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { clearStorage, readStorage, writeStorage } from "./storage";
import {
  applyPromo,
  cartTotals,
  deliveryFeeFor,
  nextOrderNumber,
  POINTS_PER_DOLLAR,
  seedCustomers,
  seedNotifications,
  seedReviews,
  STATUS_LABEL,
  type Address,
  type AppNotification,
  type CartLine,
  type Customer,
  type Order,
  type OrderStatus,
  type OrderType,
  type PaymentMethod,
  type Review,
} from "./catalog";

type PlaceOrderInput = {
  type: OrderType;
  paymentMethod: PaymentMethod;
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  notes: string;
  promoCode?: string;
};

type Store = {
  hydrated: boolean;
  onboarded: boolean;
  markOnboarded: () => void;
  users: Customer[];
  user: Customer | null;
  login: (email: string, password: string) => { ok: true } | { ok: false };
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    birthday?: string;
  }) => { ok: true } | { ok: false; reason: "exists" };
  logout: () => void;
  updateProfile: (patch: Partial<Customer>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "id">) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  orders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order | { error: string };
  notifications: AppNotification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  unreadCount: number;
  reviews: Review[];
  addReview: (rating: number, text: string, orderId?: string) => void;
};

const Ctx = createContext<Store | null>(null);

const TRACK: Record<OrderType, OrderStatus[]> = {
  takeaway: ["received", "preparing", "ready"],
  delivery: ["received", "preparing", "out_for_delivery", "delivered"],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [users, setUsers] = useState<Customer[]>(seedCustomers);
  const [user, setUser] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);

  useEffect(() => {
    setOnboarded(readStorage("onboarded-v4") === "1");
    const id = readStorage("session");
    if (id) {
      const found = seedCustomers.find((u) => u.id === id) ?? users.find((u) => u.id === id);
      if (found) setUser(found);
    }
    setHydrated(true);
  }, []);

  const value = useMemo<Store>(() => {
    const pushNote = (title: string, body: string, type: AppNotification["type"], href: string) => {
      setNotifications((list) => [
        { id: `n-${Date.now()}`, title, body, type, time: "Just now", read: false, href },
        ...list,
      ]);
      toast(title, { description: body });
    };

    const advanceOrder = (orderId: string, steps: OrderStatus[], index: number) => {
      if (index >= steps.length) return;
      window.setTimeout(() => {
        const status = steps[index];
        setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status } : o)));
        const order = { number: "", id: orderId } as Order;
        setOrders((list) => {
          const live = list.find((o) => o.id === orderId);
          if (live) {
            pushNote(STATUS_LABEL[status], `Order ${live.number} · ${STATUS_LABEL[status]}.`, "order", `/orders/${live.id}`);
          }
          return list;
        });
        void order;
        advanceOrder(orderId, steps, index + 1);
      }, 8000 + index * 4000);
    };

    return {
      hydrated,
      onboarded,
      markOnboarded: () => {
        setOnboarded(true);
        writeStorage("onboarded-v4", "1");
      },
      users,
      user,
      login: (email, password) => {
        const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) return { ok: false };
        setUser(found);
        writeStorage("session", found.id);
        return { ok: true };
      },
      register: (input) => {
        if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
          return { ok: false, reason: "exists" };
        }
        const created: Customer = {
          id: `c-${Date.now()}`,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          password: input.password,
          birthday: input.birthday ?? "",
          joinDate: new Date().toISOString().slice(0, 10),
          loyaltyPoints: 0,
          addresses: [],
        };
        setUsers((list) => [...list, created]);
        setUser(created);
        writeStorage("session", created.id);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        clearStorage("session");
      },
      updateProfile: (patch) => {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        setUsers((list) => list.map((u) => (u.id === next.id ? next : u)));
      },
      addAddress: (address) => {
        if (!user) return;
        const next = { ...user, addresses: [...user.addresses, { ...address, id: `a-${Date.now()}` }] };
        setUser(next);
        setUsers((list) => list.map((u) => (u.id === next.id ? next : u)));
      },
      cart,
      addToCart: (line) => {
        setCart((list) => [...list, { ...line, id: `cl-${Date.now()}` }]);
        toast("Added to cart", { description: line.name });
      },
      updateQty: (id, qty) =>
        setCart((list) => (qty <= 0 ? list.filter((l) => l.id !== id) : list.map((l) => (l.id === id ? { ...l, qty } : l)))),
      removeFromCart: (id) => setCart((list) => list.filter((l) => l.id !== id)),
      clearCart: () => setCart([]),
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      orders,
      placeOrder: (input) => {
        if (!user) return { error: "Please sign in." };
        if (!cart.length) return { error: "Your cart is empty." };
        const subtotal = cartTotals(cart).subtotal;
        let discount = 0;
        let promoCode: string | undefined;
        if (input.promoCode) {
          const applied = applyPromo(input.promoCode, subtotal, orders.filter((o) => o.customerId === user.id).length === 0);
          if ("error" in applied) return { error: applied.error };
          discount = applied.discount;
          promoCode = applied.promo.code;
        }
        const fee = input.type === "delivery" ? deliveryFeeFor() : 0;
        if (input.type === "delivery" && subtotal < 18) {
          return { error: "Delivery needs a $18 minimum." };
        }
        const totals = cartTotals(cart, discount, fee);
        const order: Order = {
          id: `o-${Date.now()}`,
          number: nextOrderNumber(orders),
          customerId: user.id,
          type: input.type,
          status: "received",
          paymentMethod: input.paymentMethod,
          items: cart.map(({ notes: _n, ...item }) => item),
          ...totals,
          promoCode,
          placedAt: new Date().toISOString(),
          pickupTime: input.pickupTime,
          deliveryAddress: input.deliveryAddress,
          deliveryTime: input.deliveryTime,
          notes: input.notes,
          pointsEarned: Math.round(totals.total * POINTS_PER_DOLLAR),
        };
        setOrders((list) => [order, ...list]);
        setCart([]);
        const nextPoints = user.loyaltyPoints + order.pointsEarned;
        const nextUser = { ...user, loyaltyPoints: nextPoints };
        setUser(nextUser);
        setUsers((list) => list.map((u) => (u.id === nextUser.id ? nextUser : u)));
        pushNote("Order confirmed", `${order.number} is in. We're firing the pit.`, "order", `/orders/${order.id}`);
        advanceOrder(order.id, TRACK[order.type], 1);
        return order;
      },
      notifications,
      markAllRead: () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
      markRead: (id) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
      unreadCount: notifications.filter((n) => !n.read).length,
      reviews,
      addReview: (rating, text, orderId) => {
        if (!user) return;
        setReviews((list) => [
          {
            id: `r-${Date.now()}`,
            customerName: `${user.firstName} ${user.lastName[0]}.`,
            date: new Date().toISOString().slice(0, 10),
            rating,
            text,
            orderId,
          },
          ...list,
        ]);
        toast("Thanks for the review");
      },
    };
  }, [hydrated, onboarded, users, user, cart, orders, notifications, reviews]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

