import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  RepairTicket, getTickets, addTicket, updateTicket, deleteTicket,
  STATUS_LABELS, PRIORITY_LABELS,
} from "../data/store";

export function RepairTickets() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<RepairTicket["status"] | "all">("all");
  const [searchQ, setSearchQ] = useState("");

  const reload = useCallback(() => setTickets(getTickets()), []);
  useEffect(reload, [reload]);

  const [form, setForm] = useState<Partial<RepairTicket>>({});
  const resetForm = () => { setForm({}); setEditId(null); setShowForm(false); };

  const handleSave = () => {
    if (editId) { updateTicket(editId, form); }
    else { addTicket(form); }
    resetForm();
    reload();
  };

  const handleEdit = (t: RepairTicket) => {
    setForm({
      customerName: t.customerName,
      customerPhone: t.customerPhone,
      imei: t.imei,
      deviceBrand: t.deviceBrand,
      deviceModel: t.deviceModel,
      technicianName: t.technicianName,
      issue: t.issue,
      notes: t.notes,
      priority: t.priority,
      cost: t.cost,
      partsCost: t.partsCost,
      estimatedDate: t.estimatedDate,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTicket(id);
    reload();
  };

  const handleStatusChange = (id: string, status: RepairTicket["status"]) => {
    updateTicket(id, { status });
    reload();
  };

  const filtered = tickets.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return t.customerName.toLowerCase().includes(q) ||
        t.deviceModel.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.imei.includes(q);
    }
    return true;
  });

  const inputClass = "px-3 py-2 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-blue-500/30 transition-colors";

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-bold text-white">تذاكر الصيانة</h2>
        <span className="text-[10px] text-gray-600 font-mono bg-white/[0.03] px-2 py-0.5 rounded-lg">{tickets.length} تذكرة</span>
        <div className="mr-auto" />
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold hover:bg-blue-600/30 transition-all">
          <Plus size={12} /> تذكرة جديدة
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-1.5 flex-1 bg-[#161b22] border border-white/[0.06] rounded-xl px-3 py-2 focus-within:border-blue-500/30 transition-colors">
          <Search size={12} className="text-gray-600" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث بالاسم، الموديل، رقم التذكرة..." className="w-full bg-transparent outline-none text-[11px] text-gray-200 placeholder:text-gray-600" />
        </div>
        <div className="flex gap-1">
          {(["all", ...Object.keys(STATUS_LABELS)] as const).map(s => (
            <button key={s} onClick={() => setFilter(s as typeof filter)} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-semibold transition-all ${filter === s ? "bg-blue-500/15 text-blue-400" : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]"}`}>
              {s === "all" ? "الكل" : STATUS_LABELS[s as RepairTicket["status"]].ar}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="px-5 py-4 border-b border-white/[0.06] bg-[#0d1117] space-y-3">
          <div className="text-xs font-bold text-blue-400 mb-3">{editId ? "تعديل التذكرة" : "تذكرة جديدة"}</div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="اسم العميل" value={form.customerName || ""} onChange={e => setForm({ ...form, customerName: e.target.value })} className={inputClass} />
            <input placeholder="رقم الهاتف" value={form.customerPhone || ""} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className={inputClass} />
            <input placeholder="IMEI" value={form.imei || ""} onChange={e => setForm({ ...form, imei: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="الماركة" value={form.deviceBrand || ""} onChange={e => setForm({ ...form, deviceBrand: e.target.value })} className={inputClass} />
            <input placeholder="الموديل" value={form.deviceModel || ""} onChange={e => setForm({ ...form, deviceModel: e.target.value })} className={inputClass} />
            <input placeholder="اسم الفني" value={form.technicianName || ""} onChange={e => setForm({ ...form, technicianName: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <textarea placeholder="المشكلة / العطل" value={form.issue || ""} onChange={e => setForm({ ...form, issue: e.target.value })} className={`${inputClass} h-16 resize-none`} />
            <textarea placeholder="ملاحظات" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inputClass} h-16 resize-none`} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <select value={form.priority || "medium"} onChange={e => setForm({ ...form, priority: e.target.value as RepairTicket["priority"] })} className={inputClass}>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">عالي</option>
              <option value="urgent">عاجل</option>
            </select>
            <input type="number" placeholder="التكلفة" value={form.cost ?? ""} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className={inputClass} />
            <input type="number" placeholder="تكلفة القطع" value={form.partsCost ?? ""} onChange={e => setForm({ ...form, partsCost: Number(e.target.value) })} className={inputClass} />
            <input type="date" placeholder="موعد التسليم" value={form.estimatedDate || ""} onChange={e => setForm({ ...form, estimatedDate: e.target.value })} className={inputClass} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="px-4 py-2 text-xs text-gray-500 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">إلغاء</button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold hover:bg-blue-600/30 transition-all">
              {editId ? "حفظ التعديلات" : "إنشاء التذكرة"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-700 text-xs">لا توجد تذاكر</div>
        ) : filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-blue-400">{t.ticketNumber}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${STATUS_LABELS[t.status].color}`}>
                  {STATUS_LABELS[t.status].ar}
                </span>
                <span className={`text-[9px] font-semibold ${PRIORITY_LABELS[t.priority].color}`}>
                  {PRIORITY_LABELS[t.priority].ar}
                </span>
              </div>
              <div className="text-xs text-white font-semibold truncate">{t.customerName} — {t.deviceBrand} {t.deviceModel}</div>
              <div className="text-[10px] text-gray-500 truncate">{t.issue || "بدون وصف"}</div>
              <div className="text-[9px] text-gray-600 font-mono">{t.imei ? `IMEI: ${t.imei}` : ""} · {new Date(t.createdAt).toLocaleDateString("ar")}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="text-xs font-bold text-emerald-400">{(t.cost + t.partsCost).toLocaleString()} ر.ي</div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <select value={t.status} onChange={e => handleStatusChange(t.id, e.target.value as RepairTicket["status"])} className="appearance-none bg-[#161b22] border border-white/[0.06] rounded-lg pl-5 pr-2 py-1 text-[9px] text-gray-300 outline-none cursor-pointer">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.ar}</option>
                    ))}
                  </select>
                  <ChevronDown size={8} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <button onClick={() => handleEdit(t)} className="p-1.5 text-gray-600 hover:text-blue-400 rounded-md hover:bg-white/[0.04] transition-all"><Edit2 size={11} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-600 hover:text-red-400 rounded-md hover:bg-white/[0.04] transition-all"><Trash2 size={11} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
