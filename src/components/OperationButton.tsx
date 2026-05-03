import { Operation } from "../data/operations";

const COLOR_MAP: Record<
  Operation["color"],
  { bg: string; border: string; text: string; glow: string; bar: string }
> = {
  blue:   { bg: "bg-blue-950/70",   border: "border-blue-700/60",   text: "text-blue-200",   glow: "hover:shadow-blue-900/40",   bar: "bg-blue-500" },
  green:  { bg: "bg-green-950/70",  border: "border-green-700/60",  text: "text-green-200",  glow: "hover:shadow-green-900/40",  bar: "bg-green-500" },
  orange: { bg: "bg-orange-950/70", border: "border-orange-700/60", text: "text-orange-200", glow: "hover:shadow-orange-900/40", bar: "bg-orange-500" },
  red:    { bg: "bg-red-950/70",    border: "border-red-700/60",    text: "text-red-200",    glow: "hover:shadow-red-900/40",    bar: "bg-red-500" },
  purple: { bg: "bg-purple-950/70", border: "border-purple-700/60", text: "text-purple-200", glow: "hover:shadow-purple-900/40", bar: "bg-purple-500" },
  cyan:   { bg: "bg-cyan-950/70",   border: "border-cyan-700/60",   text: "text-cyan-200",   glow: "hover:shadow-cyan-900/40",   bar: "bg-cyan-400" },
  yellow: { bg: "bg-yellow-950/70", border: "border-yellow-700/60", text: "text-yellow-200", glow: "hover:shadow-yellow-900/40", bar: "bg-yellow-400" },
  gray:   { bg: "bg-gray-800/70",   border: "border-gray-600/60",   text: "text-gray-300",   glow: "hover:shadow-gray-700/40",   bar: "bg-gray-500" },
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
        relative w-full text-right rounded-lg border overflow-hidden
        transition-all duration-150 group
        ${c.bg} ${c.border} ${c.text}
        ${active ? "ring-1 ring-white/20" : ""}
        ${running ? "opacity-70 cursor-not-allowed" : `hover:brightness-125 hover:shadow-lg ${c.glow} active:scale-[0.98]`}
      `}
    >
      {/* Left accent bar */}
      <span className={`absolute right-0 top-0 bottom-0 w-0.5 ${c.bar} ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"} transition-opacity`} />

      {/* Running shimmer */}
      {running && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      )}

      <div className="px-3 py-3 leading-tight">
        <div className="font-semibold text-xs truncate">{operation.labelAr}</div>
        <div className="text-[10px] opacity-40 font-normal mt-0.5 truncate">{operation.label}</div>
      </div>

      {/* Favorite star */}
      {favorite && (
        <span className="absolute top-2 left-2 text-yellow-400 text-[10px]">★</span>
      )}

      {/* Running indicator dot */}
      {running && (
        <span className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${c.bar} animate-ping`} />
      )}
    </button>
  );
}
