export type OrderType = "takeaway" | "delivery";
export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "card" | "apple_pay" | "google_pay";

export type CustomizationChoice = { group: string; option: string; price: number };
export type CustomizationOption = { id: string; label: string; price: number };
export type CustomizationGroup = {
  id: string;
  name: string;
  required: boolean;
  options: CustomizationOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  dailySpecial: boolean;
  customizations: CustomizationGroup[];
};

export type Category = { id: string; name: string; image: string; sortOrder: number };

export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  birthday: string;
  joinDate: string;
  loyaltyPoints: number;
  addresses: Address[];
};

export type CartLine = {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
  customizations: CustomizationChoice[];
  notes: string;
};

export type OrderItem = Omit<CartLine, "notes">;

export type Order = {
  id: string;
  number: string;
  customerId: string;
  type: OrderType;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  placedAt: string;
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  notes: string;
  pointsEarned: number;
};

export type Promo = {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "amount";
  discountValue: number;
  minOrder: number;
  expiry: string;
  active: boolean;
  appExclusive: boolean;
  firstOrderOnly: boolean;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: "order" | "promo" | "new_item" | "location" | "general";
  time: string;
  read: boolean;
  href: string;
};

export type Review = {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  text: string;
  orderId?: string;
};

export type DayHours = {
  day: string;
  label: string;
  open: boolean;
  start: string;
  end: string;
};

export type TruckLocation = { lat: number; lng: number; address: string; name: string };
export type ScheduleStop = {
  id: string;
  date: string;
  name: string;
  address: string;
  start: string;
  end: string;
  notes: string;
};

export const TAX_RATE = 0.0825;
export const DELIVERY = { baseFee: 3.5, perMileFee: 1.25, minOrder: 18, etaMin: 25, etaMax: 45, defaultMiles: 2.4 };
export const POINTS_PER_DOLLAR = 1;

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Order received",
  preparing: "Being prepared",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "#F99B1C",
  preparing: "#F04D23",
  ready: "#3FB27F",
  out_for_delivery: "#5B8DEF",
  delivered: "#3FB27F",
  cancelled: "#E23636",
};

export const HOURS: DayHours[] = [
  { day: "sun", label: "Sunday", open: true, start: "11:00", end: "20:00" },
  { day: "mon", label: "Monday", open: false, start: "11:00", end: "20:00" },
  { day: "tue", label: "Tuesday", open: true, start: "11:00", end: "20:00" },
  { day: "wed", label: "Wednesday", open: true, start: "11:00", end: "20:00" },
  { day: "thu", label: "Thursday", open: true, start: "11:00", end: "21:00" },
  { day: "fri", label: "Friday", open: true, start: "11:00", end: "22:00" },
  { day: "sat", label: "Saturday", open: true, start: "11:00", end: "22:00" },
];

const IMG = {
  brisket: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
  burntEnds: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
  pulled: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=800&q=80",
  ribs: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  combo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  tacos: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
  mac: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80",
  greens: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  cornbread: "https://images.unsplash.com/photo-1608039829572-dee9e3d6d1a5?auto=format&fit=crop&w=800&q=80",
  pudding: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
  lemonade: "https://images.unsplash.com/photo-1523677011785-c4e0416d8637?auto=format&fit=crop&w=800&q=80",
  slaw: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
};

const sauces: CustomizationGroup = {
  id: "sauce",
  name: "Sauce",
  required: true,
  options: [
    { id: "s1", label: "House Original", price: 0 },
    { id: "s2", label: "Carolina Vinegar", price: 0 },
    { id: "s3", label: "Alabama White", price: 0 },
    { id: "s4", label: "Extra Hot", price: 0.5 },
  ],
};
const spice: CustomizationGroup = {
  id: "spice",
  name: "Spice level",
  required: true,
  options: [
    { id: "sp1", label: "Mild", price: 0 },
    { id: "sp2", label: "Medium", price: 0 },
    { id: "sp3", label: "Hot", price: 0 },
  ],
};
const addons: CustomizationGroup = {
  id: "addons",
  name: "Add-ons",
  required: false,
  options: [
    { id: "a1", label: "Extra meat", price: 4 },
    { id: "a2", label: "Pickled onions", price: 1 },
    { id: "a3", label: "Jalapeños", price: 1 },
    { id: "a4", label: "Cheese", price: 1.5 },
  ],
};

