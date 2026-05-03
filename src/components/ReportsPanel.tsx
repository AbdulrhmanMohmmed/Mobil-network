import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingUp, Package, Users, FileText, Wrench, DollarSign, AlertTriangle } from "lucide-react";
import { getShopStats, getTickets, getInvoices, getInventory, getCustomers, ShopStats, STATUS_LABELS, CATEGORY_LABELS } from "../data/store";

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-black/30 border border-white/[0.06] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={13} />
        </div>
        <span className="text-[10px] text-gray-500 font-semibold">{label}</span>
      </div>
      <div className="text-lg font-bold text-white leading-none">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {sub && <div className="text-[9px] text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500 font-mono">{value} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ReportsPanel() {
  const [stats, setStats] = useState<ShopStats | null>(null);

  const reload = useCallback(() => {
    setStats(getShopStats());
  }, []);

  useEffect(reload, [reload]);

  if (!stats) return null;

  const tickets = getTickets();
  const invoices = getInvoices();
  const inventory = getInventory();
  const customers = getCustomers();

  const statusCounts = Object.entries(STATUS_LABELS).map(([key, { ar }]) => ({
    key, ar, count: tickets.filter(t => t.status === key).length,
  }));

  const categoryCounts = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key, label, count: inventory.filter(i => i.category === key).length,
    value: inventory.filter(i => i.category === key).reduce((s, i) => s + i.quantity * i.costPrice, 0),
  }));

  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[#0e1525]">
        <BarChart3 size={14} className="text-cyan-400" />
        <h2 className="text-sm font-bold text-white">التقارير والإحصائيات</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={Wrench} label="تذاكر الصيانة" value={stats.totalTickets} sub={`${stats.activeTickets} نشطة · ${stats.completedToday} اليوم`} color="bg-cyan-900/50 text-cyan-400" />
          <StatCard icon={DollarSign} label="الإيرادات" value={`${stats.totalRevenue.toLocaleString()} ر.ي`} sub={`اليوم: ${stats.todayRevenue.toLocaleString()} ر.ي`} color="bg-green-900/50 text-green-400" />
          <StatCard icon={Users} label="العملاء" value={stats.totalCustomers} color="bg-blue-900/50 text-blue-400" />
          <StatCard icon={Package} label="المخزون" value={inventory.length} sub={stats.lowStockItems > 0 ? `${stats.lowStockItems} نفاد مخزون` : "مخزون كافي"} color="bg-purple-900/50 text-purple-400" />
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ticket Status */}
          <div className="bg-black/20 border border-white/[0.05] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={11} className="text-cyan-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">حالة التذاكر</span>
            </div>
            <div className="space-y-2">
              {statusCounts.map(s => (
                <ProgressBar key={s.key} label={s.ar} value={s.count} max={tickets.length} color={s.key === "delivered" ? "bg-green-500" : s.key === "ready" ? "bg-cyan-500" : s.key === "repairing" ? "bg-orange-500" : "bg-blue-500"} />
              ))}
            </div>
          </div>

          {/* Inventory by Category */}
          <div className="bg-black/20 border border-white/[0.05] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <Package size={11} className="text-purple-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المخزون حسب الفئة</span>
            </div>
            <div className="space-y-2">
              {categoryCounts.filter(c => c.count > 0).map(c => (
                <div key={c.key} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">{c.label}</span>
                  <span className="text-gray-300 font-mono">{c.count} صنف · {c.value.toLocaleString()} ر.ي</span>
                </div>
              ))}
              {categoryCounts.every(c => c.count === 0) && <div className="text-[10px] text-gray-600">لا توجد أصناف</div>}
            </div>
          </div>
        </div>

        {/* Two more columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Customers */}
          <div className="bg-black/20 border border-white/[0.05] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={11} className="text-green-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">أفضل العملاء</span>
            </div>
            {topCustomers.length === 0 ? (
              <div className="text-[10px] text-gray-600">لا يوجد عملاء بعد</div>
            ) : topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.03] last:border-0">
                <span className="text-[9px] text-gray-600 w-4">{i + 1}.</span>
                <span className="text-[10px] text-white flex-1">{c.name}</span>
                <span className="text-[10px] text-green-400 font-mono">{c.totalSpent.toLocaleString()} ر.ي</span>
              </div>
            ))}
          </div>

          {/* Recent Invoices */}
          <div className="bg-black/20 border border-white/[0.05] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={11} className="text-yellow-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">آخر الفواتير</span>
            </div>
            {recentInvoices.length === 0 ? (
              <div className="text-[10px] text-gray-600">لا توجد فواتير بعد</div>
            ) : recentInvoices.map(inv => (
              <div key={inv.id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.03] last:border-0">
                <span className="text-[9px] text-cyan-500 font-mono">{inv.invoiceNumber}</span>
                <span className="text-[10px] text-gray-300 flex-1 truncate">{inv.customerName}</span>
                <span className={`text-[9px] font-bold ${inv.paid ? "text-green-400" : "text-yellow-400"}`}>
                  {inv.total.toLocaleString()} ر.ي
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning */}
        {stats.lowStockItems > 0 && (
          <div className="bg-red-950/20 border border-red-700/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={11} className="text-red-400" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">تنبيه: نفاد مخزون</span>
            </div>
            <div className="space-y-1">
              {inventory.filter(i => i.quantity <= i.minStock).map(i => (
                <div key={i.id} className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-300">{i.nameAr || i.name} ({i.brand} {i.model})</span>
                  <span className="text-red-400 font-mono font-bold">{i.quantity} / {i.minStock}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
