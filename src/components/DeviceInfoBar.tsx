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
    <div className="flex items-center gap-3">
      {/* Device info */}
      {connected && (
        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Smartphone size={10} className="text-emerald-400" />
            <span className="text-emerald-300 font-semibold">{deviceModel}</span>
          </div>
          <span className="text-gray-600">Android {androidVersion}</span>
          <span className="text-gray-700">{serialNo}</span>
        </div>
      )}
      {/* Action */}
      {connected ? (
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[10px] font-semibold"
        >
          <Usb size={11} />
          قطع
        </button>
      ) : (
        <button
          onClick={onConnect}
          disabled={connecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-[10px] font-semibold disabled:opacity-50"
        >
          <Usb size={11} />
          {connecting ? "جاري..." : "اتصال ADB"}
        </button>
      )}
    </div>
  );
}
