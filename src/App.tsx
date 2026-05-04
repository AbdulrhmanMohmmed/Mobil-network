import { useMemo, useState, useCallback } from "react";
import { BRANDS, Operation } from "./data/operations";
import { ConsolePanel, LogEntry } from "./components/ConsolePanel";
import { OperationButton } from "./components/OperationButton";
import { DeviceInfoBar } from "./components/DeviceInfoBar";
import { CopyButton } from "./components/CopyButton";
import { ScanPanel, ScanResult, generateFakeScanResult } from "./components/ScanPanel";
import { RepairTickets } from "./components/RepairTickets";
import { InventoryManager } from "./components/InventoryManager";
import { CustomerCRM } from "./components/CustomerCRM";
import { InvoiceSystem } from "./components/InvoiceSystem";
import { ReportsPanel } from "./components/ReportsPanel";
import { IMEIChecker } from "./components/IMEIChecker";
import {
  Smartphone, Zap, Clock, ScanLine, Search, Star, History, Languages, ChevronLeft,
  Wrench, Package, Users, FileText, BarChart3, Shield, Settings, Terminal, Wifi,
  Cpu, HardDrive, Activity, ChevronDown,
} from "lucide-react";

let logId = 1;
function now() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}

const DEVICE_MODELS = [
  "Samsung Galaxy A54 5G", "Xiaomi Redmi Note 12", "Huawei Y9s",
  "OPPO A57", "Tecno Spark 10", "Infinix Hot 30", "Realme C55",
  "Nokia G21", "Samsung Galaxy S23", "Xiaomi Poco X5", "Vivo Y35",
  "Samsung Galaxy A14", "Tecno Camon 20", "Infinix Note 30",
];

const BRAND_ICONS: Record<string, string> = {
  general: "⚙️", arabization: "🌍", imei_repair: "🔢", accounts: "🔐", simlock: "🔓",
  volte_net: "📶", data_recovery: "💾", hw_diag: "🩺", flash_adv: "⚡", codes: "🔑",
  samsung_pro: "🔵", motorola: "Ⓜ️", smart_tools: "🧠", advanced: "🔧",
  frp: "🛡️", cdma: "📡", qualcomm: "🔴", mtk: "🟠", unisoc: "🟣",
  samsung: "🔵", xiaomi: "🟠", huawei: "🔴", oppo: "🟢", tecno: "💙", vivo: "🟣", nokia: "📘",
};

type Lang = "ar" | "en";
type AppSection = "tools" | "tickets" | "inventory" | "customers" | "invoices" | "reports" | "imei" | "settings";

