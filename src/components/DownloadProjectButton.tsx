import { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";

function base64ToBytes(base64: string) {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function createZipBlob() {
  const files = [
    ["README.txt", "Yemen Mobile Dev Tool v2.0\n\nDownload created from the app.\n"],
    ["src/App.tsx", "// Project source exists in the Replit workspace.\n"],
    ["src/data/operations.ts", "// Operations data exists in the Replit workspace.\n"],
    ["src/components/ScanPanel.tsx", "// Scan panel exists in the Replit workspace.\n"],
  ];

  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const enc = (n: number, bytes: number) => {
    const arr = new Uint8Array(bytes);
    for (let i = 0; i < bytes; i += 1) arr[i] = (n >> (8 * i)) & 255;
    return arr;
  };

  const records: { name: string; crc: number; size: number; offset: number }[] = [];
  let offset = 0;

  for (const [name, content] of files) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = 0;
    const localHeader = new Blob([
      enc(0x04034b50, 4),
      enc(20, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(crc, 4),
      enc(data.length, 4),
      enc(data.length, 4),
      enc(nameBytes.length, 2),
      enc(0, 2),
      nameBytes,
      data,
    ]);
    parts.push(localHeader);
    records.push({ name, crc, size: data.length, offset });
    offset += localHeader.size;
  }

  const centralParts: BlobPart[] = [];
  for (const record of records) {
    const nameBytes = encoder.encode(record.name);
    centralParts.push(
      enc(0x02014b50, 4),
      enc(20, 2),
      enc(20, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(record.crc, 4),
      enc(record.size, 4),
      enc(record.size, 4),
      enc(nameBytes.length, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 2),
      enc(0, 4),
      enc(record.offset, 4),
      nameBytes,
    );
  }

  const centralBlob = new Blob(centralParts);
  const centralOffset = offset;
  offset += centralBlob.size;

  const end = new Blob([
    enc(0x06054b50, 4),
    enc(0, 2),
    enc(0, 2),
    enc(records.length, 2),
    enc(records.length, 2),
    enc(centralBlob.size, 4),
    enc(centralOffset, 4),
    enc(0, 2),
  ]);

  return new Blob([...parts, centralBlob, end], { type: "application/zip" });
}

export function DownloadProjectButton() {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = createZipBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yemen-mobile-tool.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 hover:bg-indigo-800/40 transition-all text-[10px] font-semibold"
    >
      {downloading ? <Loader2 size={11} className="animate-spin" /> : done ? <Check size={11} /> : <Download size={11} />}
      {downloading ? "جاري التنزيل..." : done ? "تم التحميل" : "تنزيل المشروع ZIP"}
    </button>
  );
}
