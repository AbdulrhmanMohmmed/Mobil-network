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
  Smartphone, Zap, Clock, ScanLine, Search, Star, Filter, History, Languages, Grid2x2, Menu,
  Wrench, Package, Users, FileText, BarChart3, Shield, Settings,
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
  general: "⚙️",
  frp: "🛡️",
  qualcomm: "🔴",
  mtk: "🟠",
  unisoc: "🟣",
  samsung: "🔵",
  xiaomi: "🟠",
  huawei: "🔴",
  oppo: "🟢",
  tecno: "💙",
  vivo: "🟣",
  nokia: "📘",
};

type Lang = "ar" | "en";
type AppSection = "tools" | "tickets" | "inventory" | "customers" | "invoices" | "reports" | "imei" | "settings";

const SECTIONS: { id: AppSection; icon: React.ElementType; ar: string; en: string }[] = [
  { id: "tools", icon: Wrench, ar: "أدوات الصيانة", en: "Repair Tools" },
  { id: "tickets", icon: FileText, ar: "تذاكر الصيانة", en: "Tickets" },
  { id: "inventory", icon: Package, ar: "المخزون", en: "Inventory" },
  { id: "customers", icon: Users, ar: "العملاء", en: "Customers" },
  { id: "invoices", icon: FileText, ar: "الفوترة", en: "Invoices" },
  { id: "reports", icon: BarChart3, ar: "التقارير", en: "Reports" },
  { id: "imei", icon: Shield, ar: "فحص IMEI", en: "IMEI Check" },
  { id: "settings", icon: Settings, ar: "الإعدادات", en: "Settings" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>("tools");
  const [activeBrandId, setActiveBrandId] = useState("general");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("ar");
  const [compactView, setCompactView] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: logId++, time: now(), type: "system", text: "Yemen Mobile Dev Tool v3.0 — تهيئة النظام..." },
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
  }, [addLog]);

  const handleOperation = useCallback((op: Operation) => {
    setSelectedOp(op);
    if (runningOpId) return;
    setRunningOpId(op.id);
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

  const text = {
    ar: {
      subtitle: "واجهة مبسطة للتشخيص والإصلاح",
      search: "ابحث عن عملية، ماركة، أو وصف...",
      favorites: "المفضلة",
      clear: "تصفير الفلتر",
      quickScan: "⚡ فحص سريع",
      details: "تفاصيل مختصرة",
      simple: "عرض مبسط",
      full: "عرض كامل",
      lang: "العربية",
      brands: "ماركة",
      operations: "عملية",
      scans: "فحص مباشر",
      recent: "حديثاً",
      noDevice: "لا يوجد اتصال — قم بتوصيل الجهاز عبر USB",
      connected: "متصل",
      disconnected: "غير متصل",
    },
    en: {
      subtitle: "Simplified repair workspace",
      search: "Search operation, brand, or description...",
      favorites: "Favorites",
      clear: "Clear filters",
      quickScan: "⚡ Quick scan",
      details: "Quick details",
      simple: "Simple view",
      full: "Full view",
      lang: "English",
      brands: "brands",
      operations: "operations",
      scans: "direct scans",
      recent: "recent",
      noDevice: "No device connected — plug in USB",
      connected: "Connected",
      disconnected: "Disconnected",
    },
  }[lang];

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
    <div className="flex flex-col h-screen bg-[#0b1120] text-white overflow-hidden select-none" dir="rtl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0e1525] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/90" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/90" />
            <span className="w-3 h-3 rounded-full bg-green-500/90" />
          </div>
          <div className="flex items-center gap-2.5 mr-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <Smartphone size={15} strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-white">Yemen Mobile Dev Tool</div>
              <div className="text-[10px] text-cyan-400/70 font-mono tracking-wide">{text.subtitle} · {BRANDS.length} {text.brands} · {totalOperations}+ {text.operations}</div>
            </div>
          </div>
        </div>
        {/* Section Tabs */}
        <div className="flex items-center gap-0.5 bg-black/30 border border-white/[0.06] rounded-lg p-0.5">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-semibold transition-all ${activeSection === s.id ? "bg-cyan-800/40 text-cyan-300 border border-cyan-600/30" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"}`}>
              <s.icon size={11} />
              {lang === "ar" ? s.ar : s.en}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang((v) => (v === "ar" ? "en" : "ar"))} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300">
            <Languages size={11} />
            {text.lang}
          </button>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-semibold">v3.0</span>
        </div>
      </div>

      <DeviceInfoBar connected={connected} connecting={connecting} deviceModel={deviceModel} androidVersion={androidVersion} serialNo={serialNo} onConnect={handleConnect} onDisconnect={handleDisconnect} />

      {/* Main content */}
      {activeSection === "tools" ? (
        <>
          {/* Tools toolbar */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#080e1c] border-b border-white/[0.05] shrink-0">
            <button onClick={handleQuickScan} disabled={scanning} className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-900/30 border border-cyan-700/40 text-cyan-300 hover:bg-cyan-800/40 transition-all text-[10px] font-semibold disabled:opacity-40">
              <ScanLine size={11} />
              {scanning ? "جاري الفحص..." : text.quickScan}
            </button>
            {scanResult && !scanning && (
              <button onClick={() => setShowScan(!showScan)} className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-900/30 border border-green-700/40 text-green-300 hover:bg-green-800/40 transition-all text-[10px] font-semibold">
                ✓ عرض نتائج الفحص — {scanResult.brand} {scanResult.model}
              </button>
            )}
            <button onClick={() => setCompactView((v) => !v)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300">
              {compactView ? <Grid2x2 size={11} /> : <Menu size={11} />}
              {compactView ? text.full : text.simple}
            </button>
            <div className="mr-auto flex items-center gap-2 text-[9px] text-gray-700 font-mono">
              <span>{BRANDS.length} {text.brands}</span>
              <span>·</span>
              <span>{totalOperations} {text.operations}</span>
              <span>·</span>
              <span>{scanCount} {text.scans}</span>
              <span>·</span>
              <span>{favoriteCount} {text.favorites}</span>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-white/[0.05] bg-[#09101e] flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-0 bg-black/30 border border-white/[0.06] rounded-lg px-3 py-2">
              <Search size={12} className="text-gray-500 shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text.search} className="w-full bg-transparent outline-none text-xs text-white placeholder:text-gray-600" />
            </div>
            <button onClick={() => setShowOnlyFavs((v) => !v)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-semibold transition-all ${showOnlyFavs ? "bg-yellow-900/25 border-yellow-700/40 text-yellow-300" : "bg-black/25 border-white/10 text-gray-400 hover:text-white"}`}>
              <Star size={11} />
              {text.favorites}
            </button>
            <button onClick={() => { setQuery(""); setShowOnlyFavs(false); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-gray-400 hover:text-white text-[10px] font-semibold">
              <Filter size={11} />
              {text.clear}
            </button>
          </div>

          {/* Tools main area */}
          <div className="flex flex-1 min-h-0">
            {/* Brand sidebar */}
            <aside className={`${compactView ? "w-20" : "w-52"} shrink-0 bg-[#0e1525] border-l border-white/[0.07] flex flex-col overflow-y-auto`}>
              <div className="px-3 pt-2.5 pb-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2 border-b border-white/[0.05]">
                <span className="flex-1 h-px bg-gray-800" />
                {compactView ? "" : "الماركات"}
                <span className="flex-1 h-px bg-gray-800" />
              </div>
              {BRANDS.map((brand) => {
                const active = activeBrandId === brand.id;
                const opCount = brand.groups.reduce((a, g) => a + g.operations.length, 0);
                return (
                  <button key={brand.id} onClick={() => { setActiveBrandId(brand.id); setActiveGroupId(null); setSelectedOp(null); setShowScan(false); }} className={`w-full text-right px-3 py-3 text-xs font-medium border-b border-white/[0.03] transition-all duration-150 flex items-center gap-2 ${active ? "text-white bg-white/[0.06]" : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300"}`} style={active ? { boxShadow: `inset -3px 0 0 ${brand.color}` } : undefined}>
                    <span className="w-2 h-2 rounded-full shrink-0 transition-all" style={{ backgroundColor: active ? brand.color : "#374151", boxShadow: active ? `0 0 6px ${brand.color}80` : "none" }} />
                    <span className="text-sm leading-none">{BRAND_ICONS[brand.id] ?? "📱"}</span>
                    {!compactView && (
                      <div className="flex-1 text-right leading-tight min-w-0">
                        <div className="font-semibold truncate">{brand.nameAr}</div>
                        <div className="text-[9px] opacity-40 mt-0.5 truncate">{brand.chipset}</div>
                      </div>
                    )}
                    <span className="text-[9px] text-gray-700 shrink-0">{opCount}</span>
                  </button>
                );
              })}
              <div className="mt-auto px-3 py-3 border-t border-white/[0.05] text-[9px] text-gray-700 font-mono space-y-0.5">
                <div className="font-bold text-gray-600 mb-1">شبكات اليمن</div>
                <div>يمن موبايل 421/02</div>
                <div>سبأفون 421/01</div>
                <div>يونيتل (YOU) 421/04</div>
                <div>هيتس 421/03</div>
              </div>
            </aside>

            {/* Operations area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="flex items-center bg-[#0e1525] border-b border-white/[0.07] overflow-x-auto shrink-0 gap-0">
                <div className="px-3 py-2.5 text-[10px] font-bold border-l border-white/[0.07] shrink-0 flex items-center gap-1.5">
                  <span className="text-sm">{BRAND_ICONS[activeBrandId] ?? "📱"}</span>
                  <span className="text-gray-400">{activeBrand.nameAr}</span>
                </div>
                <button onClick={() => setActiveGroupId(null)} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeGroupId === null ? "border-cyan-400 text-cyan-300 bg-white/[0.04]" : "border-transparent text-gray-600 hover:text-gray-300 hover:bg-white/[0.02]"}`}>
                  الكل
                </button>
                {activeBrand.groups.map((group) => (
                  <button key={group.id} onClick={() => setActiveGroupId(group.id)} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeGroupId === group.id ? "border-cyan-400 text-cyan-300 bg-white/[0.04]" : "border-transparent text-gray-600 hover:text-gray-300 hover:bg-white/[0.02]"}`}>
                    {group.titleAr}
                  </button>
                ))}
                {runningOpId && (
                  <div className="mr-auto px-3 flex items-center gap-1.5 text-[10px] text-amber-300 font-mono shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    جاري التنفيذ...
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {visibleGroups.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center text-gray-600 text-sm">لا توجد نتائج مطابقة</div>
                ) : visibleGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shrink-0" />
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{group.titleAr}</span>
                      <span className="flex-1 h-px bg-white/[0.03]" />
                      <span className="text-[9px] text-gray-700">{group.operations.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.operations.map((op) => (
                        <OperationButton key={op.id} operation={op} onClick={handleOperation} active={selectedOp?.id === op.id} running={runningOpId === op.id} favorite={favorites.includes(op.id)} onToggleFavorite={() => toggleFavorite(op.id)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel: Details / Scan */}
            <aside className="w-72 shrink-0 bg-[#0e1525] border-r border-white/[0.07] flex flex-col overflow-hidden">
              {showScan ? (
                <ScanPanel result={scanResult} scanning={scanning} onClose={() => setShowScan(false)} />
              ) : (
                <>
                  <div className="px-3 py-2.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2 border-b border-white/[0.05] shrink-0">
                    <Zap size={10} className="text-cyan-400" />
                    {text.details}
                  </div>
                  {selectedOp ? (
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                        <div className="text-sm font-bold text-white leading-tight">{selectedOp.labelAr}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">{selectedOp.label}</div>
                        <div className="text-[11px] text-gray-400 mt-2 leading-relaxed">{selectedOp.description}</div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{selectedOp.commands.length} أمر للتنفيذ</span>
                      </div>
                      <div className="space-y-2">
                        {selectedOp.commands.map((cmd, i) => (
                          <div key={`${selectedOp.id}-${i}`} className="bg-black/40 rounded-lg overflow-hidden border border-white/[0.06]">
                            <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] border-b border-white/[0.05]">
                              <span className="text-[9px] text-gray-700 font-mono">#{i + 1}</span>
                              <CopyButton text={cmd} label="نسخ" />
                            </div>
                            <div className="px-2.5 py-2">
                              <span className="font-mono text-[10px] text-amber-300/90 whitespace-pre-wrap break-all leading-relaxed select-text">{cmd}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleOperation(selectedOp)} disabled={!!runningOpId} className="w-full py-2.5 bg-gradient-to-r from-cyan-800/60 to-blue-800/60 hover:from-cyan-700/70 hover:to-blue-700/70 border border-cyan-700/40 text-cyan-200 text-xs font-bold rounded-lg transition-all disabled:opacity-40">
                        {runningOpId === selectedOp.id ? "⏳ جاري التنفيذ..." : "▶ تنفيذ مجدداً"}
                      </button>
                      <button onClick={() => toggleFavorite(selectedOp.id)} className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-bold rounded-lg transition-all text-yellow-300">
                        {favorites.includes(selectedOp.id) ? "★ إزالة من المفضلة" : "☆ إضافة إلى المفضلة"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <Zap size={22} className="text-gray-700" />
                      </div>
                      <div className="text-gray-700 text-xs leading-relaxed">اضغط على أي عملية<br />لعرض تفاصيلها وأوامرها</div>
                      <button onClick={handleQuickScan} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-900/30 border border-cyan-700/30 text-cyan-400 text-[10px] font-semibold hover:bg-cyan-800/40 transition-all">
                        <ScanLine size={11} />
                        {text.quickScan}
                      </button>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
        </>
      ) : (
        /* Other sections */
        <div className="flex-1 min-h-0 overflow-hidden">
          {renderSection()}
        </div>
      )}

      <ConsolePanel logs={logs} onClear={() => setLogs([])} />

      <div className="flex items-center justify-between px-4 py-1 bg-[#060a12] border-t border-white/[0.04] text-[9px] text-gray-700 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className={connected ? "text-green-500" : "text-gray-700"}>
            ● {connected ? `متصل — ${deviceModel} · Android ${androidVersion}` : text.noDevice}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {scanResult && <span className="text-cyan-600">آخر فحص: {scanResult.brand} {scanResult.model}</span>}
          <span className="flex items-center gap-1"><Clock size={9} />عمليات: {opsRun}</span>
          <span className="flex items-center gap-1"><History size={9} />حديثاً: {lastOps.length}</span>
          <span>|</span>
          <span>{BRANDS.length} {text.brands}</span>
          <span>|</span>
          <span>ADB v1.0.41</span>
          <span>|</span>
          <span>Yemen Mobile Dev Tool v3.0</span>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Panel ──────────────────────────────────────────────────────────

function SettingsPanel({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[#0e1525]">
        <Settings size={14} className="text-cyan-400" />
        <h2 className="text-sm font-bold text-white">{lang === "ar" ? "الإعدادات" : "Settings"}</h2>
      </div>
      <div className="p-4 space-y-4 max-w-2xl">
        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-xs font-bold text-white mb-3">معلومات النظام</h3>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between"><span className="text-gray-400">الإصدار</span><span className="text-white font-mono">v3.0</span></div>
            <div className="flex justify-between"><span className="text-gray-400">الماركات المدعومة</span><span className="text-white font-mono">{BRANDS.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">إجمالي العمليات</span><span className="text-white font-mono">{BRANDS.flatMap(b => b.groups.flatMap(g => g.operations)).length}+</span></div>
            <div className="flex justify-between"><span className="text-gray-400">التقنية</span><span className="text-white font-mono">React 19 + Vite 6 + TypeScript</span></div>
          </div>
        </div>

        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-xs font-bold text-white mb-3">الميزات الرئيسية</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "أدوات الصيانة والبرمجة (ADB/Fastboot)",
              "تعريب الهواتف (CSC + Locale)",
              "تشخيص متقدم (بطارية، شاشة، حساسات)",
              "نسخ احتياطي واستعادة",
              "FRP Bypass لجميع الماركات",
              "نظام تذاكر الصيانة",
              "إدارة المخزون",
              "إدارة العملاء CRM",
              "الفوترة والإيصالات",
              "فحص IMEI",
              "التحكم عن بعد (scrcpy)",
              "تقارير وإحصائيات",
              "دعم Unisoc/SPD",
              "12 ماركة مدعومة",
              "واجهة عربية RTL",
              "PWA جاهز للتثبيت",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-xs font-bold text-white mb-3">أدوات خارجية مطلوبة</h3>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">ADB</span><span className="text-gray-400">— Android Debug Bridge</span></div>
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">Fastboot</span><span className="text-gray-400">— أداة الفلاش عبر Bootloader</span></div>
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">scrcpy</span><span className="text-gray-400">— التحكم بالشاشة عن بعد (اختياري)</span></div>
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">QFIL</span><span className="text-gray-400">— فلاش Qualcomm EDL (اختياري)</span></div>
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">SP Flash Tool</span><span className="text-gray-400">— فلاش MediaTek (اختياري)</span></div>
            <div className="flex items-center gap-2"><span className="text-cyan-400 font-mono">Odin</span><span className="text-gray-400">— فلاش Samsung (اختياري)</span></div>
          </div>
        </div>

        <div className="bg-black/20 border border-white/[0.06] rounded-lg p-4">
          <h3 className="text-xs font-bold text-white mb-3">شبكات اليمن المدعومة</h3>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between"><span className="text-white">يمن موبايل</span><span className="text-gray-400 font-mono">MCC:421 MNC:02</span></div>
            <div className="flex items-center justify-between"><span className="text-white">سبأفون</span><span className="text-gray-400 font-mono">MCC:421 MNC:01</span></div>
            <div className="flex items-center justify-between"><span className="text-white">يونيتل (YOU)</span><span className="text-gray-400 font-mono">MCC:421 MNC:04</span></div>
            <div className="flex items-center justify-between"><span className="text-white">هيتس</span><span className="text-gray-400 font-mono">MCC:421 MNC:03</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
