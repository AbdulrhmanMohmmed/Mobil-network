# Yemen Mobile Dev Tool v2.0 🔧📱

**أداة احترافية لتقنيي إصلاح الهواتف في اليمن**

> Professional phone repair desktop-style web tool for Yemeni mobile technicians.

## المميزات | Features

- 🏷️ **11 ماركة** — General، FRP، Qualcomm، MediaTek، Samsung، Xiaomi، Huawei، OPPO/Realme، Tecno/Infinix، Vivo، Nokia
- ⚡ **144+ عملية** — ADB / Fastboot operations
- 🇾🇪 **إعداد APN** — يمن موبايل 421/02 · سبأفون 421/01 · يونيتل 421/04 · هيتس 421/03
- 🛡️ **تجاوز FRP** — لجميع الماركات الكبرى
- 🔍 **فحص سريع شامل** — Quick Device Scan مع نتائج IMEI، شبكة، VoLTE، FRP، بطارية، تخزين
- 💻 **واجهة سطح مكتب** — 3 لوحات، ثيم داكن، RTL عربي كامل
- 📟 **Console Output** مباشر مع تسجيل الأوامر

## التقنيات | Stack

```
React 19 + Vite 6 + Tailwind CSS v4 + TypeScript
```

## تشغيل المشروع | Run

```bash
pnpm install
pnpm dev
```

## شبكات اليمن | Yemen Carriers

| الشبكة | MCC/MNC |
|--------|---------|
| يمن موبايل | 421/02 |
| سبأفون | 421/01 |
| يونيتل (YOU) | 421/04 |
| هيتس | 421/03 |

## هيكل المشروع | Structure

```
src/
├── App.tsx                          # Main layout & state
├── main.tsx                         # React entry point
├── index.css                        # Global styles
├── data/operations.ts               # 11 brands + 144+ operations
└── components/
    ├── ConsolePanel.tsx             # Live console
    ├── OperationButton.tsx          # Operation buttons
    ├── DeviceInfoBar.tsx            # Device info bar
    ├── CopyButton.tsx               # Copy button
    ├── ScanPanel.tsx                # Scan results panel
    ├── GitHubProjectButton.tsx      # GitHub link
    └── DownloadProjectButton.tsx    # ZIP download
```

---
Built with ❤️ for Yemeni phone repair technicians