export const categories: Category[] = [
  { id: "cat-brisket", name: "Brisket & Beef", image: IMG.brisket, sortOrder: 0 },
  { id: "cat-pork", name: "Pulled Pork", image: IMG.pulled, sortOrder: 1 },
  { id: "cat-ribs", name: "Ribs", image: IMG.ribs, sortOrder: 2 },
  { id: "cat-plates", name: "Plates & Combos", image: IMG.combo, sortOrder: 3 },
  { id: "cat-sides", name: "Sides", image: IMG.mac, sortOrder: 4 },
  { id: "cat-drinks", name: "Drinks & Desserts", image: IMG.tea, sortOrder: 5 },
];

export const menu: MenuItem[] = [
  { id: "m1", name: "Smoked Brisket Plate", description: "12-hour oak-smoked brisket, sliced, with two sides and pickles.", categoryId: "cat-brisket", price: 18.5, image: IMG.brisket, available: true, featured: true, dailySpecial: false, customizations: [sauces, spice, addons] },
  { id: "m2", name: "Burnt Ends", description: "Caramelized brisket cubes glazed in house original.", categoryId: "cat-brisket", price: 16, image: IMG.burntEnds, available: true, featured: true, dailySpecial: true, customizations: [sauces, spice] },
  { id: "m3", name: "Pulled Pork Sandwich", description: "Hand-pulled pork on a toasted bun with slaw.", categoryId: "cat-pork", price: 13, image: IMG.pulled, available: true, featured: false, dailySpecial: false, customizations: [sauces, spice, addons] },
  { id: "m4", name: "St. Louis Ribs", description: "Half rack, dry-rubbed and finished over post oak.", categoryId: "cat-ribs", price: 19, image: IMG.ribs, available: true, featured: false, dailySpecial: false, customizations: [sauces, spice] },
  { id: "m5", name: "Baby Back Ribs", description: "Full rack, fall-off-the-bone, house rub.", categoryId: "cat-ribs", price: 24, image: IMG.ribs, available: false, featured: false, dailySpecial: false, customizations: [sauces] },
  { id: "m6", name: "Two-Meat Combo", description: "Pick any two meats, two sides, bread.", categoryId: "cat-plates", price: 22, image: IMG.combo, available: true, featured: true, dailySpecial: false, customizations: [sauces, spice] },
  { id: "m7", name: "Three-Meat Combo", description: "Pitmaster sampler — brisket, pork, and ribs.", categoryId: "cat-plates", price: 28, image: IMG.combo, available: true, featured: false, dailySpecial: false, customizations: [sauces] },
  { id: "m8", name: "Brisket Tacos", description: "Three street tacos, pickled onion, salsa verde.", categoryId: "cat-plates", price: 14, image: IMG.tacos, available: true, featured: false, dailySpecial: true, customizations: [spice, addons] },
  { id: "m9", name: "Mac & Cheese", description: "Three-cheese baked mac, smoked paprika crumb.", categoryId: "cat-sides", price: 5, image: IMG.mac, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m10", name: "Collard Greens", description: "Slow-simmered with smoked turkey.", categoryId: "cat-sides", price: 4.5, image: IMG.greens, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m11", name: "Loaded Baked Potato", description: "Butter, cheddar, sour cream, chives — add burnt ends.", categoryId: "cat-sides", price: 6, image: IMG.potato, available: true, featured: false, dailySpecial: false, customizations: [addons] },
  { id: "m12", name: "Skillet Cornbread", description: "Cast-iron cornbread with honey butter.", categoryId: "cat-sides", price: 3.5, image: IMG.cornbread, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m13", name: "House Slaw", description: "Crisp cabbage, apple cider dressing.", categoryId: "cat-sides", price: 3.5, image: IMG.slaw, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m14", name: "Banana Pudding", description: "Nilla wafers, vanilla custard, fresh banana.", categoryId: "cat-drinks", price: 5.5, image: IMG.pudding, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m15", name: "Sweet Tea", description: "Bottomless-style quart, house-brewed.", categoryId: "cat-drinks", price: 3, image: IMG.tea, available: true, featured: false, dailySpecial: false, customizations: [] },
  { id: "m16", name: "Fresh Lemonade", description: "Hand-squeezed, lightly sweet.", categoryId: "cat-drinks", price: 3.5, image: IMG.lemonade, available: true, featured: false, dailySpecial: false, customizations: [] },
];

export const seedCustomers: Customer[] = [
  {
    id: "c1",
    firstName: "Maya",
    lastName: "Chen",
    email: "maya@smokeyredds.com",
    phone: "(512) 555-0142",
    password: "BBQ1234",
    birthday: "1994-09-08",
    joinDate: "2025-11-12",
    loyaltyPoints: 186,
    addresses: [
      { id: "a1", label: "Home", line1: "1402 E 6th St", city: "Austin", state: "TX", zip: "78702" },
      { id: "a2", label: "Work", line1: "500 W 2nd St", city: "Austin", state: "TX", zip: "78701" },
    ],
  },
];

export const promos: Promo[] = [
  { id: "p1", code: "SMOKEY10", description: "10% off orders over $25 — app exclusive", discountType: "percent", discountValue: 10, minOrder: 25, expiry: "2026-12-31", active: true, appExclusive: true, firstOrderOnly: false },
  { id: "p2", code: "FIRSTBITE", description: "$5 off your first order", discountType: "amount", discountValue: 5, minOrder: 15, expiry: "2026-12-31", active: true, appExclusive: true, firstOrderOnly: true },
  { id: "p3", code: "FREESIDE", description: "$5 off sides when you spend $30", discountType: "amount", discountValue: 5, minOrder: 30, expiry: "2026-09-30", active: true, appExclusive: false, firstOrderOnly: false },
  { id: "p4", code: "TRUCKDAY", description: "15% off on truck event days", discountType: "percent", discountValue: 15, minOrder: 20, expiry: "2026-10-15", active: true, appExclusive: false, firstOrderOnly: false },
];

export const loyaltyTiers = [
  { name: "Smoke", points: 50, reward: "Free side" },
  { name: "Ember", points: 100, reward: "Free sandwich" },
  { name: "Pitmaster", points: 200, reward: "$15 off" },
];

export const truck: TruckLocation = {
  lat: 30.2672,
  lng: -97.7431,
  name: "Rainey Street",
  address: "810 Rainey St, Austin, TX 78701",
};

export const schedule: ScheduleStop[] = [
  { id: "st1", date: "2026-09-04", name: "Rainey Street", address: "810 Rainey St, Austin, TX 78701", start: "11:00", end: "20:00", notes: "Lunch + early dinner" },
  { id: "st2", date: "2026-09-05", name: "Mueller Lake Park", address: "4550 Mueller Blvd, Austin, TX 78723", start: "16:00", end: "21:00", notes: "Friday night — expect a line" },
  { id: "st3", date: "2026-09-06", name: "The Domain", address: "11410 Century Oaks Terrace, Austin, TX 78758", start: "11:00", end: "20:00", notes: "Near Central Park lawn" },
  { id: "st4", date: "2026-09-07", name: "South Congress", address: "1600 S Congress Ave, Austin, TX 78704", start: "12:00", end: "20:00", notes: "Sunday funday" },
  { id: "st5", date: "2026-09-09", name: "UT Campus", address: "2400 Guadalupe St, Austin, TX 78705", start: "11:00", end: "19:00", notes: "Student lunch rush" },
];

export const seedReviews: Review[] = [
  { id: "r1", customerName: "Andre W.", date: "2026-09-03", rating: 5, text: "Brisket was perfect. Truck was easy to find on Rainey." },
  { id: "r2", customerName: "Priya S.", date: "2026-09-02", rating: 4, text: "Ribs were excellent. Line moved faster than I expected." },
  { id: "r3", customerName: "Samira A.", date: "2026-08-28", rating: 5, text: "Best banana pudding in town. Ordering ahead is the move." },
];

export const seedNotifications: AppNotification[] = [
  { id: "n1", title: "Burnt Ends are back", body: "Friday special — until we sell out.", type: "new_item", time: "Today · 9:00 AM", read: false, href: "/menu/m2" },
  { id: "n2", title: "We're at Rainey Street", body: "11 AM–8 PM. Get directions in the app.", type: "location", time: "Today · 10:15 AM", read: false, href: "/location" },
  { id: "n3", title: "SMOKEY10 this weekend", body: "10% off in the app Friday–Sunday.", type: "promo", time: "Yesterday", read: true, href: "/rewards" },
];

export const ONBOARDING = [
  {
    title: "The full pit, in your pocket",
    body: "Photos, prices, sauces, and daily specials. Build a plate the way you want it.",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&h=2000&q=80",
  },
  {
    title: "Pickup at the truck — or we come to you",
    body: "Grab it when it’s ready, or get delivery with live status from the pit to your door.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&h=2000&q=80",
  },
  {
    title: "Points, perks, and smoke alerts",
    body: "Earn loyalty on every ticket. We’ll ping you for specials and when the truck moves.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&h=2000&q=80",
  },
] as const;

export function lineTotal(line: { unitPrice: number; qty: number; customizations: CustomizationChoice[] }) {
  const extras = line.customizations.reduce((s, c) => s + c.price, 0);
  return (line.unitPrice + extras) * line.qty;
}

export function cartTotals(lines: CartLine[], discount = 0, deliveryFee = 0) {
  const subtotal = Number(lines.reduce((s, l) => s + lineTotal(l), 0).toFixed(2));
  const tax = Number(((subtotal - discount + deliveryFee) * TAX_RATE).toFixed(2));
  const total = Number((subtotal - discount + deliveryFee + tax).toFixed(2));
  return { subtotal, discount, deliveryFee, tax, total };
}

export function deliveryFeeFor(miles = DELIVERY.defaultMiles) {
  return Number((DELIVERY.baseFee + DELIVERY.perMileFee * miles).toFixed(2));
}

export function applyPromo(code: string, subtotal: number, isFirstOrder: boolean): { discount: number; promo: Promo } | { error: string } {
  const promo = promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
  if (!promo || !promo.active) return { error: "That code isn’t active." };
  if (promo.expiry < "2026-09-04") return { error: "That code has expired." };
  if (subtotal < promo.minOrder) return { error: `Add ${moneyHint(promo.minOrder - subtotal)} more to use this code.` };
  if (promo.firstOrderOnly && !isFirstOrder) return { error: "FIRSTBITE is for first orders only." };
  const discount =
    promo.discountType === "percent"
      ? Number(((subtotal * promo.discountValue) / 100).toFixed(2))
      : Math.min(promo.discountValue, subtotal);
  return { discount, promo };
}

function moneyHint(n: number) {
  return `$${n.toFixed(2)}`;
}

export function pickupSlots() {
  const slots: string[] = ["ASAP · ~20 min"];
  const start = new Date();
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  start.setMinutes(start.getMinutes() + 30);
  for (let i = 0; i < 8; i++) {
    const d = new Date(start.getTime() + i * 15 * 60 * 1000);
    slots.push(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  }
  return slots;
}

export function nextOrderNumber(existing: Order[]) {
  const nums = existing.map((o) => Number(o.number.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  return `SR-${(nums.length ? Math.max(...nums) : 1040) + 1}`;
}

export function categoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? id;
}

export const DEMO_USER = { email: "maya@smokeyredds.com", password: "BBQ1234" } as const;
