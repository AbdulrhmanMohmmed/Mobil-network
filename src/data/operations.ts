export interface Operation {
  id: string;
  labelAr: string;
  label: string;
  color: "blue" | "green" | "orange" | "red" | "purple" | "cyan" | "yellow" | "gray";
  commands: string[];
  description: string;
  requiresRoot?: boolean;
  isScan?: boolean;
}

export interface OperationGroup {
  id: string;
  titleAr: string;
  operations: Operation[];
}

export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  chipset: string;
  color: string;
  groups: OperationGroup[];
}

// ─── GENERAL ────────────────────────────────────────────────────────────────
const GENERAL_GROUPS: OperationGroup[] = [
  {
    id: "quick_scan",
    titleAr: "فحص سريع للجهاز",
    operations: [
      {
        id: "quick_scan_all", labelAr: "فحص شامل للجهاز", label: "Quick Device Scan", color: "cyan",
        isScan: true,
        description: "فحص شامل: موديل · IMEI · أندرويد · بطارية · مساحة · شبكة · SIM",
        commands: [
          "adb shell getprop ro.product.model",
          "adb shell getprop ro.product.manufacturer",
          "adb shell getprop ro.build.version.release",
          "adb shell getprop ro.build.version.sdk",
          "adb shell getprop gsm.operator.alpha",
          "adb shell getprop gsm.operator.numeric",
          "adb shell service call iphonesubinfo 1",
          "adb shell getprop ro.serialno",
          "adb shell dumpsys battery | grep level",
          "adb shell df /data | tail -1",
          "adb shell settings get global preferred_network_mode",
          "adb shell settings get global volte_vt_enabled",
        ],
      },
      {
        id: "scan_network", labelAr: "فحص الشبكة والسيم", label: "Network Scan", color: "blue",
        isScan: true,
        description: "فحص حالة الشبكة: المشغل · نوع الاتصال · APN · IMEI",
        commands: [
          "adb shell getprop gsm.operator.alpha",
          "adb shell getprop gsm.operator.numeric",
          "adb shell getprop gsm.network.type",
          "adb shell settings get global preferred_network_mode",
          "adb shell settings get global volte_vt_enabled",
          "adb shell settings get global enhanced_4g_mode_enabled",
          "adb shell service call iphonesubinfo 1",
        ],
      },
      {
        id: "scan_frp_status", labelAr: "فحص حالة FRP", label: "FRP Status Scan", color: "green",
        isScan: true,
        description: "فحص حالة FRP وإعداد الجهاز وحساب Google",
        commands: [
          "adb shell settings get secure user_setup_complete",
          "adb shell settings get global device_provisioned",
          "adb shell getprop ro.frp.pst",
          "adb shell getprop ro.boot.flash.locked",
          "adb shell getprop sys.oem_unlock_allowed",
        ],
      },
    ],
  },
  {
    id: "device_info",
    titleAr: "معلومات الجهاز",
    operations: [
      { id: "get_model",    labelAr: "موديل الجهاز",     label: "Get Model",      color: "blue",   description: "قراءة موديل الجهاز",                commands: ["adb shell getprop ro.product.model"] },
      { id: "get_brand",    labelAr: "الشركة المصنعة",   label: "Manufacturer",   color: "blue",   description: "قراءة الشركة المصنعة",              commands: ["adb shell getprop ro.product.manufacturer"] },
      { id: "get_android",  labelAr: "نسخة الأندرويد",   label: "Android Version",color: "blue",   description: "قراءة نسخة الأندرويد والـ SDK",     commands: ["adb shell getprop ro.build.version.release", "adb shell getprop ro.build.version.sdk"] },
      { id: "get_imei",     labelAr: "قراءة IMEI",       label: "Read IMEI",      color: "cyan",   description: "قراءة IMEI الجهاز",                 commands: ["adb shell service call iphonesubinfo 1 | grep -o \"'[^']*'\" | tr -d \"' .\" | grep -v '^$'"] },
      { id: "get_serial",   labelAr: "الرقم التسلسلي",   label: "Serial Number",  color: "blue",   description: "قراءة الرقم التسلسلي",              commands: ["adb get-serialno", "adb shell getprop ro.serialno"] },
      { id: "get_battery",  labelAr: "حالة البطارية",    label: "Battery Info",   color: "green",  description: "معلومات البطارية الكاملة",           commands: ["adb shell dumpsys battery"] },
      { id: "get_storage",  labelAr: "مساحة التخزين",   label: "Storage Info",   color: "blue",   description: "مساحة التخزين المتاحة والمستخدمة",   commands: ["adb shell df -h"] },
      { id: "get_cpu",      labelAr: "معالج الجهاز",     label: "CPU Info",       color: "purple", description: "معلومات المعالج والشريحة",           commands: ["adb shell getprop ro.board.platform", "adb shell getprop ro.hardware"] },
      { id: "get_ram",      labelAr: "RAM الجهاز",       label: "RAM Info",       color: "purple", description: "معلومات الذاكرة العشوائية",          commands: ["adb shell cat /proc/meminfo | head -5"] },
      { id: "get_buildinfo",labelAr: "معلومات Build",    label: "Build Info",     color: "gray",   description: "رقم البناء ونسخة الفريموير",         commands: ["adb shell getprop ro.build.display.id", "adb shell getprop ro.build.date"] },
    ],
  },
  {
    id: "reboot_ops",
    titleAr: "إعادة التشغيل وأوضاع الدخول",
    operations: [
      { id: "reboot_normal",     labelAr: "إعادة تشغيل عادي",    label: "Reboot",            color: "orange", description: "إعادة تشغيل الجهاز",                  commands: ["adb reboot"] },
      { id: "reboot_recovery",   labelAr: "Recovery Mode",        label: "Reboot Recovery",   color: "orange", description: "الإقلاع لوضع الاسترداد",              commands: ["adb reboot recovery"] },
      { id: "reboot_bootloader", labelAr: "Bootloader Mode",      label: "Reboot Bootloader", color: "orange", description: "الإقلاع لوضع Bootloader",             commands: ["adb reboot bootloader"] },
      { id: "reboot_fastboot",   labelAr: "Fastboot Mode",        label: "Reboot Fastboot",   color: "orange", description: "الإقلاع لوضع Fastboot",               commands: ["adb reboot fastboot"] },
      { id: "reboot_edl",        labelAr: "EDL Mode (9008)",      label: "Reboot EDL",        color: "red",    description: "الإقلاع لوضع Qualcomm EDL 9008",      commands: ["adb reboot edl"] },
      { id: "adb_server_restart",labelAr: "إعادة ADB Server",     label: "Restart ADB",       color: "gray",   description: "إعادة تشغيل خادم ADB",                commands: ["adb kill-server", "adb start-server", "adb devices"] },
      { id: "sideload_mode",     labelAr: "ADB Sideload Mode",    label: "Sideload Mode",     color: "purple", description: "دخول وضع Sideload لتثبيت OTA",        commands: ["adb reboot sideload"] },
      { id: "safe_mode",         labelAr: "الوضع الآمن Safe Mode",label: "Safe Mode",         color: "yellow", description: "إعادة التشغيل بالوضع الآمن",          commands: ["adb shell am start -a android.intent.action.REBOOT --ez safeMode true"] },
    ],
  },
  {
    id: "network_ops",
    titleAr: "الشبكة والسيم",
    operations: [
      { id: "set_4g_auto",     labelAr: "4G/3G/2G تلقائي",        label: "4G Auto",        color: "green",  description: "ضبط الشبكة تلقائي (موصى به)",       commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "set_4g_only",     labelAr: "4G فقط (LTE Only)",      label: "4G Only",        color: "green",  description: "إجبار الجهاز على 4G فقط",           commands: ["adb shell settings put global preferred_network_mode 11"] },
      { id: "set_3g_only",     labelAr: "3G فقط (WCDMA Only)",    label: "3G Only",        color: "yellow", description: "إجبار الجهاز على 3G فقط",           commands: ["adb shell settings put global preferred_network_mode 2"] },
      { id: "set_2g_only",     labelAr: "2G فقط (GSM Only)",      label: "2G Only",        color: "gray",   description: "إجبار الجهاز على 2G فقط",           commands: ["adb shell settings put global preferred_network_mode 1"] },
      { id: "enable_volte",    labelAr: "تفعيل VoLTE",            label: "Enable VoLTE",   color: "purple", description: "تفعيل المكالمات عبر 4G",            commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1", "adb shell service call phone 142 i32 1"] },
      { id: "disable_volte",   labelAr: "إيقاف VoLTE",            label: "Disable VoLTE",  color: "gray",   description: "إيقاف VoLTE",                       commands: ["adb shell settings put global volte_vt_enabled 0", "adb shell settings put global enhanced_4g_mode_enabled 0"] },
      { id: "toggle_data",     labelAr: "إعادة تشغيل البيانات",   label: "Restart Data",   color: "cyan",   description: "إيقاف وتشغيل البيانات",            commands: ["adb shell svc data disable", "adb shell svc data enable"] },
      { id: "airplane_toggle", labelAr: "وضع الطيران ON/OFF",      label: "Airplane Toggle",color: "gray",   description: "تبديل وضع الطيران (إعادة تسجيل الشبكة)", commands: ["adb shell settings put global airplane_mode_on 1", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell settings put global airplane_mode_on 0", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE"] },
      { id: "wifi_restart",    labelAr: "إعادة تشغيل WiFi",       label: "Restart WiFi",   color: "blue",   description: "إعادة تشغيل الـ WiFi",             commands: ["adb shell svc wifi disable", "adb shell svc wifi enable"] },
      { id: "nfc_toggle",      labelAr: "تفعيل/إيقاف NFC",        label: "Toggle NFC",     color: "gray",   description: "تبديل حالة NFC",                    commands: ["adb shell svc nfc enable"] },
    ],
  },
  {
    id: "apn_ops",
    titleAr: "إعدادات APN — شبكات اليمن",
    operations: [
      { id: "add_apn_ym_4g",  labelAr: "يمن موبايل 4G APN",            label: "Yemen Mobile 4G",      color: "blue",   description: "إضافة APN يمن موبايل 4G",             commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
      { id: "add_apn_ym_ims", labelAr: "يمن موبايل IMS (VoLTE)",       label: "Yemen Mobile IMS",     color: "purple", description: "إضافة APN IMS لتفعيل VoLTE",          commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile IMS" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ims" --bind type:s:"ims" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
      { id: "add_apn_saba",   labelAr: "سبأفون APN",                    label: "Sabafon APN",          color: "red",    description: "إضافة APN سبأفون",                   commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Sabafon Internet" --bind numeric:s:"42101" --bind mcc:s:"421" --bind mnc:s:"01" --bind apn:s:"sabafon" --bind type:s:"default,supl" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
      { id: "add_apn_you",    labelAr: "يونيتل (YOU) APN",              label: "YOU / Unitel APN",     color: "orange", description: "إضافة APN يونيتل",                   commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"YOU Internet" --bind numeric:s:"42104" --bind mcc:s:"421" --bind mnc:s:"04" --bind apn:s:"you" --bind type:s:"default,supl" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
      { id: "add_apn_hits",   labelAr: "هيتس APN",                      label: "Hits APN",             color: "yellow", description: "إضافة APN هيتس",                     commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Hits Internet" --bind numeric:s:"42103" --bind mcc:s:"421" --bind mnc:s:"03" --bind apn:s:"hits" --bind type:s:"default,supl" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
      { id: "setup_full_ym",  labelAr: "⚡ إعداد كامل يمن موبايل 4G+VoLTE", label: "Full Yemen Mobile Setup", color: "green", description: "إعداد شامل: APN + 4G + VoLTE بضغطة واحدة", commands: [
        'adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1',
        'adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile IMS" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ims" --bind type:s:"ims" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1',
        "adb shell settings put global preferred_network_mode 9",
        "adb shell settings put global volte_vt_enabled 1",
        "adb shell settings put global enhanced_4g_mode_enabled 1",
        "adb shell service call phone 142 i32 1",
        "adb shell svc data disable",
        "adb shell svc data enable",
      ]},
    ],
  },
  {
    id: "apps_ops",
    titleAr: "التطبيقات والنظام",
    operations: [
      { id: "list_packages",   labelAr: "قائمة التطبيقات",          label: "List Apps",       color: "gray",   description: "عرض جميع التطبيقات المثبتة",     commands: ["adb shell pm list packages"] },
      { id: "list_3rd_party",  labelAr: "تطبيقات الطرف الثالث",     label: "Third-party Apps",color: "gray",   description: "عرض تطبيقات الطرف الثالث فقط",  commands: ["adb shell pm list packages -3"] },
      { id: "clear_cache_all", labelAr: "مسح الكاش الكلي",          label: "Clear All Cache", color: "orange", description: "مسح ذاكرة التخزين المؤقت لكل التطبيقات", commands: ["adb shell pm trim-caches 1000G"] },
      { id: "enable_usb_debug",labelAr: "تفعيل USB Debugging",       label: "Enable USB Debug",color: "cyan",   description: "تفعيل وضع التطوير و USB Debugging", commands: ["adb shell settings put global adb_enabled 1"] },
      { id: "screenshot",      labelAr: "لقطة شاشة",                label: "Screenshot",      color: "blue",   description: "التقاط لقطة شاشة وحفظها للكمبيوتر", commands: ["adb shell screencap -p /sdcard/screenshot.png", "adb pull /sdcard/screenshot.png"] },
      { id: "screen_record",   labelAr: "تسجيل الشاشة",             label: "Screen Record",   color: "blue",   description: "تسجيل الشاشة لمدة 30 ثانية",     commands: ["adb shell screenrecord /sdcard/record.mp4"] },
    ],
  },
];

// ─── FRP (ALL BRANDS) ────────────────────────────────────────────────────────
const FRP_GROUPS: OperationGroup[] = [
  {
    id: "frp_bypass",
    titleAr: "FRP Bypass — ADB",
    operations: [
      { id: "frp_setup_complete", labelAr: "Setup Complete (FRP Bypass)", label: "Setup Complete",    color: "green",  description: "وضع علامة إتمام الإعداد لتجاوز FRP", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"'] },
      { id: "frp_provisioned",    labelAr: "Device Provisioned",          label: "Device Provisioned",color: "green",  description: "تفعيل حالة توفير الجهاز",            commands: ["adb shell settings put global device_provisioned 1"] },
      { id: "frp_clear_gms",      labelAr: "مسح GMS Cache",               label: "Clear GMS",         color: "orange", description: "مسح بيانات خدمات Google",            commands: ["adb shell pm clear com.google.android.gms"] },
      { id: "frp_bypass_full",    labelAr: "⚡ FRP Bypass شامل",           label: "Full FRP Bypass",   color: "green",  description: "تجاوز FRP كامل عبر ADB",             commands: [
        'adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"',
        "adb shell settings put global device_provisioned 1",
        "adb shell pm clear com.google.android.gms",
        "adb reboot",
      ]},
      { id: "frp_bypass_a16",     labelAr: "FRP Bypass Android 16",       label: "FRP Android 16",    color: "cyan",   description: "تجاوز FRP لأجهزة أندرويد 16",        commands: [
        "adb shell settings put secure user_setup_complete 1",
        "adb shell settings put global device_provisioned 1",
        "adb shell pm clear com.google.android.gms",
        "adb shell am start -n com.android.settings/.Settings",
        "adb reboot",
      ]},
    ],
  },
  {
    id: "frp_fastboot",
    titleAr: "FRP — Fastboot",
    operations: [
      { id: "frp_erase_fb",     labelAr: "Erase FRP [Fastboot]",        label: "Erase FRP",         color: "red",    description: "مسح FRP عبر Fastboot",               commands: ["fastboot erase frp", "fastboot reboot"] },
      { id: "frp_erase_fb_all", labelAr: "Erase FRP + Format Data",     label: "Erase FRP + Data",  color: "red",    description: "مسح FRP وإعادة التهيئة الكاملة",     commands: ["fastboot erase frp", "fastboot -w", "fastboot reboot"] },
    ],
  },
  {
    id: "frp_specific",
    titleAr: "FRP حسب الماركة",
    operations: [
      { id: "frp_samsung",  labelAr: "Samsung FRP Bypass",    label: "Samsung FRP",    color: "blue",   description: "إزالة FRP Samsung عبر ADB", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.samsung.android.spay", "adb reboot"] },
      { id: "frp_xiaomi",   labelAr: "Xiaomi FRP Bypass",     label: "Xiaomi FRP",     color: "orange", description: "إزالة FRP Xiaomi/MIUI",      commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "frp_huawei",   labelAr: "Huawei FRP Bypass",     label: "Huawei FRP",     color: "red",    description: "إزالة FRP Huawei/Honor",     commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.huawei.id", "adb reboot"] },
      { id: "frp_oppo",     labelAr: "OPPO/Realme FRP Bypass",label: "OPPO FRP",       color: "green",  description: "إزالة FRP OPPO/Realme",      commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "frp_tecno",    labelAr: "Tecno/Infinix FRP Bypass",label: "Tecno FRP",    color: "cyan",   description: "إزالة FRP Tecno/Infinix",    commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "frp_vivo",     labelAr: "Vivo FRP Bypass",        label: "Vivo FRP",      color: "purple", description: "إزالة FRP Vivo/iQOO",        commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.vivo.account", "adb reboot"] },
    ],
  },
];

// ─── SAMSUNG ────────────────────────────────────────────────────────────────
const SAMSUNG_GROUPS: OperationGroup[] = [
  {
    id: "samsung_reboot",
    titleAr: "أوضاع الدخول",
    operations: [
      { id: "sam_download",   labelAr: "Download Mode (Odin)",  label: "Download Mode",   color: "blue",   description: "الإقلاع لـ Download Mode (Odin/XFLASH)", commands: ["adb reboot bootloader"] },
      { id: "sam_recovery",   labelAr: "Recovery Mode",         label: "Recovery Mode",   color: "orange", description: "الإقلاع لـ Recovery",                    commands: ["adb reboot recovery"] },
      { id: "sam_reboot",     labelAr: "إعادة تشغيل",           label: "Reboot",          color: "gray",   description: "إعادة تشغيل عادي",                       commands: ["adb reboot"] },
      { id: "sam_test_mode",  labelAr: "Test Mode *#0*#",       label: "Test Mode",       color: "cyan",   description: "فتح وضع الاختبار Samsung",                commands: ['adb shell am start -a android.intent.action.DIAL -d "tel:*%230%2a%23"'] },
      { id: "sam_secret_menu",labelAr: "قائمة سرية *#9090#",   label: "Diagnostic Menu", color: "cyan",   description: "فتح قائمة التشخيص السرية",               commands: ['adb shell am start -a android.intent.action.DIAL -d "tel:*%239090%23"'] },
      { id: "sam_field_test", labelAr: "Field Test *#0011#",    label: "Field Test",      color: "cyan",   description: "فتح قائمة اختبار الشبكة",                commands: ['adb shell am start -a android.intent.action.DIAL -d "tel:*%230011%23"'] },
    ],
  },
  {
    id: "samsung_frp",
    titleAr: "Samsung FRP & Accounts",
    operations: [
      { id: "sam_frp_bypass",    labelAr: "Remove FRP Samsung",         label: "Remove FRP",           color: "green",  description: "إزالة FRP لأجهزة Samsung", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.samsung.android.spay", "adb reboot"] },
      { id: "sam_remove_account",labelAr: "Remove Samsung Account",     label: "Remove Samsung Acct",  color: "red",    description: "إزالة حساب Samsung",       commands: ["adb shell pm clear com.samsung.android.mobileservice"] },
      { id: "sam_disable_fmm",   labelAr: "Disable Find My Mobile",     label: "Disable FMM",          color: "red",    description: "تعطيل Find My Mobile",     commands: ["adb shell pm disable-user com.samsung.android.fmm"] },
      { id: "sam_setup_wizard",  labelAr: "تخطي Setup Wizard",          label: "Skip Setup Wizard",    color: "green",  description: "تخطي معالج الإعداد مباشرة", commands: ["adb shell am start -n com.google.android.setupwizard/.SetupWizardExitActivity"] },
    ],
  },
  {
    id: "samsung_network",
    titleAr: "Samsung — الشبكة",
    operations: [
      { id: "sam_4g",     labelAr: "تفعيل 4G LTE",      label: "Enable 4G",     color: "green",  description: "ضبط شبكة Samsung على 4G تلقائي",  commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "sam_volte",  labelAr: "تفعيل VoLTE",        label: "Enable VoLTE",  color: "purple", description: "تفعيل VoLTE Samsung",              commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "sam_carrier_change", labelAr: "تغيير MCC/MNC يمن موبايل", label: "Set Yemen Mobile",color: "blue", description: "ضبط MCC/MNC ليمن موبايل 421/02", commands: ["adb shell settings put global preferred_network_mode 9", 'adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "samsung_flash",
    titleAr: "Samsung Flash & Wipe",
    operations: [
      { id: "sam_wipe_cache",    labelAr: "Wipe Cache [Fastboot]",   label: "Wipe Cache",       color: "orange", description: "مسح قسم الكاش",                      commands: ["fastboot erase cache", "fastboot reboot"] },
      { id: "sam_wipe_data",     labelAr: "Wipe Data [Fastboot]",    label: "Wipe Data",        color: "red",    description: "مسح بيانات المستخدم (خطر!)",          commands: ["fastboot erase userdata", "fastboot erase cache", "fastboot reboot"] },
      { id: "sam_flash_recovery",labelAr: "Flash Recovery [Fastboot]",label: "Flash Recovery",  color: "blue",   description: "فلاش ملف Recovery.img",              commands: ["fastboot flash recovery recovery.img", "fastboot reboot"] },
      { id: "sam_unlock_bl",     labelAr: "Unlock Bootloader",       label: "Unlock Bootloader",color: "red",    description: "فتح قفل Bootloader (يمحو البيانات!)", commands: ["fastboot flashing unlock", "fastboot reboot"] },
    ],
  },
];

// ─── XIAOMI ──────────────────────────────────────────────────────────────────
const XIAOMI_GROUPS: OperationGroup[] = [
  {
    id: "xiaomi_network",
    titleAr: "إعدادات الشبكة",
    operations: [
      { id: "mi_4g",   labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة Xiaomi على 4G تلقائي", commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "mi_volte",labelAr: "تفعيل VoLTE MIUI",label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE على MIUI",          commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "mi_apn",  labelAr: "إضافة APN يمن موبايل",label: "Add Yemen APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة Xiaomi", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1', "adb shell settings put global preferred_network_mode 9", "adb shell settings put global volte_vt_enabled 1"] },
    ],
  },
  {
    id: "xiaomi_frp",
    titleAr: "Xiaomi FRP & Unlock",
    operations: [
      { id: "mi_frp",              labelAr: "Remove FRP Xiaomi",       label: "Remove FRP",        color: "green",  description: "إزالة FRP لأجهزة Xiaomi/MIUI", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "mi_remove_mi_account",labelAr: "Remove Mi Account",       label: "Remove Mi Account", color: "red",    description: "إزالة حساب Xiaomi/Mi",          commands: ["adb shell pm clear com.xiaomi.account", "adb shell pm clear com.miui.cloudbackup"] },
      { id: "mi_fastboot_frp",     labelAr: "Erase FRP [Fastboot]",    label: "Erase FRP",         color: "red",    description: "مسح FRP عبر Fastboot",          commands: ["fastboot erase frp", "fastboot reboot"] },
      { id: "mi_unlock_bootloader",labelAr: "Unlock Bootloader",       label: "Unlock Bootloader", color: "red",    description: "فتح Bootloader Xiaomi (يحتاج إذن من موقع Mi)", commands: ["fastboot oem unlock"] },
    ],
  },
  {
    id: "xiaomi_modes",
    titleAr: "Xiaomi — أوضاع الدخول",
    operations: [
      { id: "mi_fastboot",      labelAr: "دخول Fastboot",   label: "Enter Fastboot",   color: "orange", description: "الإقلاع لوضع Fastboot",         commands: ["adb reboot bootloader"] },
      { id: "mi_recovery",      labelAr: "دخول Recovery",   label: "Enter Recovery",   color: "orange", description: "الإقلاع لوضع Recovery",         commands: ["adb reboot recovery"] },
      { id: "mi_edl",           labelAr: "EDL Mode 9008",   label: "EDL Mode",         color: "red",    description: "دخول وضع EDL 9008 (Qualcomm)",  commands: ["adb reboot edl"] },
      { id: "mi_disable_miui_optimization", labelAr: "إيقاف MIUI Optimization", label: "Disable MIUI Opt", color: "yellow", description: "إيقاف MIUI Optimization", commands: ["adb shell settings put global miui_optimization 0"] },
    ],
  },
];

// ─── HUAWEI ──────────────────────────────────────────────────────────────────
const HUAWEI_GROUPS: OperationGroup[] = [
  {
    id: "huawei_network",
    titleAr: "إعدادات الشبكة",
    operations: [
      { id: "hw_4g",      labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة Huawei على 4G",     commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "hw_volte",   labelAr: "تفعيل VoLTE",    label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE Huawei",          commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "hw_apn",     labelAr: "إضافة APN يمن موبايل",label: "Yemen Mobile APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة Huawei", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "huawei_frp",
    titleAr: "Huawei FRP & Accounts",
    operations: [
      { id: "hw_frp",            labelAr: "Remove FRP Huawei",    label: "Remove FRP",        color: "green",  description: "إزالة FRP لأجهزة Huawei/Honor", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.huawei.id", "adb reboot"] },
      { id: "hw_remove_account", labelAr: "Remove Huawei ID",     label: "Remove Huawei ID",  color: "red",    description: "إزالة حساب Huawei",             commands: ["adb shell pm clear com.huawei.id", "adb shell pm clear com.huawei.hwid"] },
      { id: "hw_disable_fone",   labelAr: "Disable Huawei Mobile Cloud",label: "Disable Cloud",color: "gray",  description: "تعطيل Huawei Cloud",            commands: ["adb shell pm disable-user com.huawei.hidisk"] },
    ],
  },
  {
    id: "huawei_modes",
    titleAr: "Huawei — أوضاع الدخول",
    operations: [
      { id: "hw_fastboot",  labelAr: "Fastboot Mode", label: "Fastboot",  color: "orange", description: "دخول وضع Fastboot",  commands: ["adb reboot bootloader"] },
      { id: "hw_recovery",  labelAr: "Recovery Mode", label: "Recovery",  color: "orange", description: "دخول وضع Recovery", commands: ["adb reboot recovery"] },
      { id: "hw_erecovery", labelAr: "eRecovery Mode",label: "eRecovery", color: "yellow", description: "دخول وضع eRecovery لتحديث OTA", commands: ["adb reboot erecovery"] },
    ],
  },
];

// ─── OPPO / REALME ───────────────────────────────────────────────────────────
const OPPO_GROUPS: OperationGroup[] = [
  {
    id: "oppo_network",
    titleAr: "إعدادات الشبكة",
    operations: [
      { id: "oppo_4g",    labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة OPPO/Realme على 4G",  commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "oppo_volte", labelAr: "تفعيل VoLTE",    label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE OPPO/Realme",        commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "oppo_apn",   labelAr: "إضافة APN يمن موبايل",label: "Yemen Mobile APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة OPPO", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "oppo_frp",
    titleAr: "OPPO/Realme FRP & Accounts",
    operations: [
      { id: "oppo_frp",          labelAr: "Remove FRP OPPO/Realme",  label: "Remove FRP",       color: "green",  description: "إزالة FRP لأجهزة OPPO/Realme",  commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "oppo_remove_oppo",  labelAr: "Remove OPPO Account",      label: "Remove OPPO Acct", color: "red",    description: "إزالة حساب OPPO",               commands: ["adb shell pm clear com.oplus.account"] },
      { id: "oppo_remove_realme",labelAr: "Remove Realme Account",    label: "Remove Realme",    color: "red",    description: "إزالة حساب Realme",             commands: ["adb shell pm clear com.realme.account"] },
      { id: "oppo_fastboot",     labelAr: "Fastboot Mode",            label: "Fastboot",         color: "orange", description: "دخول وضع Fastboot",              commands: ["adb reboot bootloader"] },
    ],
  },
];

// ─── TECNO / INFINIX / ITEL ──────────────────────────────────────────────────
const TECNO_GROUPS: OperationGroup[] = [
  {
    id: "tecno_network",
    titleAr: "إعدادات الشبكة",
    operations: [
      { id: "tecno_4g",    labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة Tecno/Infinix على 4G", commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "tecno_volte", labelAr: "تفعيل VoLTE",    label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE Tecno/Infinix",       commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "tecno_apn",   labelAr: "إضافة APN يمن موبايل",label: "Yemen Mobile APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة Tecno", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "tecno_frp",
    titleAr: "Tecno/Infinix/Itel FRP",
    operations: [
      { id: "tecno_frp",          labelAr: "Remove FRP Tecno",      label: "Remove FRP",       color: "green",  description: "إزالة FRP لأجهزة Tecno/Infinix/Itel", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "tecno_remove_transsion",labelAr: "Remove Transsion Account",label: "Remove Transsion",color: "red", description: "إزالة حساب Transsion (Tecno/Infinix)", commands: ["adb shell pm clear com.transsion.account"] },
      { id: "tecno_fastboot",     labelAr: "Fastboot Mode",         label: "Fastboot",         color: "orange", description: "دخول وضع Fastboot",                    commands: ["adb reboot bootloader"] },
    ],
  },
];

// ─── QUALCOMM ────────────────────────────────────────────────────────────────
const QUALCOMM_GROUPS: OperationGroup[] = [
  {
    id: "qualcomm_modes",
    titleAr: "Qualcomm — أوضاع الدخول",
    operations: [
      { id: "qcom_edl",        labelAr: "EDL Mode 9008 (QFIL)",     label: "Enter EDL 9008",      color: "red",    description: "دخول وضع Qualcomm EDL 9008 لاستخدام QFIL",  commands: ["adb reboot edl"] },
      { id: "qcom_fastboot",   labelAr: "Fastboot Mode",             label: "Enter Fastboot",      color: "orange", description: "دخول وضع Fastboot",                          commands: ["adb reboot bootloader"] },
      { id: "qcom_recovery",   labelAr: "Recovery Mode",             label: "Enter Recovery",      color: "orange", description: "دخول وضع Recovery",                          commands: ["adb reboot recovery"] },
      { id: "qcom_diag",       labelAr: "Diag Mode (ADB to Diag)",   label: "Enable Diag Port",    color: "cyan",   description: "تفعيل منفذ التشخيص Qualcomm",               commands: ["adb shell setprop sys.usb.config diag,serial_cdev,rmnet_gsi,adb"] },
      { id: "qcom_check_bl",   labelAr: "فحص حالة Bootloader",      label: "Check BL Status",     color: "blue",   description: "فحص حالة قفل Bootloader",                   commands: ["adb shell getprop ro.boot.flash.locked", "adb shell getprop ro.boot.verifiedbootstate", "fastboot oem device-info"] },
    ],
  },
  {
    id: "qualcomm_flash",
    titleAr: "Qualcomm — Flash & Repair",
    operations: [
      { id: "qcom_flash_boot",    labelAr: "Flash Boot.img",         label: "Flash Boot",          color: "blue",  description: "فلاش ملف Boot.img",                           commands: ["fastboot flash boot boot.img"] },
      { id: "qcom_flash_recovery",labelAr: "Flash Recovery.img",     label: "Flash Recovery",      color: "blue",  description: "فلاش ملف Recovery.img",                       commands: ["fastboot flash recovery recovery.img"] },
      { id: "qcom_flash_system",  labelAr: "Flash System.img",       label: "Flash System",        color: "red",   description: "فلاش ملف System (خطر!)",                      commands: ["fastboot flash system system.img"] },
      { id: "qcom_wipe_data",     labelAr: "Wipe Data & Cache",      label: "Wipe All",            color: "red",   description: "مسح كامل: userdata + cache + frp",            commands: ["fastboot erase userdata", "fastboot erase cache", "fastboot erase frp", "fastboot reboot"] },
      { id: "qcom_format_data",   labelAr: "Format Data (Encryption)",label: "Format Data",        color: "red",   description: "تهيئة قسم البيانات (يمحو التشفير)",           commands: ["fastboot format:ext4 userdata"] },
      { id: "qcom_frp_erase",     labelAr: "Erase FRP [Fastboot]",   label: "Erase FRP",           color: "green", description: "مسح FRP عبر Fastboot",                        commands: ["fastboot erase frp", "fastboot reboot"] },
    ],
  },
  {
    id: "qualcomm_info",
    titleAr: "Qualcomm — معلومات",
    operations: [
      { id: "qcom_chipset",  labelAr: "قراءة الشريحة",        label: "Read Chipset",       color: "purple", description: "قراءة معلومات شريحة Qualcomm",    commands: ["adb shell getprop ro.board.platform", "adb shell getprop ro.hardware.chipname", "adb shell cat /proc/cpuinfo | grep Hardware"] },
      { id: "qcom_modem",    labelAr: "قراءة موديم Baseband",  label: "Baseband Version",   color: "purple", description: "قراءة نسخة موديم Qualcomm",       commands: ["adb shell getprop gsm.version.baseband"] },
      { id: "qcom_bl_state", labelAr: "حالة قفل Bootloader",  label: "BL Lock State",      color: "blue",   description: "فحص حالة قفل/فتح Bootloader",    commands: ["adb shell getprop ro.boot.flash.locked", "adb shell getprop ro.secure"] },
    ],
  },
];

// ─── MEDIATEK ────────────────────────────────────────────────────────────────
const MTK_GROUPS: OperationGroup[] = [
  {
    id: "mtk_modes",
    titleAr: "MediaTek — أوضاع الدخول",
    operations: [
      { id: "mtk_brom",       labelAr: "BROM Mode (Download)",    label: "Enter BROM",          color: "red",    description: "دخول وضع BROM لاستخدام SP Flash Tool", commands: ["adb reboot download"] },
      { id: "mtk_fastboot",   labelAr: "Fastboot Mode",           label: "Enter Fastboot",      color: "orange", description: "دخول وضع Fastboot",                    commands: ["adb reboot bootloader"] },
      { id: "mtk_recovery",   labelAr: "Recovery Mode",           label: "Enter Recovery",      color: "orange", description: "دخول وضع Recovery",                    commands: ["adb reboot recovery"] },
      { id: "mtk_preloader",  labelAr: "Preloader Mode",          label: "Preloader Mode",      color: "red",    description: "دخول وضع Preloader MTK",               commands: ["adb reboot preloader"] },
    ],
  },
  {
    id: "mtk_flash",
    titleAr: "MediaTek — Flash & Repair",
    operations: [
      { id: "mtk_flash_boot",    labelAr: "Flash Boot.img",      label: "Flash Boot",       color: "blue",  description: "فلاش ملف Boot.img",         commands: ["fastboot flash boot boot.img"] },
      { id: "mtk_flash_recovery",labelAr: "Flash Recovery.img",  label: "Flash Recovery",   color: "blue",  description: "فلاش ملف Recovery.img",     commands: ["fastboot flash recovery recovery.img"] },
      { id: "mtk_wipe_data",     labelAr: "Wipe Data & Cache",   label: "Wipe All",         color: "red",   description: "مسح كامل: userdata + cache", commands: ["fastboot erase userdata", "fastboot erase cache", "fastboot reboot"] },
      { id: "mtk_erase_frp",     labelAr: "Erase FRP [Fastboot]",label: "Erase FRP",        color: "green", description: "مسح FRP عبر Fastboot",       commands: ["fastboot erase frp", "fastboot reboot"] },
    ],
  },
  {
    id: "mtk_frp",
    titleAr: "MediaTek — FRP",
    operations: [
      { id: "mtk_frp_bypass",  labelAr: "Remove FRP [MTK ADB]",  label: "Remove FRP",      color: "green", description: "إزالة FRP لأجهزة MTK عبر ADB",  commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "mtk_chipset_info",labelAr: "قراءة معلومات MTK",     label: "MTK Chipset Info", color: "purple",description: "قراءة معلومات الشريحة MTK",       commands: ["adb shell getprop ro.board.platform", "adb shell getprop ro.mediatek.platform", "adb shell cat /proc/cpuinfo | grep Hardware"] },
    ],
  },
];

// ─── VIVO / iQOO ─────────────────────────────────────────────────────────────
const VIVO_GROUPS: OperationGroup[] = [
  {
    id: "vivo_network",
    titleAr: "Vivo — الشبكة",
    operations: [
      { id: "vivo_4g",    labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة Vivo على 4G",         commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "vivo_volte", labelAr: "تفعيل VoLTE",    label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE Vivo/iQOO",          commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "vivo_apn",   labelAr: "إضافة APN يمن موبايل",label: "Yemen Mobile APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة Vivo", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "vivo_frp",
    titleAr: "Vivo FRP & Accounts",
    operations: [
      { id: "vivo_frp",           labelAr: "Remove FRP Vivo",        label: "Remove FRP",     color: "green",  description: "إزالة FRP لأجهزة Vivo/iQOO",  commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb shell pm clear com.vivo.account", "adb reboot"] },
      { id: "vivo_remove_account",labelAr: "Remove Vivo Account",    label: "Remove Vivo Acct",color: "red",   description: "إزالة حساب Vivo",              commands: ["adb shell pm clear com.vivo.account"] },
      { id: "vivo_funtouch",      labelAr: "Clear FunTouch Cache",   label: "Clear FunTouch", color: "orange", description: "مسح كاش FunTouch OS",           commands: ["adb shell pm clear com.vivo.launcher"] },
      { id: "vivo_fastboot",      labelAr: "Fastboot Mode",          label: "Fastboot",        color: "orange", description: "دخول وضع Fastboot",             commands: ["adb reboot bootloader"] },
    ],
  },
];

// ─── NOKIA ───────────────────────────────────────────────────────────────────
const NOKIA_GROUPS: OperationGroup[] = [
  {
    id: "nokia_network",
    titleAr: "Nokia — الشبكة",
    operations: [
      { id: "nokia_4g",    labelAr: "تفعيل 4G LTE",  label: "Enable 4G",  color: "green",  description: "ضبط شبكة Nokia على 4G (Android One)", commands: ["adb shell settings put global preferred_network_mode 9"] },
      { id: "nokia_volte", labelAr: "تفعيل VoLTE",    label: "Enable VoLTE",color: "purple",description: "تفعيل VoLTE Nokia (Android One)",       commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global enhanced_4g_mode_enabled 1"] },
      { id: "nokia_apn",   labelAr: "إضافة APN يمن موبايل",label: "Yemen Mobile APN",color: "blue",description: "إضافة APN يمن موبايل لأجهزة Nokia", commands: ['adb shell content insert --uri content://telephony/carriers --bind name:s:"Yemen Mobile 4G" --bind numeric:s:"42102" --bind mcc:s:"421" --bind mnc:s:"02" --bind apn:s:"ymobile" --bind type:s:"default,supl,fota" --bind protocol:s:"IPV4V6" --bind carrier_enabled:i:1'] },
    ],
  },
  {
    id: "nokia_frp",
    titleAr: "Nokia FRP & Flash",
    operations: [
      { id: "nokia_frp",       labelAr: "Remove FRP Nokia",        label: "Remove FRP",     color: "green",  description: "إزالة FRP لأجهزة Nokia (Android One)", commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "nokia_fastboot",  labelAr: "Fastboot Mode",           label: "Fastboot",       color: "orange", description: "دخول وضع Fastboot",                    commands: ["adb reboot bootloader"] },
      { id: "nokia_unlock_bl", labelAr: "Unlock Bootloader",       label: "Unlock BL",      color: "red",    description: "فتح Bootloader Nokia",                 commands: ["fastboot flashing unlock"] },
      { id: "nokia_erase_frp", labelAr: "Erase FRP [Fastboot]",   label: "Erase FRP",      color: "green",  description: "مسح FRP عبر Fastboot",                 commands: ["fastboot erase frp", "fastboot reboot"] },
    ],
  },
];

// ─── BRANDS EXPORT ───────────────────────────────────────────────────────────
export const BRANDS: Brand[] = [
  { id: "general",   name: "General",             nameAr: "عام",                    chipset: "All Chipsets",              color: "#3B82F6", groups: GENERAL_GROUPS },
  { id: "frp",       name: "FRP — All Brands",    nameAr: "FRP — كل الماركات",     chipset: "Universal",                 color: "#059669", groups: FRP_GROUPS },
  { id: "qualcomm",  name: "Qualcomm / Snapdragon",nameAr: "Qualcomm / Snapdragon", chipset: "Snapdragon",                color: "#D40000", groups: QUALCOMM_GROUPS },
  { id: "mtk",       name: "MediaTek / Dimensity", nameAr: "MediaTek / Dimensity",  chipset: "Helio / Dimensity",         color: "#E65C00", groups: MTK_GROUPS },
  { id: "samsung",   name: "Samsung",             nameAr: "Samsung",                chipset: "Exynos / Snapdragon",       color: "#1428A0", groups: SAMSUNG_GROUPS },
  { id: "xiaomi",    name: "Xiaomi / Redmi / Poco",nameAr: "Xiaomi / Redmi",        chipset: "Snapdragon / MTK",          color: "#FF6900", groups: XIAOMI_GROUPS },
  { id: "huawei",    name: "Huawei / Honor",      nameAr: "Huawei / Honor",         chipset: "Kirin / Snapdragon",        color: "#CF0A2C", groups: HUAWEI_GROUPS },
  { id: "oppo",      name: "OPPO / Realme",       nameAr: "OPPO / Realme",          chipset: "Snapdragon / MTK / Dimensity",color:"#1B5E20",groups: OPPO_GROUPS },
  { id: "tecno",     name: "Tecno / Infinix",     nameAr: "Tecno / Infinix / Itel", chipset: "MTK / Unisoc",              color: "#1565C0", groups: TECNO_GROUPS },
  { id: "vivo",      name: "Vivo / iQOO",         nameAr: "Vivo / iQOO",            chipset: "Snapdragon / MTK / Dimensity",color:"#415FFF",groups: VIVO_GROUPS },
  { id: "nokia",     name: "Nokia",               nameAr: "Nokia",                  chipset: "Snapdragon / MTK (Android One)",color:"#124191",groups: NOKIA_GROUPS },
];
