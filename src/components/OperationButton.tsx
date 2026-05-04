import { Operation } from "../data/operations";

const COLOR_MAP: Record<
  Operation["color"],
  { bg: string; border: string; text: string; accent: string }
> = {
  blue:   { bg: "bg-blue-950/30",   border: "border-blue-800/20",   text: "text-blue-300",   accent: "bg-blue-500" },
  green:  { bg: "bg-emerald-950/30",border: "border-emerald-800/20",text: "text-emerald-300",accent: "bg-emerald-500" },
  orange: { bg: "bg-orange-950/30", border: "border-orange-800/20", text: "text-orange-300", accent: "bg-orange-500" },
  red:    { bg: "bg-red-950/30",    border: "border-red-800/20",    text: "text-red-300",    accent: "bg-red-500" },
  purple: { bg: "bg-purple-950/30", border: "border-purple-800/20", text: "text-purple-300", accent: "bg-purple-500" },
  cyan:   { bg: "bg-cyan-950/30",   border: "border-cyan-800/20",   text: "text-cyan-300",   accent: "bg-cyan-400" },
  yellow: { bg: "bg-yellow-950/30", border: "border-yellow-800/20", text: "text-yellow-300", accent: "bg-yellow-400" },
  gray:   { bg: "bg-gray-900/30",   border: "border-gray-700/20",   text: "text-gray-300",   accent: "bg-gray-500" },
};

interface OperationButtonProps {
  operation: Operation;
  onClick: (op: Operation) => void;
  active?: boolean;
  running?: boolean;
  favorite?: boolean;
  onToggleFavorite?: () => void;
}

export function OperationButton({ operation, onClick, active, running, favorite, onToggleFavorite }: OperationButtonProps) {
  const c = COLOR_MAP[operation.color];

  return (
    <button
      onClick={() => onClick(operation)}
      disabled={running}
      className={`
        relative w-full text-right rounded-xl border overflow-hidden
        transition-all duration-200 group backdrop-blur-sm
        ${c.bg} ${c.border} ${c.text}
        ${active ? "ring-1 ring-blue-500/30 border-blue-500/20 bg-blue-950/20" : ""}
        ${running ? "opacity-60 cursor-not-allowed" : "hover:border-white/10 hover:bg-white/[0.04] active:scale-[0.98]"}
      `}
    >
      {/* Left accent line */}
      <span className={`absolute right-0 top-1 bottom-1 w-[3px] rounded-full ${c.accent} ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"} transition-opacity`} />

      {/* Running shimmer */}
      {running && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      )}

      <div className="px-3 py-3 leading-tight">
        <div className="font-semibold text-[11px] truncate">{operation.labelAr}</div>
        <div className="text-[9px] opacity-40 font-normal mt-0.5 truncate font-mono">{operation.label}</div>
      </div>

      {/* Favorite star */}
      {favorite && !running && (
        <span className="absolute top-2 left-2 text-amber-400 text-[11px] cursor-pointer hover:scale-125 transition-transform drop-shadow-sm" onClick={e => { e.stopPropagation(); onToggleFavorite?.(); }}>★</span>
      )}

      {/* Running indicator */}
      {running && (
        <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${c.accent} animate-ping`} />
      )}
    </button>
  );
}
