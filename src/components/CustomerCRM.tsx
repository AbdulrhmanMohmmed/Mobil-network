import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Users, Phone } from "lucide-react";
import { Customer, getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../data/store";

export function CustomerCRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const reload = useCallback(() => setCustomers(getCustomers()), []);
  useEffect(reload, [reload]);

  const [form, setForm] = useState<Partial<Customer>>({});
  const resetForm = () => { setForm({}); setEditId(null); setShowForm(false); };

  const handleSave = () => {
    if (editId) { updateCustomer(editId, form); }
    else { addCustomer(form); }
    resetForm();
    reload();
  };

  const handleEdit = (c: Customer) => {
    setForm(c);
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    reload();
  };

  const filtered = customers.filter(c => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[#0e1525]">
        <Users size={14} className="text-cyan-400" />
        <h2 className="text-sm font-bold text-white">إدارة العملاء</h2>
        <span className="text-[10px] text-gray-500 font-mono">{customers.length} عميل</span>
        <div className="mr-auto" />
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 rounded-md text-xs font-semibold hover:bg-cyan-800/50 transition-all">
          <Plus size={12} /> عميل جديد
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-[#0a1020]">
        <div className="flex items-center gap-1.5 flex-1 bg-black/30 border border-white/[0.06] rounded-lg px-2.5 py-1.5">
          <Search size={11} className="text-gray-500" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث بالاسم أو رقم الهاتف..." className="w-full bg-transparent outline-none text-[11px] text-white placeholder:text-gray-600" />
        </div>
      </div>

      {showForm && (
        <div className="px-4 py-3 border-b border-white/[0.07] bg-[#0c1428] space-y-2.5">
          <div className="text-xs font-bold text-cyan-400 mb-2">{editId ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="الاسم الكامل" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="رقم الهاتف" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="البريد الإلكتروني" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="العنوان" value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
          </div>
          <textarea placeholder="ملاحظات" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50 h-14 resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">إلغاء</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-cyan-800/50 border border-cyan-600/40 text-cyan-200 rounded text-xs font-semibold hover:bg-cyan-700/60 transition-all">
              {editId ? "حفظ التعديلات" : "إضافة العميل"}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">لا يوجد عملاء</div>
        ) : filtered.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
            <div className="w-9 h-9 rounded-full bg-cyan-900/30 border border-cyan-700/30 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-semibold">{c.name}</div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <Phone size={9} /> {c.phone}
                {c.email && <span>· {c.email}</span>}
              </div>
              <div className="text-[9px] text-gray-600">
                {c.totalVisits} زيارة · {c.totalSpent.toLocaleString()} ر.ي إجمالي الإنفاق
                {c.notes && <span className="text-gray-700"> · {c.notes}</span>}
              </div>
            </div>
            <div className="text-[9px] text-gray-700 font-mono">{new Date(c.createdAt).toLocaleDateString("ar")}</div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(c)} className="p-1 text-gray-600 hover:text-cyan-400"><Edit2 size={11} /></button>
              <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-600 hover:text-red-400"><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
