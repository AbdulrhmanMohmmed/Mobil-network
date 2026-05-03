import { useEffect, useState } from "react";
import { CheckCircle, Loader, Cpu, Wifi, Shield, Battery, HardDrive, Smartphone } from "lucide-react";

export interface ScanResult {
  model: string;
  brand: string;
  android: string;
  sdk: string;
  carrier: string;
  numeric: string;
  imei: string;
  serial: string;
  battery: string;
  storage: string;
  networkMode: string;
  volte: string;
  frpStatus: string;
  deviceProvisioned: string;
  timestamp: string;
}

interface ScanPanelProps {
  result: ScanResult | null;
  scanning: boolean;
  onClose: () => void;
}

const NETWORK_MODE_LABELS: Record<string, string> = {
  "9": "4G/3G/2G تلقائي ✓",
  "11": "4G فقط",
  "2": "3G فقط",
  "1": "2G فقط",
  "0": "غير محدد",
};

const SAMPLE_RESULTS: Omit<ScanResult, "timestamp">[] = [
  { model: "Galaxy A54 5G", brand: "Samsung", android: "14", sdk: "34", carrier: "Yemen Mobile", numeric: "42102", imei: "354XXXXXXXX1234", serial: "RZ8NXXXXXX", battery: "78%", storage: "52GB / 128GB", networkMode: "9", volte: "1", frpStatus: "1", deviceProvisioned: "1" },
  { model: "Redmi Note 12", brand: "Xiaomi",  android: "13", sdk: "33", carrier: "Sabafon",      numeric: "42101", imei: "861XXXXXXXX5678", serial: "XXXXXXXX",   battery: "65%", storage: "38GB / 128GB", networkMode: "9", volte: "0", frpStatus: "0", deviceProvisioned: "0" },
  { model: "OPPO A57",      brand: "OPPO",    android: "12", sdk: "31", carrier: "YOU",          numeric: "42104", imei: "868XXXXXXXX9012", serial: "XXXXXXXX",   battery: "91%", storage: "21GB / 64GB",  networkMode: "11",volte: "1", frpStatus: "1", deviceProvisioned: "1" },
];

function InfoRow({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: "good" | "warn" | "bad" }) {
  const colorMap = { good: "text-green-400", warn: "text-yellow-400", bad: "text-red-400" };
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
      <Icon size={11} className="text-gray-600 shrink-0" />
      <span className="text-[10px] text-gray-500 flex-1 truncate">{label}</span>
      <span className={`text-[10px] font-mono font-semibold ${highlight ? colorMap[highlight] : "text-gray-200"} truncate max-w-[120px]`}>
        {value}
      </span>
    </div>
  );
}

export function ScanPanel({ result, scanning, onClose }: ScanPanelProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!scanning) { setProgress(0); return; }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(interval); return p; }
        return p + Math.random() * 12;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [scanning]);

  useEffect(() => {
    if (result) setProgress(100);
  }, [result]);

  if (!scanning && !result) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Scan header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          {scanning ? (
            <Loader size={12} className="text-cyan-400 animate-spin" />
          ) : (
            <CheckCircle size={12} className="text-green-400" />
          )}
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
            {scanning ? "جاري الفحص..." : "نتائج الفحص"}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-700 hover:text-gray-400 text-[10px] font-mono">✕</button>
      </div>

      {/* Progress bar */}
      {(scanning || progress < 100) && (
        <div className="px-3 py-2 border-b border-white/[0.05]">
          <div className="flex justify-between text-[9px] text-gray-600 mb-1">
            <span>تحليل الجهاز...</span>
            <span className="font-mono">{Math.round(Math.min(progress, 100))}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Scan steps while loading */}
      {scanning && (
        <div className="p-3 space-y-1.5 text-[9px] font-mono text-gray-600">
          {["قراءة معلومات الجهاز", "فحص نسخة الأندرويد", "قراءة IMEI", "فحص الشبكة", "فحص APN", "فحص VoLTE", "فحص FRP", "تحليل التخزين"].map((step, i) => (
            <div key={i} className={`flex items-center gap-1.5 transition-opacity ${progress > i * 12 ? "opacity-100" : "opacity-30"}`}>
              {progress > (i + 1) * 12 ? (
                <span className="text-green-500">✓</span>
              ) : progress > i * 12 ? (
                <span className="text-cyan-400 animate-pulse">●</span>
              ) : (
                <span className="text-gray-700">○</span>
              )}
              {step}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !scanning && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Device header */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3 border border-cyan-700/20">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={14} className="text-cyan-400" />
              <span className="text-sm font-bold text-white">{result.brand} {result.model}</span>
            </div>
            <div className="text-[10px] text-cyan-300/70 font-mono">
              Android {result.android} (SDK {result.sdk}) · {new Date(result.timestamp).toLocaleTimeString("ar")}
            </div>
          </div>

          {/* Identity */}
          <div>
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Smartphone size={9} /> هوية الجهاز
            </div>
            <div className="bg-black/30 rounded-lg px-2 border border-white/[0.05]">
              <InfoRow icon={Smartphone} label="IMEI" value={result.imei} />
              <InfoRow icon={Smartphone} label="Serial" value={result.serial} />
            </div>
          </div>

          {/* Network */}
          <div>
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Wifi size={9} /> الشبكة والسيم
            </div>
            <div className="bg-black/30 rounded-lg px-2 border border-white/[0.05]">
              <InfoRow icon={Wifi} label="المشغل" value={result.carrier || "—"} />
              <InfoRow icon={Wifi} label="MCC/MNC" value={result.numeric || "—"} highlight={result.numeric === "42102" ? "good" : undefined} />
              <InfoRow icon={Wifi} label="نوع الشبكة" value={NETWORK_MODE_LABELS[result.networkMode] ?? result.networkMode} highlight={result.networkMode === "9" || result.networkMode === "11" ? "good" : "warn"} />
              <InfoRow icon={Wifi} label="VoLTE" value={result.volte === "1" ? "مفعّل ✓" : "غير مفعّل ✗"} highlight={result.volte === "1" ? "good" : "warn"} />
            </div>
          </div>

          {/* Hardware */}
          <div>
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Cpu size={9} /> الأجهزة
            </div>
            <div className="bg-black/30 rounded-lg px-2 border border-white/[0.05]">
              <InfoRow icon={Battery} label="البطارية" value={result.battery} highlight={parseInt(result.battery) > 50 ? "good" : parseInt(result.battery) > 20 ? "warn" : "bad"} />
              <InfoRow icon={HardDrive} label="التخزين" value={result.storage} />
            </div>
          </div>

          {/* FRP Status */}
          <div>
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Shield size={9} /> حالة FRP
            </div>
            <div className="bg-black/30 rounded-lg px-2 border border-white/[0.05]">
              <InfoRow icon={Shield} label="Setup Complete" value={result.frpStatus === "1" ? "مكتمل ✓" : "غير مكتمل ✗"} highlight={result.frpStatus === "1" ? "good" : "bad"} />
              <InfoRow icon={Shield} label="Device Provisioned" value={result.deviceProvisioned === "1" ? "مفعّل ✓" : "غير مفعّل ✗"} highlight={result.deviceProvisioned === "1" ? "good" : "bad"} />
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-[9px] text-gray-700 font-mono text-center pt-1">
            آخر فحص: {result.timestamp}
          </div>
        </div>
      )}
    </div>
  );
}

export function generateFakeScanResult(): ScanResult {
  const s = SAMPLE_RESULTS[Math.floor(Math.random() * SAMPLE_RESULTS.length)];
  return { ...s, timestamp: new Date().toLocaleString("ar") };
}
