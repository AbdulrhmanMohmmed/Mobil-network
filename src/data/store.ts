// ─── Shop Management Data Types & Store ─────────────────────────────────────

export interface RepairTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  imei: string;
  issue: string;
  diagnosis: string;
  solution: string;
  status: "received" | "diagnosing" | "repairing" | "waiting_parts" | "ready" | "delivered";
  priority: "low" | "medium" | "high" | "urgent";
  cost: number;
  partsCost: number;
  createdAt: string;
  updatedAt: string;
  technicianName: string;
  notes: string;
  estimatedDate: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameAr: string;
  category: "screen" | "battery" | "flex" | "ic" | "connector" | "cover" | "other";
  brand: string;
  model: string;
  quantity: number;
  costPrice: number;
  sellPrice: number;
  minStock: number;
  barcode: string;
  supplier: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  laborCost: number;
  discount: number;
  tax: number;
  total: number;
  paid: boolean;
  paymentMethod: "cash" | "transfer" | "credit";
  createdAt: string;
  notes: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ─── Status Labels ──────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<RepairTicket["status"], { ar: string; color: string }> = {
  received: { ar: "مستلم", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  diagnosing: { ar: "قيد التشخيص", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  repairing: { ar: "قيد الإصلاح", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  waiting_parts: { ar: "بانتظار قطع", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  ready: { ar: "جاهز للتسليم", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  delivered: { ar: "تم التسليم", color: "bg-gray-500/20 text-gray-300 border-gray-500/30" },
};

export const PRIORITY_LABELS: Record<RepairTicket["priority"], { ar: string; color: string }> = {
  low: { ar: "منخفض", color: "text-gray-400" },
  medium: { ar: "متوسط", color: "text-blue-400" },
  high: { ar: "عالي", color: "text-orange-400" },
  urgent: { ar: "عاجل", color: "text-red-400" },
};

export const CATEGORY_LABELS: Record<InventoryItem["category"], string> = {
  screen: "شاشات",
  battery: "بطاريات",
  flex: "فلكسات",
  ic: "IC ودوائر",
  connector: "موصلات",
  cover: "أغطية وإطارات",
  other: "أخرى",
};

// ─── Local Storage Helpers ──────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function generateTicketNumber(): string {
  const counter = Number(localStorage.getItem("ticket_counter") || "0") + 1;
  localStorage.setItem("ticket_counter", String(counter));
  return `T-${String(counter).padStart(4, "0")}`;
}

function generateInvoiceNumber(): string {
  const counter = Number(localStorage.getItem("invoice_counter") || "0") + 1;
  localStorage.setItem("invoice_counter", String(counter));
  return `INV-${String(counter).padStart(4, "0")}`;
}

// ─── TICKETS ────────────────────────────────────────────────────────────────

export function getTickets(): RepairTicket[] {
  try {
    return JSON.parse(localStorage.getItem("repair_tickets") || "[]");
  } catch { return []; }
}

export function saveTickets(tickets: RepairTicket[]): void {
  localStorage.setItem("repair_tickets", JSON.stringify(tickets));
}

export function addTicket(data: Partial<RepairTicket>): RepairTicket {
  const tickets = getTickets();
  const ticket: RepairTicket = {
    id: generateId(),
    ticketNumber: generateTicketNumber(),
    customerName: data.customerName || "",
    customerPhone: data.customerPhone || "",
    deviceBrand: data.deviceBrand || "",
    deviceModel: data.deviceModel || "",
    imei: data.imei || "",
    issue: data.issue || "",
    diagnosis: data.diagnosis || "",
    solution: data.solution || "",
    status: data.status || "received",
    priority: data.priority || "medium",
    cost: data.cost ?? 0,
    partsCost: data.partsCost ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    technicianName: data.technicianName || "",
    notes: data.notes || "",
    estimatedDate: data.estimatedDate || "",
  };
  tickets.unshift(ticket);
  saveTickets(tickets);
  return ticket;
}

export function updateTicket(id: string, data: Partial<RepairTicket>): void {
  const tickets = getTickets().map(t =>
    t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
  );
  saveTickets(tickets);
}

export function deleteTicket(id: string): void {
  saveTickets(getTickets().filter(t => t.id !== id));
}

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────

export function getCustomers(): Customer[] {
  try {
    return JSON.parse(localStorage.getItem("customers") || "[]");
  } catch { return []; }
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem("customers", JSON.stringify(customers));
}

export function addCustomer(data: Partial<Customer>): Customer {
  const customers = getCustomers();
  const customer: Customer = {
    id: generateId(),
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    totalVisits: data.totalVisits ?? 0,
    totalSpent: data.totalSpent ?? 0,
    createdAt: new Date().toISOString(),
    notes: data.notes || "",
  };
  customers.unshift(customer);
  saveCustomers(customers);
  return customer;
}

export function updateCustomer(id: string, data: Partial<Customer>): void {
  const customers = getCustomers().map(c =>
    c.id === id ? { ...c, ...data } : c
  );
  saveCustomers(customers);
}

export function deleteCustomer(id: string): void {
  saveCustomers(getCustomers().filter(c => c.id !== id));
}

// ─── INVENTORY ──────────────────────────────────────────────────────────────

export function getInventory(): InventoryItem[] {
  try {
    return JSON.parse(localStorage.getItem("inventory") || "[]");
  } catch { return []; }
}

export function saveInventory(items: InventoryItem[]): void {
  localStorage.setItem("inventory", JSON.stringify(items));
}

export function addInventoryItem(data: Partial<InventoryItem>): InventoryItem {
  const items = getInventory();
  const item: InventoryItem = {
    id: generateId(),
    name: data.name || "",
    nameAr: data.nameAr || "",
    category: data.category || "other",
    brand: data.brand || "",
    model: data.model || "",
    quantity: data.quantity ?? 0,
    costPrice: data.costPrice ?? 0,
    sellPrice: data.sellPrice ?? 0,
    minStock: data.minStock ?? 5,
    barcode: data.barcode || "",
    supplier: data.supplier || "",
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  saveInventory(items);
  return item;
}

export function updateInventoryItem(id: string, data: Partial<InventoryItem>): void {
  const items = getInventory().map(i =>
    i.id === id ? { ...i, ...data } : i
  );
  saveInventory(items);
}

export function deleteInventoryItem(id: string): void {
  saveInventory(getInventory().filter(i => i.id !== id));
}

// ─── INVOICES ───────────────────────────────────────────────────────────────

export function getInvoices(): Invoice[] {
  try {
    return JSON.parse(localStorage.getItem("invoices") || "[]");
  } catch { return []; }
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

export function addInvoice(data: Partial<Invoice>): Invoice {
  const invoices = getInvoices();
  const items = data.items || [];
  const laborCost = data.laborCost ?? 0;
  const discount = data.discount ?? 0;
  const tax = data.tax ?? 0;
  const subtotal = items.reduce((sum, item) => sum + item.total, 0) + laborCost;
  const total = subtotal - discount + tax;

  const invoice: Invoice = {
    id: generateId(),
    invoiceNumber: generateInvoiceNumber(),
    ticketId: data.ticketId || "",
    customerName: data.customerName || "",
    customerPhone: data.customerPhone || "",
    items,
    laborCost,
    discount,
    tax,
    total,
    paid: data.paid || false,
    paymentMethod: data.paymentMethod || "cash",
    createdAt: new Date().toISOString(),
    notes: data.notes || "",
  };
  invoices.unshift(invoice);
  saveInvoices(invoices);
  return invoice;
}

export function deleteInvoice(id: string): void {
  saveInvoices(getInvoices().filter(i => i.id !== id));
}

// ─── STATISTICS ─────────────────────────────────────────────────────────────

export interface ShopStats {
  totalTickets: number;
  activeTickets: number;
  completedToday: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCustomers: number;
  lowStockItems: number;
  pendingInvoices: number;
}

export function getShopStats(): ShopStats {
  const tickets = getTickets();
  const invoices = getInvoices();
  const customers = getCustomers();
  const inventory = getInventory();
  const today = new Date().toISOString().split("T")[0];

  return {
    totalTickets: tickets.length,
    activeTickets: tickets.filter(t => !["delivered", "ready"].includes(t.status)).length,
    completedToday: tickets.filter(t => t.status === "delivered" && t.updatedAt.startsWith(today)).length,
    totalRevenue: invoices.filter(i => i.paid).reduce((sum, i) => sum + i.total, 0),
    todayRevenue: invoices.filter(i => i.paid && i.createdAt.startsWith(today)).reduce((sum, i) => sum + i.total, 0),
    totalCustomers: customers.length,
    lowStockItems: inventory.filter(i => i.quantity <= i.minStock).length,
    pendingInvoices: invoices.filter(i => !i.paid).length,
  };
}
