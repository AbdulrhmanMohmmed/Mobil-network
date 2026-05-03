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
    setForm(t);
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[#0e1525]">
        <h2 className="text-sm font-bold text-white">تذاكر الصيانة</h2>
        <span className="text-[10px] text-gray-500 font-mono">{tickets.length} تذكرة</span>
        <div className="mr-auto" />
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 rounded-md text-xs font-semibold hover:bg-cyan-800/50 transition-all">
          <Plus size={12} /> تذكرة جديدة
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-[#0a1020]">
        <div className="flex items-center gap-1.5 flex-1 bg-black/30 border border-white/[0.06] rounded-lg px-2.5 py-1.5">
          <Search size={11} className="text-gray-500" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث بالاسم، الموديل، رقم التذكرة..." className="w-full bg-transparent outline-none text-[11px] text-white placeholder:text-gray-600" />
        </div>
        <div className="flex gap-1">
          {(["all", ...Object.keys(STATUS_LABELS)] as const).map(s => (
            <button key={s} onClick={() => setFilter(s as typeof filter)} className={`px-2 py-1 rounded text-[9px] font-semibold transition-all ${filter === s ? "bg-cyan-800/40 text-cyan-300 border border-cyan-600/40" : "text-gray-500 hover:text-gray-300"}`}>
              {s === "all" ? "الكل" : STATUS_LABELS[s as RepairTicket["status"]].ar}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-white/[0.07] bg-[#0c1428] space-y-2.5">
          <div className="text-xs font-bold text-cyan-400 mb-2">{editId ? "تعديل التذكرة" : "تذكرة جديدة"}</div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="اسم العميل" value={form.customerName || ""} onChange={e => setForm({ ...form, customerName: e.target.value })} className="col-span-1 px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="رقم الهاتف" value={form.customerPhone || ""} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="IMEI" value={form.imei || ""} onChange={e => setForm({ ...form, imei: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="الماركة" value={form.deviceBrand || ""} onChange={e => setForm({ ...form, deviceBrand: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="الموديل" value={form.deviceModel || ""} onChange={e => setForm({ ...form, deviceModel: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input placeholder="اسم الفني" value={form.technicianName || ""} onChange={e => setForm({ ...form, technicianName: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <textarea placeholder="المشكلة / العطل" value={form.issue || ""} onChange={e => setForm({ ...form, issue: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50 h-16 resize-none" />
            <textarea placeholder="ملاحظات" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50 h-16 resize-none" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <select value={form.priority || "medium"} onChange={e => setForm({ ...form, priority: e.target.value as RepairTicket["priority"] })} className="px-2 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white outline-none">
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">عالي</option>
              <option value="urgent">عاجل</option>
            </select>
            <input type="number" placeholder="التكلفة" value={form.cost || ""} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input type="number" placeholder="تكلفة القطع" value={form.partsCost || ""} onChange={e => setForm({ ...form, partsCost: Number(e.target.value) })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white placeholder:text-gray-600 outline-none focus:border-cyan-700/50" />
            <input type="date" placeholder="موعد التسليم" value={form.estimatedDate || ""} onChange={e => setForm({ ...form, estimatedDate: e.target.value })} className="px-2.5 py-1.5 bg-black/30 border border-white/[0.08] rounded text-xs text-white outline-none focus:border-cyan-700/50" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">إلغاء</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-cyan-800/50 border border-cyan-600/40 text-cyan-200 rounded text-xs font-semibold hover:bg-cyan-700/60 transition-all">
              {editId ? "حفظ التعديلات" : "إنشاء التذكرة"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">لا توجد تذاكر</div>
        ) : filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-500">{t.ticketNumber}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${STATUS_LABELS[t.status].color}`}>
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
              <div className="text-xs font-bold text-green-400">{(t.cost + t.partsCost).toLocaleString()} ر.ي</div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <select value={t.status} onChange={e => handleStatusChange(t.id, e.target.value as RepairTicket["status"])} className="appearance-none bg-black/30 border border-white/[0.08] rounded pl-5 pr-2 py-1 text-[9px] text-gray-300 outline-none cursor-pointer">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.ar}</option>
                    ))}
                  </select>
                  <ChevronDown size={8} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <button onClick={() => handleEdit(t)} className="p-1 text-gray-600 hover:text-cyan-400 transition-colors"><Edit2 size={11} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
