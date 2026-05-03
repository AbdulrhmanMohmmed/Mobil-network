import { Usb, Smartphone, Activity, Signal } from "lucide-react";

interface DeviceInfoBarProps {
  connected: boolean;
  deviceModel: string;
  androidVersion: string;
  serialNo: string;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting?: boolean;
}

export function DeviceInfoBar({
  connected,
  deviceModel,
  androidVersion,
  serialNo,
  onConnect,
  onDisconnect,
  connecting,
}: DeviceInfoBarProps) {
  return (
    <div className="flex items-center gap-0 px-0 py-0 bg-[#0e1420] border-b border-white/10 text-xs shrink-0">
      {/* Connection status pill */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 border-l border-white/10 ${
          connected ? "bg-green-500/10" : "bg-transparent"
        }`}
      >
        <span
          className={`relative flex h-2 w-2 ${connected ? "" : ""}`}
        >
          {connected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              connecting ? "bg-yellow-400" : connected ? "bg-green-400" : "bg-gray-600"
            }`}
          />
        </span>
        <span
          className={`font-semibold tracking-wide ${
            connecting ? "text-yellow-400" : connected ? "text-green-300" : "text-gray-500"
          }`}
        >
          {connecting ? "جاري الاتصال..." : connected ? "متصل" : "غير متصل"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-white/10" />

      {/* Device info slots */}
      <div className="flex items-center gap-4 px-4 py-2.5 flex-1">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Smartphone size={12} className={connected ? "text-cyan-400" : "text-gray-600"} />
          <span className={`font-mono ${connected ? "text-gray-200" : "text-gray-600"}`}>
            {connected ? deviceModel : "—"}
          </span>
        </div>

        {connected && (
          <>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <Activity size={11} className="text-cyan-400/70" />
              <span className="font-mono text-gray-300">Android {androidVersion}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Signal size={11} className="text-cyan-400/70" />
              <span className="font-mono text-gray-400 text-[10px]">{serialNo}</span>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-white/10">
        {connected ? (
          <button
            onClick={onDisconnect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-900/40 border border-red-700/60 text-red-300 hover:bg-red-800/50 transition-all font-semibold text-xs"
          >
            <Usb size={12} />
            قطع الاتصال
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={connecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-900/40 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-800/50 transition-all font-semibold text-xs disabled:opacity-50"
          >
            <Usb size={12} />
            {connecting ? "جاري الاتصال..." : "اتصال ADB"}
          </button>
        )}
      </div>
    </div>
  );
}
