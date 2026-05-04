import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package } from "lucide-react";
import {
  InventoryItem, getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
  CATEGORY_LABELS,
} from "../data/store";

export function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<InventoryItem["category"] | "all">("all");
  const [searchQ, setSearchQ] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const reload = useCallback(() => setItems(getInventory()), []);
  useEffect(reload, [reload]);

  const [form, setForm] = useState<Partial<InventoryItem>>({});
  const resetForm = () => { setForm({}); setEditId(null); setShowForm(false); };

  const handleSave = () => {
    if (editId) { updateInventoryItem(editId, form); }
    else { addInventoryItem(form); }
    resetForm();
    reload();
  };

  const handleEdit = (item: InventoryItem) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteInventoryItem(id);
    reload();
  };

  const lowStockCount = items.filter(i => i.quantity <= i.minStock).length;

  const filtered = items.filter(i => {
    if (filterCat !== "all" && i.category !== filterCat) return false;
    if (showLowStock && i.quantity > i.minStock) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.nameAr.includes(q) ||
        i.brand.toLowerCase().includes(q) || i.model.toLowerCase().includes(q) ||
        i.barcode.includes(q);
    }
    return true;
  });

  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.costPrice, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0d1117]">
        <Package size={14} className="text-blue-400" />
        <h2 className="text-sm font-bold text-white">إدارة المخزون</h2>
        <span className="text-[10px] text-gray-500 font-mono">{items.length} صنف · قيمة: {totalValue.toLocaleString()} ر.ي</span>
        {lowStockCount > 0 && (
          <button onClick={() => setShowLowStock(!showLowStock)} className="flex items-center gap-1 px-2 py-1 rounded bg-red-900/30 border border-red-700/30 text-red-300 text-[9px] font-semibold">
            <AlertTriangle size={9} /> {lowStockCount} نفاد مخزون
          </button>
        )}
        <div className="mr-auto" />
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-600/20 transition-all">
          <Plus size={12} /> إضافة صنف
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-[#0a0e1a]">
        <div className="flex items-center gap-1.5 flex-1 bg-[#161b22] border border-white/[0.06] rounded-lg px-2.5 py-1.5">
          <Search size={11} className="text-gray-500" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث بالاسم، الماركة، الموديل، الباركود..." className="w-full bg-transparent outline-none text-[11px] text-white placeholder:text-gray-600" />
        </div>
        <div className="flex gap-1">
          {(["all", ...Object.keys(CATEGORY_LABELS)] as const).map(c => (
            <button key={c} onClick={() => setFilterCat(c as typeof filterCat)} className={`px-2 py-1 rounded text-[9px] font-semibold transition-all ${filterCat === c ? "bg-cyan-800/40 text-blue-300 border border-blue-500/30" : "text-gray-500 hover:text-gray-300"}`}>
              {c === "all" ? "الكل" : CATEGORY_LABELS[c as InventoryItem["category"]]}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="px-4 py-3 border-b border-white/[0.06] bg-[#0d1117] space-y-2.5">
          <div className="text-xs font-bold text-blue-400 mb-2">{editId ? "تعديل صنف" : "إضافة صنف جديد"}</div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="الاسم (عربي)" value={form.nameAr || ""} onChange={e => setForm({ ...form, nameAr: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input placeholder="Name (English)" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <select value={form.category || "other"} onChange={e => setForm({ ...form, category: e.target.value as InventoryItem["category"] })} className="px-2 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white outline-none">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="الماركة" value={form.brand || ""} onChange={e => setForm({ ...form, brand: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input placeholder="الموديل" value={form.model || ""} onChange={e => setForm({ ...form, model: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input placeholder="الباركود" value={form.barcode || ""} onChange={e => setForm({ ...form, barcode: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input placeholder="المورد" value={form.supplier || ""} onChange={e => setForm({ ...form, supplier: e.target.value })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input type="number" placeholder="الكمية" value={form.quantity ?? ""} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input type="number" placeholder="سعر الشراء" value={form.costPrice ?? ""} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input type="number" placeholder="سعر البيع" value={form.sellPrice ?? ""} onChange={e => setForm({ ...form, sellPrice: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
            <input type="number" placeholder="حد أدنى" value={form.minStock ?? ""} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} className="px-2.5 py-1.5 bg-[#161b22] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">إلغاء</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition-all">
              {editId ? "حفظ التعديلات" : "إضافة الصنف"}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Table header */}
        <div className="grid grid-cols-8 gap-2 px-4 py-2 bg-[#0a0e1a] border-b border-white/[0.05] text-[9px] text-gray-600 font-bold uppercase tracking-widest sticky top-0">
          <span>الصنف</span><span>الفئة</span><span>الماركة</span><span>الكمية</span><span>سعر الشراء</span><span>سعر البيع</span><span>الربح</span><span></span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-600 text-xs">لا توجد أصناف</div>
        ) : filtered.map(item => (
          <div key={item.id} className={`grid grid-cols-8 gap-2 px-4 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all text-[11px] items-center ${item.quantity <= item.minStock ? "bg-red-950/20" : ""}`}>
            <div className="truncate">
              <div className="text-white font-semibold text-xs">{item.nameAr || item.name}</div>
              <div className="text-[9px] text-gray-600">{item.model}</div>
            </div>
            <span className="text-gray-400">{CATEGORY_LABELS[item.category]}</span>
            <span className="text-gray-400">{item.brand}</span>
            <span className={`font-mono font-bold ${item.quantity <= item.minStock ? "text-red-400" : "text-green-400"}`}>
              {item.quantity} {item.quantity <= item.minStock && <AlertTriangle size={9} className="inline" />}
            </span>
            <span className="text-gray-400 font-mono">{item.costPrice.toLocaleString()}</span>
            <span className="text-white font-mono">{item.sellPrice.toLocaleString()}</span>
            <span className="text-green-400 font-mono">{(item.sellPrice - item.costPrice).toLocaleString()}</span>
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => handleEdit(item)} className="p-1 text-gray-600 hover:text-blue-400"><Edit2 size={11} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-600 hover:text-red-400"><Trash2 size={11} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
