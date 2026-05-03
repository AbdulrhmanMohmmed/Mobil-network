import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "نسخ" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
        copied
          ? "text-green-400 bg-green-900/30"
          : "text-gray-500 hover:text-gray-300 hover:bg-gray-700/50"
      }`}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "تم" : label}
    </button>
  );
}