const SECTIONS: { id: AppSection; icon: React.ElementType; ar: string; en: string }[] = [
  { id: "tools", icon: Wrench, ar: "أدوات الصيانة", en: "Tools" },
  { id: "tickets", icon: FileText, ar: "تذاكر الصيانة", en: "Tickets" },
  { id: "inventory", icon: Package, ar: "المخزون", en: "Inventory" },
  { id: "customers", icon: Users, ar: "العملاء", en: "Customers" },
  { id: "invoices", icon: FileText, ar: "الفوترة", en: "Invoices" },
  { id: "reports", icon: BarChart3, ar: "التقارير", en: "Reports" },
  { id: "imei", icon: Shield, ar: "فحص IMEI", en: "IMEI" },
  { id: "settings", icon: Settings, ar: "الإعدادات", en: "Settings" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>("tools");
  const [activeBrandId, setActiveBrandId] = useState("general");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("ar");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: logId++, time: now(), type: "system", text: "Yemen Mobile Dev Tool v4.0 — تهيئة النظام..." },
    { id: logId++, time: now(), type: "system", text: "اضغط 'اتصال ADB' لتوصيل جهازك عبر USB، أو اختر عملية لتنفيذها مباشرةً" },
    { id: logId++, time: now(), type: "info", text: "يمن موبايل 421/02 · سبأفون 421/01 · يونيتل 421/04 · هيتس 421/03" },
  ]);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceModel, setDeviceModel] = useState("");
  const [androidVersion, setAndroidVersion] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [runningOpId, setRunningOpId] = useState<string | null>(null);
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [opsRun, setOpsRun] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showScan, setShowScan] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [lastOps, setLastOps] = useState<Operation[]>([]);

  const addLog = useCallback((type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { id: logId++, time: now(), type, text }]);
  }, []);

  const handleConnect = () => {
    if (connecting || connected) return;
    setConnecting(true);
    addLog("cmd", "adb kill-server && adb start-server");
    setTimeout(() => addLog("cmd", "adb devices"), 300);
    setTimeout(() => {
      const model = DEVICE_MODELS[Math.floor(Math.random() * DEVICE_MODELS.length)];
      const android = `${Math.floor(Math.random() * 4) + 10}.0`;
      const sdk = Math.floor(Math.random() * 6) + 30;
      const serial = Math.random().toString(36).substring(2, 12).toUpperCase();
      addLog("success", `جهاز متصل: ${model}`);
      addLog("info", `Android ${android} | SDK ${sdk} | Serial: ${serial}`);
      addLog("info", "USB Debugging: مفعّل ✓ | ADB Authorization: مقبول ✓");
      setConnected(true);
      setConnecting(false);
      setDeviceModel(model);
      setAndroidVersion(android);
      setSerialNo(serial);
    }, 1200);
  };

  const handleDisconnect = useCallback(() => {
    addLog("warn", "تم قطع الاتصال.");
    setConnected(false);
    setDeviceModel("");
    setAndroidVersion("");
    setSerialNo("");
    setScanResult(null);
    setShowScan(false);
  }, [addLog]);

  const handleOperation = useCallback((op: Operation) => {
    setSelectedOp(op);
    if (runningOpId) return;

    if (op.isScan) {
      setShowScan(true);
      setScanResult(null);
      setScanning(true);
      setOpsRun((v) => v + 1);
      setLastOps((prev) => [op, ...prev.filter((item) => item.id !== op.id)].slice(0, 6));
      addLog("system", `🔍 فحص: ${op.labelAr}`);
      op.commands.forEach((cmd, i) => setTimeout(() => addLog("cmd", cmd), i * 130));
      setTimeout(() => {
        const result = generateFakeScanResult();
        setScanResult(result);
        setScanning(false);
        addLog("success", `✓ اكتمل الفحص — ${result.brand} ${result.model}`);
      }, op.commands.length * 130 + 700);
      return;
    }

    setRunningOpId(op.id);
    setShowScan(false);
    setOpsRun((v) => v + 1);
    setLastOps((prev) => [op, ...prev.filter((item) => item.id !== op.id)].slice(0, 6));
    addLog("system", `▶ تنفيذ: ${op.labelAr} (${op.commands.length} أمر)`);
    op.commands.forEach((cmd, i) => {
      setTimeout(() => {
        addLog("cmd", cmd);
        if (i === op.commands.length - 1) {
          setTimeout(() => {
            addLog("success", `✓ اكتمل: ${op.labelAr}`);
            setRunningOpId(null);
          }, 400);
        }
      }, i * 150);
    });
  }, [addLog, runningOpId]);

  const handleQuickScan = () => {
    setShowScan(true);
    setScanResult(null);
    setScanning(true);
    const scanCmds = [
      "adb shell getprop ro.product.model",
      "adb shell getprop ro.build.version.release",
      "adb shell getprop gsm.operator.alpha",
      "adb shell service call iphonesubinfo 1",
      "adb shell dumpsys battery | grep level",
      "adb shell df /data | tail -1",
      "adb shell settings get global preferred_network_mode",
      "adb shell settings get global volte_vt_enabled",
      "adb shell settings get secure user_setup_complete",
    ];
    addLog("system", "🔍 فحص سريع شامل للجهاز...");
    scanCmds.forEach((cmd, i) => setTimeout(() => addLog("cmd", cmd), i * 150));
    setTimeout(() => {
      const result = generateFakeScanResult();
      setScanResult(result);
      setScanning(false);
      addLog("success", `✓ اكتمل الفحص — ${result.brand} ${result.model} | Android ${result.android}`);
    }, scanCmds.length * 150 + 700);
  };

  const activeBrand = BRANDS.find((b) => b.id === activeBrandId)!;
  const allOperations = useMemo(() => BRANDS.flatMap((b) => b.groups.flatMap((g) => g.operations)), []);
  const totalOperations = allOperations.length;
  const favoriteCount = favorites.length;
  const scanCount = allOperations.filter((op) => op.isScan).length;
  const displayGroups = activeGroupId ? activeBrand.groups.filter((g) => g.id === activeGroupId) : activeBrand.groups;
  const filteredOps = useMemo(() => {
    const term = query.trim().toLowerCase();
    return activeBrand.groups
      .map((group) => ({
        ...group,
        operations: group.operations.filter((op) => {
          const inQuery = !term || op.labelAr.toLowerCase().includes(term) || op.label.toLowerCase().includes(term) || op.description.toLowerCase().includes(term);
          const inFav = !showOnlyFavs || favorites.includes(op.id);
          return inQuery && inFav;
        }),
      }))
      .filter((group) => group.operations.length > 0);
  }, [activeBrand.groups, favorites, query, showOnlyFavs]);
  const toggleFavorite = useCallback((opId: string) => {
    setFavorites((prev) => prev.includes(opId) ? prev.filter((id) => id !== opId) : [...prev, opId]);
  }, []);
  const visibleGroups = filteredOps.length ? filteredOps : displayGroups.map((group) => ({
    ...group,
    operations: group.operations.filter((op) => {
      const term = query.trim().toLowerCase();
      const inQuery = !term || op.labelAr.toLowerCase().includes(term) || op.label.toLowerCase().includes(term) || op.description.toLowerCase().includes(term);
      const inFav = !showOnlyFavs || favorites.includes(op.id);
      return inQuery && inFav;
    }),
  })).filter((group) => group.operations.length > 0);

  const t = lang === "ar" ? {
    subtitle: "أداة شاملة للتشخيص والإصلاح",
    search: "ابحث عن عملية...",
    favorites: "المفضلة",
    quickScan: "فحص سريع",
    details: "التفاصيل",
    lang: "EN",
    brands: "ماركة",
    operations: "عملية",
    scans: "فحص",
    noDevice: "لا يوجد اتصال — وصّل الجهاز عبر USB",
  } : {
    subtitle: "All-in-one repair workspace",
    search: "Search operations...",
    favorites: "Favorites",
    quickScan: "Quick Scan",
    details: "Details",
    lang: "عر",
    brands: "brands",
    operations: "ops",
    scans: "scans",
    noDevice: "No device — connect via USB",
  };

  const renderSection = () => {
    switch (activeSection) {
      case "tickets": return <RepairTickets />;
      case "inventory": return <InventoryManager />;
      case "customers": return <CustomerCRM />;
      case "invoices": return <InvoiceSystem />;
      case "reports": return <ReportsPanel />;
      case "imei": return <IMEIChecker />;
      case "settings": return <SettingsPanel lang={lang} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-200 overflow-hidden select-none" dir="rtl">
      {/* ─── Left Navigation Rail ─── */}
      <nav className="w-16 shrink-0 bg-[#0d1117] flex flex-col items-center py-3 gap-1 border-l border-white/[0.06]">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
          <Smartphone size={18} className="text-white" />
        </div>
        {SECTIONS.map(s => {
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                active
                  ? "bg-blue-500/15 text-blue-400 shadow-sm"
                  : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]"
              }`}
              title={lang === "ar" ? s.ar : s.en}
            >
              <s.icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[8px] font-medium leading-none">{lang === "ar" ? s.ar.split(" ")[0] : s.en.split(" ")[0]}</span>
            </button>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button onClick={() => setLang((v) => (v === "ar" ? "en" : "ar"))} className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-all">
            <Languages size={14} />
          </button>
          <div className="text-[8px] font-mono text-gray-700">v4.0</div>
        </div>
      </nav>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ─── Top Header ─── */}
        <header className="h-12 shrink-0 bg-[#0d1117] border-b border-white/[0.06] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-white">
              {lang === "ar" ? SECTIONS.find(s => s.id === activeSection)!.ar : SECTIONS.find(s => s.id === activeSection)!.en}
            </h1>
            {activeSection === "tools" && (
              <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">{BRANDS.length} {t.brands}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">{totalOperations}+ {t.operations}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">{scanCount} {t.scans}</span>
              </div>
            )}
          </div>
          <DeviceInfoBar connected={connected} connecting={connecting} deviceModel={deviceModel} androidVersion={androidVersion} serialNo={serialNo} onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </header>

        {activeSection === "tools" ? (
          <div className="flex-1 flex min-h-0">
            {/* ─── Brand Sidebar ─── */}
            <aside className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} shrink-0 bg-[#0d1117]/80 border-l border-white/[0.05] flex flex-col transition-all duration-300`}>
              {/* Search + Controls */}
              <div className="p-3 space-y-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-1.5 bg-[#161b22] rounded-lg px-2.5 py-2 border border-white/[0.06] focus-within:border-blue-500/30 transition-colors">
                  <Search size={13} className="text-gray-600 shrink-0" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="w-full bg-transparent outline-none text-xs text-gray-200 placeholder:text-gray-600" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleQuickScan} disabled={scanning} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[10px] font-semibold transition-all disabled:opacity-40">
                    <ScanLine size={11} />
                    {scanning ? "..." : t.quickScan}
                  </button>
                  <button onClick={() => setShowOnlyFavs((v) => !v)} className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${showOnlyFavs ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300"}`}>
                    <Star size={10} fill={showOnlyFavs ? "currentColor" : "none"} />
                    {favoriteCount}
                  </button>
                </div>
              </div>
              {/* Brand List */}
              <div className="flex-1 overflow-y-auto py-1">
                {BRANDS.map((brand) => {
                  const active = activeBrandId === brand.id;
                  const opCount = brand.groups.reduce((a, g) => a + g.operations.length, 0);
                  return (
                    <button
                      key={brand.id}
                      onClick={() => { setActiveBrandId(brand.id); setActiveGroupId(null); setSelectedOp(null); setShowScan(false); }}
                      className={`w-full text-right px-3 py-2.5 flex items-center gap-2.5 transition-all duration-150 ${
                        active
                          ? "bg-white/[0.06] text-white"
                          : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0 transition-all" style={{ backgroundColor: active ? brand.color : "transparent", boxShadow: active ? `0 0 8px ${brand.color}60` : "none" }} />
                      <span className="text-base leading-none">{BRAND_ICONS[brand.id] ?? "📱"}</span>
                      <div className="flex-1 text-right leading-tight min-w-0">
                        <div className="text-[11px] font-semibold truncate">{brand.nameAr}</div>
                        <div className="text-[9px] opacity-40 truncate">{brand.chipset}</div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-700 tabular-nums">{opCount}</span>
                    </button>
                  );
                })}
              </div>
              {/* Yemen Networks Footer */}
              <div className="px-3 py-2.5 border-t border-white/[0.05] space-y-1">
                <div className="text-[9px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                  <Wifi size={9} />
                  شبكات اليمن
                </div>
                {[
                  { name: "يمن موبايل", code: "421/02" },
                  { name: "سبأفون", code: "421/01" },
                  { name: "يونيتل (YOU)", code: "421/04" },
                  { name: "هيتس", code: "421/03" },
                ].map(n => (
                  <div key={n.code} className="flex items-center justify-between text-[8px]">
                    <span className="text-gray-500">{n.name}</span>
                    <span className="font-mono text-gray-700">{n.code}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* ─── Operations Content ─── */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Group Tabs Bar */}
              <div className="flex items-center bg-[#0d1117]/60 border-b border-white/[0.05] shrink-0 px-1 gap-0">
                <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 transition-all ml-1">
                  <ChevronLeft size={14} className={`transition-transform duration-200 ${sidebarOpen ? "" : "rotate-180"}`} />
                </button>
                <div className="flex items-center gap-1 px-1 text-[11px] font-bold text-gray-300 shrink-0 border-l border-white/[0.05] mr-2 pr-2">
                  <span>{BRAND_ICONS[activeBrandId] ?? "📱"}</span>
                  <span>{activeBrand.nameAr}</span>
                </div>
                <div className="flex items-center gap-0.5 overflow-x-auto flex-1">
                  <button onClick={() => setActiveGroupId(null)} className={`px-3 py-2 text-[10px] font-semibold whitespace-nowrap rounded-lg transition-all ${activeGroupId === null ? "bg-blue-500/15 text-blue-400" : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]"}`}>
                    الكل
                  </button>
                  {activeBrand.groups.map((group) => (
                    <button key={group.id} onClick={() => setActiveGroupId(group.id)} className={`px-3 py-2 text-[10px] font-semibold whitespace-nowrap rounded-lg transition-all ${activeGroupId === group.id ? "bg-blue-500/15 text-blue-400" : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]"}`}>
                      {group.titleAr}
                    </button>
                  ))}
                </div>
                {runningOpId && (
                  <div className="mr-auto px-3 flex items-center gap-1.5 text-[10px] text-amber-400 font-mono shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    جاري التنفيذ...
                  </div>
                )}
              </div>

              {/* Operations Grid */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {visibleGroups.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center text-gray-600 text-sm">لا توجد نتائج مطابقة</div>
                ) : visibleGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-4 rounded-full bg-blue-500/40 shrink-0" />
                      <span className="text-[11px] font-bold text-gray-400">{group.titleAr}</span>
                      <span className="flex-1 h-px bg-white/[0.03]" />
                      <span className="text-[9px] text-gray-700 font-mono">{group.operations.length}</span>
                    </div>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                      {group.operations.map((op) => (
                        <OperationButton key={op.id} operation={op} onClick={handleOperation} active={selectedOp?.id === op.id} running={runningOpId === op.id} favorite={favorites.includes(op.id)} onToggleFavorite={() => toggleFavorite(op.id)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Right Detail Panel ─── */}
            <aside className="w-80 shrink-0 bg-[#0d1117]/80 border-r border-white/[0.05] flex flex-col overflow-hidden">
              {showScan ? (
                <ScanPanel result={scanResult} scanning={scanning} onClose={() => setShowScan(false)} />
              ) : (
                <>
                  <div className="px-4 py-3 flex items-center gap-2 border-b border-white/[0.05] shrink-0">
                    <Zap size={12} className="text-blue-400" />
                    <span className="text-xs font-bold text-gray-300">{t.details}</span>
                  </div>
                  {selectedOp ? (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Op Info Card */}
                      <div className="bg-[#161b22] rounded-xl p-4 border border-white/[0.06]">
                        <div className="text-sm font-bold text-white leading-snug">{selectedOp.labelAr}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">{selectedOp.label}</div>
                        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">{selectedOp.description}</p>
                        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-600">
                          <span className="flex items-center gap-1"><Terminal size={10} />{selectedOp.commands.length} أمر</span>
                          {selectedOp.requiresRoot && <span className="text-red-400">يتطلب Root</span>}
                          {selectedOp.isScan && <span className="text-purple-400">فحص مباشر</span>}
                        </div>
                      </div>
                      {/* Commands */}
                      <div className="space-y-2">
                        {selectedOp.commands.map((cmd, i) => (
                          <div key={`${selectedOp.id}-${i}`} className="bg-[#161b22] rounded-lg overflow-hidden border border-white/[0.06]">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.04]">
                              <span className="text-[9px] text-gray-600 font-mono">#{i + 1}</span>
                              <CopyButton text={cmd} label="نسخ" />
                            </div>
                            <div className="px-3 py-2">
                              <code className="font-mono text-[10px] text-amber-300/80 whitespace-pre-wrap break-all leading-relaxed select-text">{cmd}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Action Buttons */}
                      <button onClick={() => handleOperation(selectedOp)} disabled={!!runningOpId} className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                        {runningOpId === selectedOp.id ? (
                          <><span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> جاري التنفيذ...</>
                        ) : (
                          <><Zap size={12} /> تنفيذ</>
                        )}
                      </button>
                      <button onClick={() => toggleFavorite(selectedOp.id)} className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${favorites.includes(selectedOp.id) ? "bg-amber-500/15 border-amber-500/25 text-amber-400" : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-amber-400"}`}>
                        <Star size={12} fill={favorites.includes(selectedOp.id) ? "currentColor" : "none"} />
                        {favorites.includes(selectedOp.id) ? "★ إزالة من المفضلة" : "☆ إضافة إلى المفضلة"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-white/[0.06] flex items-center justify-center">
                        <Zap size={24} className="text-gray-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-600 text-xs">اضغط على أي عملية</div>
                        <div className="text-gray-700 text-[10px]">لعرض التفاصيل والأوامر</div>
                      </div>
                      <button onClick={handleQuickScan} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold hover:bg-blue-500/20 transition-all">
                        <ScanLine size={12} />
                        {t.quickScan}
                      </button>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden">
            {renderSection()}
          </div>
        )}

        {/* ─── Console ─── */}
        <ConsolePanel logs={logs} onClear={() => setLogs([])} />

        {/* ─── Status Bar ─── */}
        <footer className="h-7 shrink-0 flex items-center justify-between px-4 bg-[#0d1117] border-t border-white/[0.05] text-[9px] font-mono text-gray-600">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 ${connected ? "text-emerald-500" : "text-gray-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-700"}`} />
              {connected ? `${deviceModel}` : t.noDevice}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {scanResult && <span className="text-blue-500">{scanResult.brand} {scanResult.model}</span>}
            <span className="flex items-center gap-1"><Activity size={8} />{opsRun}</span>
            <span className="flex items-center gap-1"><History size={8} />{lastOps.length}</span>
            <span className="text-gray-700">Yemen Mobile Dev Tool v4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── Settings Panel ──────────────────────────────────────────────────────────

function SettingsPanel({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0e1a]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
          <Settings size={16} className="text-blue-400" />
        </div>
        <h2 className="text-base font-bold text-white">{lang === "ar" ? "الإعدادات" : "Settings"}</h2>
      </div>
      <div className="p-5 space-y-4 max-w-3xl">
        {/* System Info */}
        <div className="bg-[#161b22] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Cpu size={14} className="text-blue-400" />
            معلومات النظام
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {[
              ["الإصدار", "v4.0"],
              ["الماركات", `${BRANDS.length}`],
              ["العمليات", `${BRANDS.flatMap(b => b.groups.flatMap(g => g.operations)).length}+`],
              ["التقنية", "React 19 + Vite 6 + TS"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-mono font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-[#161b22] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <HardDrive size={14} className="text-emerald-400" />
            الميزات
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "تعريب الهواتف (CSC/Locale/ROM)",
              "إصلاح IMEI (QC/MTK/SPD/Samsung)",
              "إزالة حسابات (Mi/Huawei/Samsung/OPPO)",
              "كشف وفك قفل الشبكة (SIM Lock)",
              "VoLTE متقدم (DIAG/MTK/SPD)",
              "استعادة البيانات (Recovery)",
              "تشخيص الهاردوير (شاشة/بطارية/حساسات)",
              "فلاش متقدم (Odin/SP Flash/QFIL/EDL)",
              "أكواد وكلمات مرور (PIN/FRP/NCK)",
              "Samsung متخصص (DRK/CSC/Knox)",
              "Motorola (VoLTE/FRP/Bootloader)",
              "أدوات ذكية (أصالة/تقرير/IMEI)",
              "CDMA/QCDMA — NV/EFS/MCFG",
              "FRP Bypass شامل (كل الماركات)",
              "نظام إدارة المحل الكامل",
              "فحص IMEI + TAC + Blacklist",
              "تقارير وإحصائيات",
              "PWA جاهز للتثبيت",
              "600+ عملية برمجة",
              "26 قسم متخصص",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-gray-300 bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* External Tools */}
        <div className="bg-[#161b22] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Terminal size={14} className="text-purple-400" />
            أدوات خارجية
          </h3>
          <div className="space-y-2 text-[11px]">
            {[
              { tool: "ADB", desc: "Android Debug Bridge" },
              { tool: "Fastboot", desc: "أداة الفلاش عبر Bootloader" },
              { tool: "QPST", desc: "Qualcomm DIAG diagnostics" },
              { tool: "scrcpy", desc: "التحكم بالشاشة عن بعد" },
              { tool: "QFIL", desc: "فلاش Qualcomm EDL" },
              { tool: "SP Flash Tool", desc: "فلاش MediaTek" },
              { tool: "Odin", desc: "فلاش Samsung" },
            ].map(({ tool, desc }) => (
              <div key={tool} className="flex items-center gap-3 bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-blue-400 font-mono font-semibold w-24">{tool}</span>
                <span className="text-gray-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yemen Networks */}
        <div className="bg-[#161b22] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Wifi size={14} className="text-amber-400" />
            شبكات اليمن
          </h3>
          <div className="space-y-2">
            {[
              { name: "يمن موبايل", code: "MCC:421 MNC:02", color: "text-blue-400" },
              { name: "سبأفون", code: "MCC:421 MNC:01", color: "text-emerald-400" },
              { name: "يونيتل (YOU)", code: "MCC:421 MNC:04", color: "text-purple-400" },
              { name: "هيتس", code: "MCC:421 MNC:03", color: "text-amber-400" },
            ].map(n => (
              <div key={n.code} className="flex items-center justify-between bg-white/[0.02] rounded-lg px-3 py-2.5 text-[11px]">
                <span className={`font-semibold ${n.color}`}>{n.name}</span>
                <span className="text-gray-500 font-mono">{n.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
