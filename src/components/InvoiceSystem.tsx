import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Printer, FileText, DollarSign } from "lucide-react";
import {
  Invoice, InvoiceItem, getInvoices, addInvoice, deleteInvoice,
} from "../data/store";

export function InvoiceSystem() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState<"all" | "paid" | "unpaid">("all");

  const reload = useCallback(() => setInvoices(getInvoices()), []);
  useEffect(reload, [reload]);

  const [form, setForm] = useState<Partial<Invoice>>({ items: [], laborCost: 0, discount: 0, tax: 0 });
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({});

  const resetForm = () => { setForm({ items: [], laborCost: 0, discount: 0, tax: 0 }); setShowForm(false); };

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.unitPrice) return;
    const item: InvoiceItem = {
      name: newItem.name || "",
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      total: (newItem.quantity || 1) * (newItem.unitPrice || 0),
    };
    setForm({ ...form, items: [...(form.items || []), item] });
    setNewItem({});
  };

  const removeItem = (idx: number) => {
    setForm({ ...form, items: (form.items || []).filter((_, i) => i !== idx) });
  };

  const calcTotal = () => {
    const subtotal = (form.items || []).reduce((s, i) => s + i.total, 0) + (form.laborCost || 0);
    return subtotal - (form.discount || 0) + (form.tax || 0);
  };

  const handleSave = () => {
    addInvoice(form);
    resetForm();
    reload();
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    reload();
  };

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const handlePrint = (inv: Invoice) => {
    const printContent = `
<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>فاتورة ${esc(inv.invoiceNumber)}</title>
<style>body{font-family:Arial,sans-serif;padding:20px;max-width:400px;margin:auto;font-size:12px}
h2{text-align:center;border-bottom:2px solid #000;padding-bottom:8px}
table{width:100%;border-collapse:collapse;margin:10px 0}
td,th{border:1px solid #ccc;padding:4px 6px;text-align:right}
th{background:#f0f0f0}.total{font-weight:bold;font-size:14px}
.footer{text-align:center;margin-top:15px;font-size:10px;color:#666}</style></head>
<body><h2>Yemen Mobile Dev Tool</h2>
<div><strong>فاتورة:</strong> ${esc(inv.invoiceNumber)} · <strong>التاريخ:</strong> ${new Date(inv.createdAt).toLocaleDateString("ar")}</div>
<div><strong>العميل:</strong> ${esc(inv.customerName)} · <strong>الهاتف:</strong> ${esc(inv.customerPhone)}</div>
<table><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
${inv.items.map(i => `<tr><td>${esc(i.name)}</td><td>${i.quantity}</td><td>${i.unitPrice}</td><td>${i.total}</td></tr>`).join("")}
</table>
<div>أجرة العمل: ${inv.laborCost} ر.ي</div>
<div>الخصم: ${inv.discount} ر.ي</div>
<div class="total">الإجمالي: ${inv.total.toLocaleString()} ر.ي</div>
<div>طريقة الدفع: ${inv.paymentMethod === "cash" ? "نقدي" : inv.paymentMethod === "transfer" ? "تحويل" : "آجل"}</div>
<div class="footer">شكراً لتعاملكم معنا — Yemen Mobile Dev Tool v3.0</div></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  const totalRevenue = invoices.filter(i => i.paid).reduce((s, i) => s + i.total, 0);
  const pendingAmount = invoices.filter(i => !i.paid).reduce((s, i) => s + i.total, 0);

  const filtered = invoices.filter(i => {
    if (showFilter === "paid") return i.paid;
    if (showFilter === "unpaid") return !i.paid;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0d1117]">
        <FileText size={14} className="text-blue-400" />
        <h2 className="text-sm font-bold text-white">الفوترة والإيصالات</h2>
        <span className="text-[10px] text-gray-500 font-mono">{invoices.length} فاتورة</span>
        <div className="flex items-center gap-2 text-[10px] mr-2">
          <span className="text-green-400 font-mono"><DollarSign size={9} className="inline" /> مدفوع: {totalRevenue.toLocaleString()} ر.ي</span>
          <span className="text-yellow-400 font-mono">· معلق: {pendingAmount.toLocaleString()} ر.ي</span>
        </div>
        <div className="mr-auto" />
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-600/20 transition-all">
          <Plus size={12} /> فاتورة جديدة
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-[#0a0e1a]">
        {(["all", "paid", "unpaid"] as const).map(f => (
          <button key={f} onClick={() => setShowFilter(f)} className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${showFilter === f ? "bg-cyan-800/40 text-blue-300 border border-blue-500/30" : "text-gray-500 hover:text-gray-300"}`}>
            {f === "all" ? "الكل" : f === "paid" ? "مدفوعة" : "معلقة"}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="px-4 py-3 border-b border-white/[0.06] bg-[#0d1117] space-y-2.5">
          <div className="text-xs font-bold text-blue-400 mb-2">فاتورة جديدة</div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="اسم العميل" value={form.customerName || ""} onChange={e => setForm({ ...form, customerName: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input placeholder="رقم الهاتف" value={form.customerPhone || ""} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <select value={form.paymentMethod || "cash"} onChange={e => setForm({ ...form, paymentMethod: e.target.value as Invoice["paymentMethod"] })} className="px-2 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white outline-none">
              <option value="cash">نقدي</option>
              <option value="transfer">تحويل</option>
              <option value="credit">آجل</option>
            </select>
          </div>

          {/* Items */}
          <div className="text-[10px] text-gray-500 font-bold">الأصناف:</div>
          {(form.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-gray-300 bg-[#161b22] rounded px-2 py-1">
              <span className="flex-1">{item.name}</span>
              <span>{item.quantity} × {item.unitPrice}</span>
              <span className="text-green-400 font-mono">{item.total}</span>
              <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-400"><Trash2 size={9} /></button>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="اسم الصنف" value={newItem.name || ""} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none" />
            <input type="number" placeholder="الكمية" value={newItem.quantity ?? ""} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none" />
            <input type="number" placeholder="السعر" value={newItem.unitPrice ?? ""} onChange={e => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none" />
            <button onClick={addItem} className="px-2 py-1.5 bg-green-900/30 border border-green-700/30 text-green-300 rounded-lg text-xs font-semibold">+ إضافة</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="أجرة العمل" value={form.laborCost ?? ""} onChange={e => setForm({ ...form, laborCost: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none" />
            <input type="number" placeholder="الخصم" value={form.discount ?? ""} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none" />
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-cyan-900/20 border border-cyan-700/20 rounded-lg text-xs text-blue-300 font-bold">
              الإجمالي: {calcTotal().toLocaleString()} ر.ي
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-400">
            <input type="checkbox" checked={form.paid ?? false} onChange={e => setForm({ ...form, paid: e.target.checked })} className="rounded" />
            تم الدفع
          </label>

          <textarea placeholder="ملاحظات" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none h-12 resize-none" />

          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">إلغاء</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition-all">
              إنشاء الفاتورة
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">لا توجد فواتير</div>
        ) : filtered.map(inv => (
          <div key={inv.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-blue-400">{inv.invoiceNumber}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${inv.paid ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}`}>
                  {inv.paid ? "مدفوعة" : "معلقة"}
                </span>
              </div>
              <div className="text-xs text-white font-semibold">{inv.customerName}</div>
              <div className="text-[10px] text-gray-500">{inv.items.length} صنف · {inv.paymentMethod === "cash" ? "نقدي" : inv.paymentMethod === "transfer" ? "تحويل" : "آجل"}</div>
              <div className="text-[9px] text-gray-600 font-mono">{new Date(inv.createdAt).toLocaleDateString("ar")}</div>
            </div>
            <div className="text-sm font-bold text-green-400">{inv.total.toLocaleString()} ر.ي</div>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePrint(inv)} className="p-1.5 text-gray-600 hover:text-blue-400"><Printer size={12} /></button>
              <button onClick={() => handleDelete(inv.id)} className="p-1.5 text-gray-600 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
