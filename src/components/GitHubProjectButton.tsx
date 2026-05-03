import { useState } from "react";
import { Github, ExternalLink, Copy, Check } from "lucide-react";

const GITHUB_URL = "https://github.com/AbdulrhmanMohmmed/Mobil-network";

export function GitHubProjectButton() {
  const [copied, setCopied] = useState(false);

  const openGitHub = () => {
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(GITHUB_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={openGitHub}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/40 border border-slate-700/50 text-slate-200 hover:bg-slate-800/60 transition-all text-[10px] font-semibold"
      >
        <Github size={11} />
        فتح GitHub
        <ExternalLink size={10} />
      </button>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-900/40 border border-slate-700/50 text-slate-300 hover:bg-slate-800/60 transition-all text-[10px] font-semibold"
      >
        {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
        {copied ? "تم النسخ" : "نسخ الرابط"}
      </button>
    </div>
  );
}
