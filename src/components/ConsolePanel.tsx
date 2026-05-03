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
  system:  "text-cyan-400",
  info:    "text-gray-300",
  cmd:     "text-amber-300",
  success: "text-green-400",
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
  system:  "bg-cyan-900/60 text-cyan-400",
  info:    "bg-gray-700/60 text-gray-400",
  cmd:     "bg-amber-900/60 text-amber-300",
  success: "bg-green-900/60 text-green-400",
  error:   "bg-red-900/60 text-red-400",
  warn:    "bg-yellow-900/60 text-yellow-400",
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
      className="flex flex-col bg-[#080c14] border-t border-white/10 shrink-0 transition-all duration-200"
      style={{ height: collapsed ? 34 : 190 }}
    >
      {/* Console header */}
      <div className="flex items-center justify-between px-3 h-[34px] bg-[#0e1420] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <Terminal size={12} className="text-cyan-400" />
          <span className="text-[10px] text-gray-400 font-mono font-bold tracking-widest uppercase">Console Output</span>
          {logs.length > 0 && (
            <span className="text-[10px] font-mono text-gray-600">({logs.length})</span>
          )}
          {/* Show last log preview when collapsed */}
          {collapsed && lastLog && (
            <span className={`text-[10px] font-mono truncate max-w-xs ${TYPE_STYLES[lastLog.type]}`}>
              — {lastLog.text}
            </span>
          )}
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={copyAll}
            className="text-gray-600 hover:text-gray-300 p-1.5 rounded transition-colors"
            title="نسخ الكل"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
          <button
            onClick={onClear}
            className="text-gray-600 hover:text-red-400 p-1.5 rounded transition-colors"
            title="مسح"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-300 p-1.5 rounded transition-colors"
            title={collapsed ? "توسيع" : "طي"}
          >
            {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Log lines */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-px font-mono text-[11px]">
          {logs.length === 0 && (
            <div className="flex items-center gap-2 text-gray-700 mt-2">
              <span className="text-gray-800">$</span>
              <span>جاهز — اضغط على أي عملية لتنفيذها وعرض الأوامر هنا</span>
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start leading-5 hover:bg-white/[0.02] rounded px-1 -mx-1">
              <span className="text-gray-700 shrink-0 tabular-nums">{log.time}</span>
              <span className={`shrink-0 text-[9px] font-bold px-1 py-0.5 rounded ${TYPE_BADGE[log.type]}`}>
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
