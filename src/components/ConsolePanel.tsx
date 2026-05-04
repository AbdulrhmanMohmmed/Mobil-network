import { useRef, useEffect, useState } from "react";
import { Trash2, Copy, ChevronUp, ChevronDown, Check, Terminal } from "lucide-react";

export interface LogEntry {
  id: number;
  time: string;
  type: "info" | "cmd" | "success" | "error" | "warn" | "system";
  text: string;
}

interface ConsolePanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

const TYPE_STYLES: Record<LogEntry["type"], string> = {
  system:  "text-blue-400",
  info:    "text-gray-400",
  cmd:     "text-amber-300",
  success: "text-emerald-400",
  error:   "text-red-400",
  warn:    "text-yellow-400",
};

const TYPE_PREFIX: Record<LogEntry["type"], string> = {
  system:  "SYS",
  info:    "INF",
  cmd:     "CMD",
  success: "OK ",
  error:   "ERR",
  warn:    "WRN",
};

const TYPE_BADGE: Record<LogEntry["type"], string> = {
  system:  "bg-blue-500/15 text-blue-400",
  info:    "bg-gray-500/15 text-gray-400",
  cmd:     "bg-amber-500/15 text-amber-300",
  success: "bg-emerald-500/15 text-emerald-400",
  error:   "bg-red-500/15 text-red-400",
  warn:    "bg-yellow-500/15 text-yellow-400",
};

export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!collapsed) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, collapsed]);

  const copyAll = async () => {
    const text = logs.map((l) => `${l.time} [${TYPE_PREFIX[l.type]}] ${l.text}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /**/ }
  };

  const lastLog = logs[logs.length - 1];

  return (
    <div
      className="flex flex-col bg-[#0a0e17] border-t border-white/[0.06] shrink-0 transition-all duration-300"
      style={{ height: collapsed ? 36 : 180 }}
    >
      {/* Console header */}
      <div className="flex items-center justify-between px-4 h-9 bg-[#0d1117] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <Terminal size={12} className="text-blue-400" />
          <span className="text-[10px] text-gray-500 font-semibold">Console</span>
          {logs.length > 0 && (
            <span className="text-[9px] font-mono text-gray-700 bg-white/[0.03] px-1.5 py-0.5 rounded">{logs.length}</span>
          )}
          {collapsed && lastLog && (
            <span className={`text-[10px] font-mono truncate max-w-sm ${TYPE_STYLES[lastLog.type]}`}>
              {lastLog.text}
            </span>
          )}
        </div>
        <div className="flex gap-0.5">
          <button onClick={copyAll} className="text-gray-600 hover:text-gray-300 p-1.5 rounded-md hover:bg-white/[0.04] transition-all" title="نسخ">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <button onClick={onClear} className="text-gray-600 hover:text-red-400 p-1.5 rounded-md hover:bg-white/[0.04] transition-all" title="مسح">
            <Trash2 size={12} />
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-gray-300 p-1.5 rounded-md hover:bg-white/[0.04] transition-all" title={collapsed ? "توسيع" : "طي"}>
            {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Log lines */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-px font-mono text-[10px]">
          {logs.length === 0 && (
            <div className="flex items-center gap-2 text-gray-700 mt-2">
              <span className="text-gray-800">$</span>
              <span>جاهز — اضغط على أي عملية لتنفيذها</span>
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start leading-5 hover:bg-white/[0.02] rounded-md px-1.5 -mx-1.5 transition-colors">
              <span className="text-gray-700 shrink-0 tabular-nums">{log.time}</span>
              <span className={`shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-md ${TYPE_BADGE[log.type]}`}>
                {TYPE_PREFIX[log.type]}
              </span>
              <span className={`${TYPE_STYLES[log.type]} whitespace-pre-wrap break-all flex-1`}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
