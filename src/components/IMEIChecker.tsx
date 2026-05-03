import { useState } from "react";
import { Search, Shield, AlertTriangle, CheckCircle, Smartphone, Info } from "lucide-react";

// TAC (Type Allocation Code) database - first 8 digits of IMEI
const TAC_DATABASE: Record<string, { brand: string; model: string }> = {
  "35332509": { brand: "Samsung", model: "Galaxy S24" },
  "35845012": { brand: "Samsung", model: "Galaxy A54" },
  "35194011": { brand: "Samsung", model: "Galaxy S23" },
  "86150804": { brand: "Xiaomi", model: "Redmi Note 12" },
  "86826003": { brand: "Xiaomi", model: "Redmi Note 13" },
  "86190804": { brand: "Xiaomi", model: "Poco X5" },
  "86842903": { brand: "OPPO", model: "A57" },
  "86940403": { brand: "OPPO", model: "Reno 10" },
  "35428510": { brand: "Apple", model: "iPhone 15" },
  "35407115": { brand: "Apple", model: "iPhone 14" },
  "35878110": { brand: "Huawei", model: "Nova Y90" },
  "35693209": { brand: "Huawei", model: "P60" },
  "86432604": { brand: "Vivo", model: "Y36" },
  "86274104": { brand: "Tecno", model: "Spark 10" },
  "86152504": { brand: "Infinix", model: "Hot 30" },
  "35523011": { brand: "Nokia", model: "G42" },
};

function validateIMEI(imei: string): { valid: boolean; reason: string } {
  const cleaned = imei.replace(/[^0-9]/g, "");
  if (cleaned.length !== 15) {
    return { valid: false, reason: "IMEI يجب أن يكون 15 رقم" };
  }

  // Luhn algorithm validation
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  if (checkDigit !== parseInt(cleaned[14])) {
    return { valid: false, reason: "IMEI غير صالح — فحص Luhn فشل" };
  }

  return { valid: true, reason: "IMEI صالح" };
}

function lookupTAC(imei: string) {
  const tac = imei.replace(/[^0-9]/g, "").substring(0, 8);
  return TAC_DATABASE[tac] || null;
}

interface IMEIResult {
  imei: string;
  valid: boolean;
  reason: string;
  tac: string;
  device: { brand: string; model: string } | null;
  reportingBody: string;
}

function getReportingBody(imei: string): string {
  const rb = parseInt(imei.substring(0, 2));
  if (rb <= 4) return "BABT (British)";
  if (rb <= 9) return "NCC (USA)";
  if (rb <= 19) return "CMII (China)";
  if (rb <= 29) return "MSAI (India)";
  if (rb <= 39) return "CETE (Mexico)";
  if (rb <= 49) return "TRA (UAE)";
  if (rb <= 59) return "NTC (Philippines)";
  return "Other";
}

export function IMEIChecker() {
  const [imei, setImei] = useState("");
  const [result, setResult] = useState<IMEIResult | null>(null);
  const [history, setHistory] = useState<IMEIResult[]>([]);

  const handleCheck = () => {
    const cleaned = imei.replace(/[^0-9]/g, "");
    const validation = validateIMEI(cleaned);
    const device = lookupTAC(cleaned);
    const r: IMEIResult = {
      imei: cleaned,
      valid: validation.valid,
      reason: validation.reason,
      tac: cleaned.substring(0, 8),
      device,
      reportingBody: validation.valid ? getReportingBody(cleaned) : "",
    };
    setResult(r);
    setHistory(prev => [r, ...prev].slice(0, 20));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[#0e1525]">
        <Shield size={14} className="text-cyan-400" />
        <h2 className="text-sm font-bold text-white">فحص IMEI</h2>
        <span className="text-[10px] text-gray-500">التحقق من صحة IMEI وتحديد الجهاز</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1 bg-black/30 border border-white/[0.08] rounded-lg px-3 py-2">
            <Search size={12} className="text-gray-500" />
            <input
              value={imei}
              onChange={e => setImei(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCheck()}
              placeholder="أدخل رقم IMEI (15 رقم)..."
              maxLength={15}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-600 font-mono tracking-wider"
            />
          </div>
          <button onClick={handleCheck} className="px-5 py-2 bg-cyan-800/50 border border-cyan-600/40 text-cyan-200 rounded-lg text-xs font-bold hover:bg-cyan-700/60 transition-all">
            فحص
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-lg border p-4 space-y-3 ${result.valid ? "bg-green-950/20 border-green-700/30" : "bg-red-950/20 border-red-700/30"}`}>
            <div className="flex items-center gap-2">
              {result.valid ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <AlertTriangle size={16} className="text-red-400" />
              )}
              <span className={`text-sm font-bold ${result.valid ? "text-green-400" : "text-red-400"}`}>
                {result.reason}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-lg p-2.5 border border-white/[0.05]">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">IMEI</div>
                <div className="text-xs text-white font-mono tracking-wider">{result.imei}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2.5 border border-white/[0.05]">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">TAC</div>
                <div className="text-xs text-white font-mono">{result.tac}</div>
              </div>
            </div>

            {result.valid && (
              <>
                {result.device && (
                  <div className="bg-black/20 rounded-lg p-2.5 border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone size={11} className="text-cyan-400" />
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest">الجهاز المكتشف</span>
                    </div>
                    <div className="text-sm text-white font-bold">{result.device.brand} {result.device.model}</div>
                  </div>
                )}
                <div className="bg-black/20 rounded-lg p-2.5 border border-white/[0.05]">
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={11} className="text-purple-400" />
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">جهة التسجيل</span>
                  </div>
                  <div className="text-xs text-gray-300">{result.reportingBody}</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ADB Commands */}
        <div className="bg-black/20 border border-white/[0.05] rounded-lg p-3">
          <div className="text-[10px] font-bold text-gray-400 mb-2">أوامر ADB لقراءة IMEI:</div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="text-amber-300/70">adb shell service call iphonesubinfo 1</div>
            <div className="text-amber-300/70">adb shell getprop persist.radio.imei</div>
            <div className="text-amber-300/70">adb shell settings get secure android_id</div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">سجل الفحص</div>
            <div className="space-y-1">
              {history.map((r, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-black/20 rounded text-[10px]">
                  {r.valid ? <CheckCircle size={9} className="text-green-400" /> : <AlertTriangle size={9} className="text-red-400" />}
                  <span className="text-gray-300 font-mono flex-1">{r.imei}</span>
                  {r.device && <span className="text-gray-500">{r.device.brand} {r.device.model}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
