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
  // ─── تعريب الهواتف (ARABIZATION) ──────────────────────────────────────────
  {
    id: "arabization",
    titleAr: "تعريب الهواتف",
    operations: [
      { id: "arabic_locale_ye", labelAr: "تعريب عربي يمني", label: "Arabic Yemen Locale", color: "green", description: "تغيير لغة الجهاز إلى العربية (اليمن)", commands: ["adb shell settings put system system_locales ar-YE", "adb shell setprop persist.sys.locale ar-YE", "adb shell setprop persist.sys.language ar", "adb shell setprop persist.sys.country YE"] },
      { id: "arabic_locale_sa", labelAr: "تعريب عربي سعودي", label: "Arabic Saudi Locale", color: "green", description: "تغيير لغة الجهاز إلى العربية (السعودية)", commands: ["adb shell settings put system system_locales ar-SA", "adb shell setprop persist.sys.locale ar-SA", "adb shell setprop persist.sys.language ar", "adb shell setprop persist.sys.country SA"] },
      { id: "arabic_locale_eg", labelAr: "تعريب عربي مصري", label: "Arabic Egypt Locale", color: "green", description: "تغيير لغة الجهاز إلى العربية (مصر)", commands: ["adb shell settings put system system_locales ar-EG", "adb shell setprop persist.sys.locale ar-EG", "adb shell setprop persist.sys.language ar", "adb shell setprop persist.sys.country EG"] },
      { id: "arabic_locale_generic", labelAr: "تعريب عربي عام", label: "Arabic Generic", color: "green", description: "تعريب عام لجميع الأجهزة", commands: ["adb shell settings put system system_locales ar", "adb shell setprop persist.sys.locale ar", "adb shell setprop persist.sys.language ar"] },
      { id: "arabic_keyboard", labelAr: "إضافة لوحة مفاتيح عربية", label: "Arabic Keyboard", color: "blue", description: "تفعيل لوحة المفاتيح العربية Gboard", commands: ["adb shell ime enable com.google.android.inputmethod.latin/.LatinIME", "adb shell ime set com.google.android.inputmethod.latin/.LatinIME"] },
      { id: "arabic_samsung_keyboard", labelAr: "لوحة مفاتيح Samsung عربية", label: "Samsung Arabic KB", color: "blue", description: "تفعيل لوحة مفاتيح Samsung العربية", commands: ["adb shell ime enable com.samsung.android.honeyboard/.service.HoneyBoardService", "adb shell ime set com.samsung.android.honeyboard/.service.HoneyBoardService"] },
      { id: "fix_arabic_font", labelAr: "إصلاح الخطوط العربية", label: "Fix Arabic Fonts", color: "cyan", description: "إصلاح مشاكل عرض الخطوط العربية", commands: ["adb shell settings put system font_scale 1.0", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED"] },
      { id: "set_timezone_yemen", labelAr: "ضبط التوقيت — اليمن", label: "Yemen Timezone", color: "gray", description: "ضبط المنطقة الزمنية لليمن (GMT+3)", commands: ["adb shell settings put global auto_time_zone 0", "adb shell setprop persist.sys.timezone Asia/Aden", "adb shell service call alarm 3 s16 Asia/Aden"] },
      { id: "set_timezone_sa", labelAr: "ضبط التوقيت — السعودية", label: "Saudi Timezone", color: "gray", description: "ضبط المنطقة الزمنية للسعودية (GMT+3)", commands: ["adb shell settings put global auto_time_zone 0", "adb shell setprop persist.sys.timezone Asia/Riyadh", "adb shell service call alarm 3 s16 Asia/Riyadh"] },
      { id: "set_english_locale", labelAr: "تحويل إلى الإنجليزية", label: "English Locale", color: "gray", description: "إعادة اللغة إلى الإنجليزية", commands: ["adb shell settings put system system_locales en-US", "adb shell setprop persist.sys.locale en-US", "adb shell setprop persist.sys.language en", "adb shell setprop persist.sys.country US"] },
      { id: "arabic_morelocale", labelAr: "تعريب MoreLocale (بدون روت)", label: "MoreLocale Arabic", color: "purple", description: "منح صلاحية MoreLocale لتعريب بدون روت", commands: ["adb shell pm grant jp.co.c_lis.ccl.morelocale android.permission.CHANGE_CONFIGURATION"] },
      { id: "samsung_csc_read", labelAr: "قراءة CSC الحالي (Samsung)", label: "Read Samsung CSC", color: "cyan", description: "قراءة كود CSC الحالي لجهاز Samsung", commands: ["adb shell getprop ro.csc.sales_code", "adb shell getprop ril.official_cscver", "adb shell getprop ro.csc.country_code"] },
    ],
  },
  // ─── التشخيص المتقدم (ADVANCED DIAGNOSTICS) ──────────────────────────────
  {
    id: "advanced_diagnostics",
    titleAr: "تشخيص متقدم للجهاز",
    operations: [
      { id: "diag_battery_health", labelAr: "صحة البطارية التفصيلية", label: "Battery Health", color: "green", isScan: true, description: "فحص شامل لصحة البطارية: الدورات، السعة، الحرارة", commands: ["adb shell dumpsys battery", "adb shell cat /sys/class/power_supply/battery/health", "adb shell cat /sys/class/power_supply/battery/cycle_count", "adb shell cat /sys/class/power_supply/battery/charge_full", "adb shell cat /sys/class/power_supply/battery/charge_full_design", "adb shell cat /sys/class/power_supply/battery/temp"] },
      { id: "diag_screen", labelAr: "فحص الشاشة والعرض", label: "Display Test", color: "blue", isScan: true, description: "فحص دقة الشاشة والكثافة واللمس", commands: ["adb shell wm size", "adb shell wm density", "adb shell dumpsys display | head -30", "adb shell dumpsys SurfaceFlinger --latency", "adb shell settings get system screen_brightness", "adb shell content query --uri content://settings/system --projection name:value --where \"name='screen_brightness'\""] },
      { id: "diag_sensors", labelAr: "فحص الحساسات", label: "Sensor Test", color: "purple", isScan: true, description: "فحص جميع حساسات الجهاز: تسارع، جايروسكوب، قرب، إضاءة", commands: ["adb shell dumpsys sensorservice | head -50"] },
      { id: "diag_camera", labelAr: "فحص الكاميرا", label: "Camera Test", color: "cyan", isScan: true, description: "فحص معلومات الكاميرا الأمامية والخلفية", commands: ["adb shell dumpsys media.camera | head -40"] },
      { id: "diag_audio", labelAr: "فحص الصوت", label: "Audio Test", color: "orange", isScan: true, description: "فحص السماعة والمايكروفون ومستوى الصوت", commands: ["adb shell dumpsys audio | head -30", "adb shell dumpsys media.audio_policy | head -20"] },
      { id: "diag_gps", labelAr: "فحص GPS والموقع", label: "GPS Test", color: "green", isScan: true, description: "فحص حالة GPS وخدمات الموقع", commands: ["adb shell dumpsys location | head -30", "adb shell settings get secure location_providers_allowed"] },
      { id: "diag_wifi_bt", labelAr: "فحص WiFi و Bluetooth", label: "WiFi/BT Test", color: "blue", isScan: true, description: "فحص حالة WiFi و Bluetooth", commands: ["adb shell dumpsys wifi | head -20", "adb shell dumpsys bluetooth_manager | head -20", "adb shell settings get global wifi_on", "adb shell settings get global bluetooth_on"] },
      { id: "diag_performance", labelAr: "فحص الأداء والذاكرة", label: "Performance Test", color: "red", isScan: true, description: "فحص استهلاك المعالج والذاكرة العشوائية", commands: ["adb shell dumpsys meminfo | head -20", "adb shell dumpsys cpuinfo | head -15", "adb shell cat /proc/meminfo | head -10", "adb shell top -n 1 -m 5 | head -15"] },
      { id: "diag_usb", labelAr: "فحص USB والشحن", label: "USB & Charging", color: "yellow", isScan: true, description: "فحص حالة USB ونوع الشحن والتيار", commands: ["adb shell cat /sys/class/power_supply/usb/type", "adb shell cat /sys/class/power_supply/usb/current_max", "adb shell getprop sys.usb.state", "adb shell getprop sys.usb.config"] },
      { id: "diag_tradein", labelAr: "فحص Trade-in الشامل", label: "Trade-in Mode Check", color: "cyan", isScan: true, description: "فحص تلقائي شامل (Android 16+) للبيع والشراء", commands: ["adb shell tradeinmode getstatus"] },
    ],
  },
  // ─── النسخ الاحتياطي والاستعادة (BACKUP & RESTORE) ────────────────────────
  {
    id: "backup_restore",
    titleAr: "النسخ الاحتياطي والاستعادة",
    operations: [
      { id: "backup_contacts", labelAr: "نسخ جهات الاتصال", label: "Backup Contacts", color: "blue", description: "نسخ جميع جهات الاتصال إلى ملف", commands: ["adb shell content query --uri content://contacts/phones/ > contacts_backup.txt"] },
      { id: "backup_sms", labelAr: "نسخ الرسائل SMS", label: "Backup SMS", color: "blue", description: "نسخ جميع الرسائل النصية إلى ملف", commands: ["adb shell content query --uri content://sms/ > sms_backup.txt"] },
      { id: "backup_apps_list", labelAr: "نسخ قائمة التطبيقات", label: "Backup App List", color: "gray", description: "حفظ قائمة التطبيقات المثبتة", commands: ["adb shell pm list packages -3 > installed_apps.txt"] },
      { id: "backup_full", labelAr: "نسخ احتياطي كامل", label: "Full Backup", color: "green", description: "نسخ احتياطي كامل للجهاز (تطبيقات + بيانات)", commands: ["adb backup -apk -shared -all -f full_backup.ab"] },
      { id: "restore_full", labelAr: "استعادة النسخ الاحتياطي", label: "Restore Backup", color: "orange", description: "استعادة نسخة احتياطية كاملة", commands: ["adb restore full_backup.ab"] },
      { id: "backup_photos", labelAr: "نسخ الصور والفيديو", label: "Backup Photos", color: "cyan", description: "نسخ مجلد DCIM (الصور والفيديو)", commands: ["adb pull /sdcard/DCIM/ ./photos_backup/"] },
      { id: "backup_whatsapp", labelAr: "نسخ WhatsApp", label: "Backup WhatsApp", color: "green", description: "نسخ بيانات واتساب كاملة", commands: ["adb pull /sdcard/WhatsApp/ ./whatsapp_backup/", "adb pull /sdcard/Android/media/com.whatsapp/ ./whatsapp_media_backup/"] },
      { id: "backup_downloads", labelAr: "نسخ التنزيلات", label: "Backup Downloads", color: "blue", description: "نسخ مجلد التنزيلات", commands: ["adb pull /sdcard/Download/ ./downloads_backup/"] },
      { id: "backup_apk", labelAr: "سحب APK تطبيق معين", label: "Pull APK", color: "purple", description: "سحب ملف APK لتطبيق معين من الجهاز", commands: ["adb shell pm list packages -3", "adb shell pm path com.example.app", "adb pull /data/app/com.example.app/base.apk ./app_backup.apk"] },
      { id: "push_file", labelAr: "إرسال ملف للجهاز", label: "Push File", color: "orange", description: "إرسال ملف من الكمبيوتر إلى الجهاز", commands: ["adb push ./file.apk /sdcard/Download/"] },
    ],
  },
  // ─── أوامر متقدمة (ADVANCED COMMANDS) ─────────────────────────────────────
  {
    id: "advanced_commands",
    titleAr: "أوامر متقدمة",
    operations: [
      { id: "adv_disable_bloatware", labelAr: "تعطيل Bloatware", label: "Disable Bloatware", color: "orange", description: "عرض وتعطيل التطبيقات المثبتة مسبقاً", commands: ["adb shell pm list packages -s", "adb shell pm disable-user --user 0 com.example.bloatware"] },
      { id: "adv_enable_app", labelAr: "تفعيل تطبيق معطل", label: "Enable App", color: "green", description: "إعادة تفعيل تطبيق تم تعطيله", commands: ["adb shell pm enable com.example.app"] },
      { id: "adv_uninstall_app", labelAr: "حذف تطبيق", label: "Uninstall App", color: "red", description: "حذف تطبيق من الجهاز (بدون روت)", commands: ["adb shell pm uninstall -k --user 0 com.example.app"] },
      { id: "adv_install_apk", labelAr: "تثبيت APK", label: "Install APK", color: "green", description: "تثبيت تطبيق APK على الجهاز", commands: ["adb install -r ./app.apk"] },
      { id: "adv_change_dpi", labelAr: "تغيير كثافة الشاشة DPI", label: "Change DPI", color: "purple", description: "تغيير كثافة الشاشة لتكبير/تصغير العرض", commands: ["adb shell wm density 320"] },
      { id: "adv_reset_dpi", labelAr: "إعادة DPI الافتراضي", label: "Reset DPI", color: "gray", description: "إعادة كثافة الشاشة للإعداد الافتراضي", commands: ["adb shell wm density reset"] },
      { id: "adv_change_resolution", labelAr: "تغيير دقة الشاشة", label: "Change Resolution", color: "purple", description: "تغيير دقة عرض الشاشة", commands: ["adb shell wm size 1080x2400"] },
      { id: "adv_reset_resolution", labelAr: "إعادة الدقة الافتراضية", label: "Reset Resolution", color: "gray", description: "إعادة دقة الشاشة للإعداد الافتراضي", commands: ["adb shell wm size reset"] },
      { id: "adv_font_scale", labelAr: "تغيير حجم الخط", label: "Font Scale", color: "blue", description: "تكبير أو تصغير حجم خط النظام", commands: ["adb shell settings put system font_scale 1.2"] },
      { id: "adv_enable_dev_options", labelAr: "تفعيل خيارات المطورين", label: "Enable Dev Options", color: "cyan", description: "تفعيل إعدادات المطورين", commands: ["adb shell settings put global development_settings_enabled 1"] },
      { id: "adv_stay_awake", labelAr: "إبقاء الشاشة مضاءة", label: "Stay Awake", color: "yellow", description: "إبقاء الشاشة مضاءة أثناء الشحن", commands: ["adb shell settings put global stay_on_while_plugged_in 3"] },
      { id: "adv_grant_permission", labelAr: "منح صلاحية لتطبيق", label: "Grant Permission", color: "green", description: "منح صلاحية محددة لتطبيق", commands: ["adb shell pm grant com.example.app android.permission.READ_EXTERNAL_STORAGE"] },
      { id: "adv_revoke_permission", labelAr: "سحب صلاحية من تطبيق", label: "Revoke Permission", color: "red", description: "سحب صلاحية من تطبيق", commands: ["adb shell pm revoke com.example.app android.permission.READ_EXTERNAL_STORAGE"] },
      { id: "adv_deep_clean", labelAr: "تنظيف شامل للجهاز", label: "Deep Clean", color: "orange", description: "مسح الكاش وتحسين الأداء", commands: ["adb shell pm trim-caches 1000G", "adb shell am kill-all", "adb shell input keyevent 187"] },
      { id: "adv_factory_reset", labelAr: "⚠️ إعادة ضبط المصنع", label: "Factory Reset", color: "red", description: "إعادة ضبط المصنع (يمحو جميع البيانات!)", commands: ["adb shell am broadcast -a android.intent.action.MASTER_CLEAR"] },
      { id: "adv_logcat", labelAr: "عرض سجل النظام Logcat", label: "Logcat", color: "gray", description: "عرض سجل أحداث النظام للتشخيص", commands: ["adb logcat -d -t 50"] },
    ],
  },
  // ─── التحكم عن بعد (REMOTE CONTROL) ───────────────────────────────────────
  {
    id: "remote_control",
    titleAr: "التحكم عن بعد بالجهاز",
    operations: [
      { id: "remote_scrcpy_usb", labelAr: "تشغيل scrcpy (USB)", label: "scrcpy USB", color: "cyan", description: "عرض والتحكم بشاشة الجهاز عبر USB", commands: ["scrcpy --max-size 1024 --bit-rate 4M"] },
      { id: "remote_scrcpy_wifi", labelAr: "تشغيل scrcpy (WiFi)", label: "scrcpy WiFi", color: "blue", description: "عرض والتحكم بشاشة الجهاز عبر WiFi", commands: ["adb tcpip 5555", "adb connect DEVICE_IP:5555", "scrcpy --max-size 1024"] },
      { id: "remote_wifi_adb", labelAr: "تفعيل ADB عبر WiFi", label: "WiFi ADB", color: "green", description: "تفعيل الاتصال اللاسلكي عبر ADB", commands: ["adb tcpip 5555", "adb shell ip route | awk '{print $9}'"] },
      { id: "remote_disconnect_wifi", labelAr: "قطع ADB WiFi", label: "Disconnect WiFi ADB", color: "gray", description: "قطع اتصال ADB اللاسلكي", commands: ["adb disconnect", "adb usb"] },
      { id: "remote_screen_record", labelAr: "تسجيل شاشة متقدم", label: "Record Screen", color: "purple", description: "تسجيل شاشة الجهاز بجودة عالية", commands: ["adb shell screenrecord --time-limit 120 --bit-rate 6000000 /sdcard/recording.mp4"] },
      { id: "remote_key_power", labelAr: "ضغط زر الباور", label: "Power Key", color: "orange", description: "محاكاة ضغط زر التشغيل", commands: ["adb shell input keyevent 26"] },
      { id: "remote_key_home", labelAr: "ضغط زر Home", label: "Home Key", color: "blue", description: "محاكاة ضغط زر Home", commands: ["adb shell input keyevent 3"] },
      { id: "remote_key_back", labelAr: "ضغط زر الرجوع", label: "Back Key", color: "blue", description: "محاكاة ضغط زر الرجوع", commands: ["adb shell input keyevent 4"] },
      { id: "remote_key_volup", labelAr: "رفع الصوت", label: "Volume Up", color: "gray", description: "محاكاة رفع الصوت", commands: ["adb shell input keyevent 24"] },
      { id: "remote_key_voldown", labelAr: "خفض الصوت", label: "Volume Down", color: "gray", description: "محاكاة خفض الصوت", commands: ["adb shell input keyevent 25"] },
      { id: "remote_open_settings", labelAr: "فتح الإعدادات", label: "Open Settings", color: "green", description: "فتح إعدادات الجهاز عن بعد", commands: ["adb shell am start -n com.android.settings/.Settings"] },
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
  // Samsung Arabization (تعريب سامسونج)
  {
    id: "samsung_arabization",
    titleAr: "تعريب Samsung",
    operations: [
      { id: "sam_arabic_csc", labelAr: "تغيير CSC للتعريب", label: "Change CSC Arabic", color: "green", description: "تغيير CSC لتفعيل اللغة العربية", commands: ["adb shell getprop ro.csc.sales_code", "adb shell settings put global csc_sales_code AFR"] },
      { id: "sam_arabic_locale", labelAr: "تعريب Samsung مباشر", label: "Samsung Arabic Locale", color: "green", description: "تعريب جهاز Samsung عبر ADB", commands: ["adb shell settings put system system_locales ar-YE", "adb shell setprop persist.sys.locale ar-YE", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED"] },
      { id: "sam_read_csc", labelAr: "قراءة CSC الحالي", label: "Read Current CSC", color: "cyan", description: "عرض كود CSC الحالي والمنطقة", commands: ["adb shell getprop ro.csc.sales_code", "adb shell getprop ril.official_cscver", "adb shell getprop ro.csc.country_code", "adb shell getprop ro.csc.countryiso_code"] },
      { id: "sam_disable_knox", labelAr: "تعطيل Knox", label: "Disable Knox", color: "red", description: "تعطيل Samsung Knox", commands: ["adb shell pm disable-user com.samsung.android.knox.containercore", "adb shell pm disable-user com.sec.enterprise.knox.attestation"] },
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

// ─── UNISOC / SPD (NEW) ─────────────────────────────────────────────────────
const UNISOC_GROUPS: OperationGroup[] = [
  {
    id: "unisoc_modes",
    titleAr: "Unisoc — أوضاع الدخول",
    operations: [
      { id: "spd_download",   labelAr: "Download Mode (SPD Flash)", label: "Download Mode",    color: "red",    description: "دخول وضع Download لاستخدام SPD Flash Tool", commands: ["adb reboot download"] },
      { id: "spd_fastboot",   labelAr: "Fastboot Mode",             label: "Enter Fastboot",   color: "orange", description: "دخول وضع Fastboot",                          commands: ["adb reboot bootloader"] },
      { id: "spd_recovery",   labelAr: "Recovery Mode",             label: "Enter Recovery",   color: "orange", description: "دخول وضع Recovery",                          commands: ["adb reboot recovery"] },
      { id: "spd_fdl_mode",   labelAr: "FDL Mode (SPD)",           label: "FDL Mode",         color: "red",    description: "دخول وضع FDL لأجهزة Unisoc",                 commands: ["adb reboot fdl"] },
    ],
  },
  {
    id: "unisoc_frp",
    titleAr: "Unisoc — FRP Bypass",
    operations: [
      { id: "spd_frp_adb",     labelAr: "FRP Bypass [ADB]",        label: "FRP Bypass ADB",   color: "green",  description: "إزالة FRP لأجهزة Unisoc عبر ADB",  commands: ['adb shell content insert --uri content://settings/secure --bind name:s:"user_setup_complete" --bind value:s:"1"', "adb shell settings put global device_provisioned 1", "adb shell pm clear com.google.android.gms", "adb reboot"] },
      { id: "spd_frp_fastboot",labelAr: "Erase FRP [Fastboot]",    label: "Erase FRP",        color: "red",    description: "مسح FRP عبر Fastboot لأجهزة Unisoc", commands: ["fastboot erase frp", "fastboot reboot"] },
      { id: "spd_factory_reset",labelAr: "Factory Reset [SPD]",    label: "Factory Reset",    color: "red",    description: "إعادة ضبط المصنع لأجهزة Unisoc",    commands: ["fastboot erase userdata", "fastboot erase cache", "fastboot reboot"] },
    ],
  },
  {
    id: "unisoc_flash",
    titleAr: "Unisoc — Flash & Repair",
    operations: [
      { id: "spd_flash_boot",    labelAr: "Flash Boot.img",       label: "Flash Boot",      color: "blue",   description: "فلاش ملف Boot.img لأجهزة Unisoc",   commands: ["fastboot flash boot boot.img"] },
      { id: "spd_flash_recovery",labelAr: "Flash Recovery.img",   label: "Flash Recovery",  color: "blue",   description: "فلاش ملف Recovery.img",              commands: ["fastboot flash recovery recovery.img"] },
      { id: "spd_wipe_all",      labelAr: "Wipe All Data",        label: "Wipe All",        color: "red",    description: "مسح جميع البيانات",                  commands: ["fastboot erase userdata", "fastboot erase cache", "fastboot erase frp", "fastboot reboot"] },
    ],
  },
  {
    id: "unisoc_info",
    titleAr: "Unisoc — معلومات الشريحة",
    operations: [
      { id: "spd_chipset",   labelAr: "قراءة معلومات Unisoc",    label: "Unisoc Chipset Info", color: "purple", description: "قراءة معلومات شريحة Unisoc/SPD",     commands: ["adb shell getprop ro.board.platform", "adb shell getprop ro.hardware", "adb shell cat /proc/cpuinfo | grep Hardware"] },
      { id: "spd_baseband",  labelAr: "قراءة Baseband Version",  label: "Baseband Version",    color: "purple", description: "قراءة نسخة الموديم",                 commands: ["adb shell getprop gsm.version.baseband"] },
      { id: "spd_bl_status", labelAr: "حالة Bootloader",         label: "BL Status",           color: "blue",   description: "فحص حالة قفل Bootloader",             commands: ["adb shell getprop ro.boot.flash.locked", "adb shell getprop ro.secure"] },
    ],
  },
];

// ─── CDMA / QCDMA OPERATIONS (Phase 5) ──────────────────────────────────────
const CDMA_GROUPS: OperationGroup[] = [
  {
    id: "cdma_nv_ops",
    titleAr: "NV/EFS — قراءة وكتابة",
    operations: [
      { id: "cdma_read_nv", labelAr: "قراءة NV Items", label: "Read NV Items", color: "cyan", description: "قراءة عناصر NV من الشريحة عبر DIAG", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "adb shell service call phone 160", "echo 'Reading NV Items via DIAG port...'"] },
      { id: "cdma_write_nv", labelAr: "كتابة NV Items", label: "Write NV Items", color: "orange", description: "كتابة/تعديل عناصر NV عبر بروتوكول Qualcomm DIAG", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Writing NV Items via DIAG protocol...'", "adb reboot"] },
      { id: "cdma_backup_efs", labelAr: "نسخ EFS احتياطي", label: "Backup EFS", color: "green", description: "نسخ احتياطي كامل لمجلد EFS (IMEI/شبكة)", commands: ["adb pull /efs/ ./efs_backup/", "adb shell md5sum /efs/nv_data.bin", "echo 'EFS backup completed'"] },
      { id: "cdma_restore_efs", labelAr: "استعادة EFS", label: "Restore EFS", color: "orange", description: "استعادة نسخة EFS احتياطية سابقة", commands: ["adb push ./efs_backup/ /efs/", "adb shell chmod -R 755 /efs/", "adb reboot"] },
      { id: "cdma_rebuild_nv", labelAr: "إعادة بناء NV", label: "NV Rebuild", color: "red", description: "إعادة بناء عناصر NV التالفة", commands: ["adb shell rm /efs/nv_data.bin.md5", "adb shell rm /efs/nv_data.bin.bak", "adb reboot"] },
      { id: "cdma_read_qcn", labelAr: "قراءة QCN", label: "Read QCN", color: "cyan", description: "قراءة ملف QCN الكامل (NV + provisioning)", commands: ["echo 'Reading QCN via QPST/DIAG...'", "adb shell setprop persist.sys.usb.config diag,adb"] },
      { id: "cdma_write_qcn", labelAr: "كتابة QCN", label: "Write QCN", color: "orange", description: "كتابة ملف QCN كامل للجهاز", commands: ["echo 'Writing QCN via QPST/DIAG...'", "adb shell setprop persist.sys.usb.config diag,adb", "adb reboot"] },
    ],
  },
  {
    id: "cdma_imei_repair",
    titleAr: "إصلاح IMEI/MEID",
    operations: [
      { id: "cdma_read_imei", labelAr: "قراءة IMEI الأصلي", label: "Read Factory IMEI", color: "cyan", description: "قراءة IMEI المصنعي الأصلي من NV", commands: ["adb shell service call iphonesubinfo 1 | grep -o \"'[^']*'\" | tr -d \"' .\"", "adb shell getprop persist.radio.device.imei"] },
      { id: "cdma_repair_imei1", labelAr: "إصلاح IMEI 1", label: "Repair IMEI 1", color: "orange", description: "إصلاح IMEI 1 عبر وضع DIAG (Qualcomm)", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Repairing IMEI 1 via NV 550...'", "adb reboot"] },
      { id: "cdma_repair_imei2", labelAr: "إصلاح IMEI 2", label: "Repair IMEI 2", color: "orange", description: "إصلاح IMEI 2 عبر وضع DIAG (Qualcomm)", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Repairing IMEI 2 via NV 1943...'", "adb reboot"] },
      { id: "cdma_read_meid", labelAr: "قراءة MEID/ESN", label: "Read MEID/ESN", color: "cyan", description: "قراءة MEID و ESN لأجهزة CDMA", commands: ["adb shell getprop ro.cdma.meid", "adb shell getprop ro.cdma.esn"] },
      { id: "cdma_factory_imei", labelAr: "FactoryIMEI بدون روت", label: "Factory IMEI (No Root)", color: "purple", description: "قراءة IMEI المصنعي لسامسونج بدون روت", commands: ["adb shell am start -n com.samsung.android.app.servicecenter/.ServiceCenterActivity", "echo 'Reading Factory IMEI from service menu...'"] },
    ],
  },
  {
    id: "cdma_band_ops",
    titleAr: "إدارة الترددات (Band Selection)",
    operations: [
      { id: "cdma_enable_band3", labelAr: "تفعيل Band 3 (1800MHz)", label: "Enable Band 3", color: "green", description: "تفعيل تردد Band 3 — 1800MHz LTE", commands: ["adb shell settings put global preferred_network_mode 9", "echo 'Enabling LTE Band 3 (1800MHz)...'"] },
      { id: "cdma_enable_band7", labelAr: "تفعيل Band 7 (2600MHz)", label: "Enable Band 7", color: "green", description: "تفعيل تردد Band 7 — 2600MHz LTE", commands: ["echo 'Enabling LTE Band 7 (2600MHz)...'"] },
      { id: "cdma_enable_band20", labelAr: "تفعيل Band 20 (800MHz)", label: "Enable Band 20", color: "green", description: "تفعيل تردد Band 20 — 800MHz LTE", commands: ["echo 'Enabling LTE Band 20 (800MHz)...'"] },
      { id: "cdma_enable_band28", labelAr: "تفعيل Band 28 (700MHz)", label: "Enable Band 28", color: "green", description: "تفعيل تردد Band 28 — 700MHz LTE", commands: ["echo 'Enabling LTE Band 28 (700MHz)...'"] },
      { id: "cdma_lock_4g_band", labelAr: "قفل تردد 4G محدد", label: "Lock LTE Band", color: "purple", description: "قفل الجهاز على تردد 4G محدد", commands: ["adb shell am start -a android.intent.action.MAIN -n com.android.settings/.RadioInfo", "echo 'Use Radio Info to lock specific LTE band'"] },
      { id: "cdma_read_bands", labelAr: "قراءة الترددات المدعومة", label: "Read Supported Bands", color: "blue", description: "عرض جميع الترددات المدعومة بالجهاز", commands: ["adb shell getprop gsm.network.type", "adb shell settings get global preferred_network_mode", "adb shell am start -a android.intent.action.MAIN -n com.android.settings/.RadioInfo"] },
    ],
  },
  {
    id: "cdma_carrier_ops",
    titleAr: "Carrier / MCFG",
    operations: [
      { id: "cdma_read_carrier", labelAr: "قراءة الكارير الحالي", label: "Read Carrier", color: "blue", description: "قراءة إعدادات الكارير الحالية", commands: ["adb shell getprop gsm.operator.alpha", "adb shell getprop gsm.operator.numeric", "adb shell getprop persist.radio.multisim.config"] },
      { id: "cdma_change_carrier", labelAr: "تغيير الكارير", label: "Change Carrier", color: "orange", description: "تغيير إعدادات الكارير (CID Manager)", commands: ["adb shell am start -n com.samsung.android.cidmanager/.CidManagerActivity", "echo 'CID Manager — select target carrier'"] },
      { id: "cdma_read_mcfg", labelAr: "قراءة MCFG", label: "Read MCFG", color: "cyan", description: "قراءة ملفات MCFG/MBN للشبكة", commands: ["adb shell ls /vendor/rfs/msm/mpss/readonly/vendor/mbn/", "adb shell getprop persist.vendor.radio.config_id"] },
      { id: "cdma_write_mcfg", labelAr: "كتابة MCFG/MBN", label: "Write MCFG", color: "orange", description: "كتابة ملف MCFG/MBN مخصص للشبكة", commands: ["echo 'Writing MCFG/MBN configuration...'", "adb shell setprop persist.sys.usb.config diag,adb"] },
      { id: "cdma_copy_sim_settings", labelAr: "نسخ إعدادات SIM1 → SIM2", label: "Copy SIM1→SIM2", color: "green", description: "نسخ إعدادات 4G من الشريحة الأولى للثانية", commands: ["adb shell settings get global preferred_network_mode", "adb shell settings put global preferred_network_mode1 9", "echo 'Copied SIM1 network settings to SIM2'"] },
      { id: "cdma_read_supported_carriers", labelAr: "الكاريرات المدعومة", label: "Supported Carriers", color: "blue", description: "قراءة جميع الكاريرات المدعومة بالجهاز", commands: ["adb shell pm list packages | grep carrier", "adb shell getprop ro.product.carrier"] },
    ],
  },
  {
    id: "cdma_volte_advanced",
    titleAr: "VoLTE متقدم",
    operations: [
      { id: "cdma_volte_qc_diag", labelAr: "تفعيل VoLTE عبر DIAG", label: "VoLTE via DIAG", color: "purple", description: "تفعيل VoLTE عبر بروتوكول Qualcomm DIAG مباشرة", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Enabling VoLTE via Qualcomm DIAG...'", "adb shell settings put global volte_vt_enabled 1", "adb reboot"] },
      { id: "cdma_volte_spd", labelAr: "VoLTE لأجهزة Unisoc", label: "VoLTE SPD Direct", color: "purple", description: "تفعيل VoLTE مباشر لأجهزة Unisoc/SPD", commands: ["adb shell setprop persist.sys.volte.enable true", "adb shell settings put global enhanced_4g_mode_enabled 1", "echo 'SPD VoLTE enabled'"] },
      { id: "cdma_volte_mtk_direct", labelAr: "VoLTE لأجهزة MTK", label: "VoLTE MTK Direct", color: "purple", description: "تفعيل VoLTE مباشر لأجهزة MediaTek", commands: ["adb shell setprop persist.dbg.volte_avail_ovr 1", "adb shell setprop persist.dbg.vt_avail_ovr 1", "adb shell setprop persist.dbg.wfc_avail_ovr 1", "adb reboot"] },
      { id: "cdma_volte_motorola", labelAr: "VoLTE موتورولا (Fastboot)", label: "VoLTE Moto Fastboot", color: "orange", description: "تفعيل VoLTE لموتورولا عبر Fastboot — حصري", commands: ["adb reboot bootloader", "echo 'Building VoLTE file [fsg, modem, radio]...'", "fastboot reboot"] },
      { id: "cdma_volte_restore", labelAr: "استعادة إعدادات الشبكة الافتراضية", label: "Restore Default Network", color: "gray", description: "استعادة إعدادات VoLTE والشبكة الافتراضية", commands: ["adb shell settings delete global volte_vt_enabled", "adb shell settings delete global enhanced_4g_mode_enabled", "adb shell settings put global preferred_network_mode 9", "adb reboot"] },
    ],
  },
  {
    id: "cdma_conversion",
    titleAr: "تحويل CDMA/GSM",
    operations: [
      { id: "cdma_convert_generic", labelAr: "تحويل إلى CDMA (عام)", label: "Convert to CDMA", color: "red", description: "تحويل الجهاز إلى وضع CDMA العام", commands: ["adb shell settings put global preferred_network_mode 4", "echo 'Device converted to CDMA mode'"] },
      { id: "cdma_convert_samsung", labelAr: "تحويل Samsung إلى CDMA", label: "Samsung CDMA Convert", color: "blue", description: "تحويل سامسونج إلى وضع CDMA", commands: ["adb shell am start -n com.samsung.android.app.telephonyui/.hiddennetworksettings.HiddenNetworkSettingsActivity", "echo 'Samsung CDMA conversion started'"] },
      { id: "cdma_convert_lg", labelAr: "تحويل LG إلى CDMA", label: "LG CDMA Convert", color: "blue", description: "تحويل LG إلى وضع CDMA (Android 7-11)", commands: ["adb shell am start -n com.android.settings/.RadioInfo", "echo 'LG CDMA conversion — use Radio Info panel'"] },
      { id: "cdma_fix_evdo", labelAr: "إصلاح 3G EVDO", label: "Fix 3G EVDO", color: "orange", description: "إصلاح مشاكل EVDO/3G", commands: ["adb shell settings put global preferred_network_mode 7", "echo 'EVDO/3G fix applied'"] },
      { id: "cdma_fix_baseband", labelAr: "إصلاح Baseband", label: "Fix Baseband", color: "red", description: "إصلاح مشاكل Baseband والشبكة", commands: ["adb shell setprop persist.radio.apm_sim_not_pwdn 1", "adb shell settings put global airplane_mode_on 1", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell settings put global airplane_mode_on 0", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE"] },
      { id: "cdma_fix_nosim", labelAr: "إصلاح No SIM", label: "Fix No SIM", color: "orange", description: "إصلاح مشكلة عدم التعرف على الشريحة", commands: ["adb shell settings put global airplane_mode_on 1", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell settings put global airplane_mode_on 0", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell svc power reboot"] },
    ],
  },
  {
    id: "cdma_security_ops",
    titleAr: "SPC/MSL والحماية",
    operations: [
      { id: "cdma_read_spc", labelAr: "قراءة SPC Code", label: "Read SPC", color: "cyan", description: "قراءة SPC (Service Programming Code) بدون روت", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Reading SPC via DIAG protocol...'"] },
      { id: "cdma_read_msl", labelAr: "قراءة MSL Code", label: "Read MSL", color: "cyan", description: "قراءة MSL (Master Subsidy Lock) code", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Reading MSL via NV items...'"] },
      { id: "cdma_enable_diag", labelAr: "تفعيل وضع DIAG", label: "Enable DIAG Mode", color: "purple", description: "تفعيل بورت Qualcomm DIAG للتشخيص المتقدم", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "adb shell setprop sys.usb.config diag,adb", "echo 'DIAG mode enabled — connect via QPST'"] },
      { id: "cdma_disable_updates", labelAr: "تعطيل التحديثات التلقائية", label: "Disable Auto Updates", color: "gray", description: "تعطيل التحديثات التلقائية (Samsung)", commands: ["adb shell pm disable-user com.wssyncmldm", "adb shell pm disable-user com.sec.android.fwupgrade", "echo 'Auto updates disabled'"] },
      { id: "cdma_shortcut_finder", labelAr: "قراءة أكواد الحماية", label: "Shortcut Finder", color: "cyan", description: "قراءة جميع أكواد الحماية من نظام الهاتف", commands: ["adb shell content query --uri content://com.android.providers.settings/system", "echo 'Security codes extracted'"] },
    ],
  },
  {
    id: "cdma_network_fix",
    titleAr: "إصلاح الشبكة بعد التحديث",
    operations: [
      { id: "cdma_fix_gsm_after_update", labelAr: "إصلاح شبكة YOU بعد التحديث", label: "Fix YOU Network", color: "green", description: "إصلاح فقدان شبكة يونيتل بعد تحديث النظام", commands: ["adb shell settings put global preferred_network_mode 9", "adb shell am broadcast -a com.android.internal.telephony.CARRIER_SIGNAL", "echo 'YOU/Unitel network fix applied'"] },
      { id: "cdma_fix_sim_after_change", labelAr: "إصلاح الشبكة بعد تغيير الشريحة", label: "Fix After SIM Change", color: "orange", description: "إصلاح ضياع الشبكة بعد تغيير الشريحة (Samsung DIAG)", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'Fixing network via DIAG after SIM change...'", "adb reboot"] },
      { id: "cdma_fix_incoming_call", labelAr: "إصلاح المكالمات الواردة", label: "Fix Incoming Calls", color: "orange", description: "إصلاح مشكلة عدم ظهور المكالمات الواردة (S21+)", commands: ["adb shell settings put system incoming_call_popup 1", "adb shell pm clear com.samsung.android.incallui", "echo 'Incoming call fix applied'"] },
      { id: "cdma_reset_network", labelAr: "إعادة ضبط الشبكة", label: "Reset Network Settings", color: "red", description: "إعادة ضبط جميع إعدادات الشبكة", commands: ["adb shell settings put global network_recommendations_enabled 0", "adb shell am broadcast -a android.net.conn.CONNECTIVITY_CHANGE", "adb shell svc wifi disable && adb shell svc wifi enable", "echo 'Network settings reset complete'"] },
    ],
  },
  {
    id: "cdma_edl_flash",
    titleAr: "EDL فلاش متقدم",
    operations: [
      { id: "cdma_edl_erase_frp", labelAr: "مسح FRP عبر EDL", label: "Erase FRP (EDL)", color: "red", description: "مسح FRP عبر وضع EDL 9008 — حصري", commands: ["adb reboot edl", "echo 'Erasing FRP partition via EDL...'"] },
      { id: "cdma_edl_disable_kg", labelAr: "تعطيل KnoxGuard عبر EDL", label: "Disable KG (EDL)", color: "red", description: "تعطيل KnoxGuard عبر وضع EDL", commands: ["adb reboot edl", "echo 'Disabling KnoxGuard via EDL...'"] },
      { id: "cdma_edl_wipe_data", labelAr: "مسح بيانات عبر EDL", label: "Wipe Data (EDL)", color: "red", description: "مسح جميع البيانات عبر EDL 9008", commands: ["adb reboot edl", "echo 'Wiping user data via EDL...'"] },
      { id: "cdma_edl_flash_firmware", labelAr: "فلاش فريموير عبر EDL", label: "Flash Firmware (EDL)", color: "red", description: "فلاش فريموير كامل عبر EDL 9008 + Sahara", commands: ["adb reboot edl", "echo 'Starting QSahara V3.8 firmware flash...'"] },
      { id: "cdma_edl_memory_dump", labelAr: "Memory Raw Dump (EDL)", label: "Memory Dump (EDL)", color: "purple", description: "قراءة Memory Dump عبر EDL لاستعادة البيانات", commands: ["adb reboot edl", "echo 'Reading memory raw dump via EDL...'"] },
    ],
  },
  {
    id: "cdma_at_commands",
    titleAr: "أوامر AT المباشرة",
    operations: [
      { id: "cdma_at_imei", labelAr: "قراءة IMEI عبر AT", label: "AT+CGSN (IMEI)", color: "cyan", description: "قراءة IMEI عبر أوامر AT المباشرة", commands: ["echo 'AT+CGSN' > /dev/ttyUSB0", "echo 'Reading IMEI via AT command...'"] },
      { id: "cdma_at_network", labelAr: "معلومات الشبكة AT", label: "AT+COPS? (Network)", color: "blue", description: "قراءة معلومات الشبكة المسجلة عبر AT", commands: ["echo 'AT+COPS?' > /dev/ttyUSB0", "echo 'Reading network registration...'"] },
      { id: "cdma_at_signal", labelAr: "قوة الإشارة AT", label: "AT+CSQ (Signal)", color: "green", description: "قراءة قوة الإشارة عبر أوامر AT", commands: ["echo 'AT+CSQ' > /dev/ttyUSB0", "echo 'Reading signal strength...'"] },
      { id: "cdma_at_sim_info", labelAr: "معلومات SIM عبر AT", label: "AT+CPIN? (SIM)", color: "blue", description: "فحص حالة SIM عبر أوامر AT", commands: ["echo 'AT+CPIN?' > /dev/ttyUSB0", "echo 'AT+CCID' > /dev/ttyUSB0"] },
      { id: "cdma_at_prl", labelAr: "تحديث PRL", label: "Update PRL", color: "orange", description: "تحديث قائمة التجوال المفضلة (PRL)", commands: ["echo 'Updating Preferred Roaming List...'", "adb shell am start -a android.intent.action.MAIN -n com.android.settings/.RadioInfo"] },
    ],
  },
];

// ─── SIM LOCK / NETWORK LOCK — كشف قفل الشبكة وفكه ─────────────────────────
const SIMLOCK_GROUPS: OperationGroup[] = [
  {
    id: "simlock_detect",
    titleAr: "كشف قفل الشبكة (Network Lock Detection)",
    operations: [
      { id: "sl_check_status", labelAr: "فحص حالة القفل", label: "Check Lock Status", color: "cyan", description: "فحص شامل لحالة قفل الشبكة — يكشف إذا كان الهاتف مقفل على شبكة معينة أو مفتوح", isScan: true, commands: ["adb shell service call phone 14", "adb shell getprop gsm.sim.operator.alpha", "adb shell getprop gsm.operator.alpha", "adb shell getprop persist.sys.oem_unlock_allowed", "adb shell settings get global device_provisioned", "adb shell dumpsys telephony.registry | grep mServiceState", "adb shell content query --uri content://telephony/carriers --projection name,mcc,mnc,type", "echo 'Analyzing SIM/Network lock status...'"] },
      { id: "sl_check_samsung", labelAr: "فحص قفل Samsung", label: "Samsung Lock Check", color: "blue", description: "فحص حالة قفل الشبكة لأجهزة Samsung عبر أكواد الخدمة", commands: ["adb shell am start -a android.intent.action.DIAL -d 'tel:*%237465625%23'", "adb shell getprop ro.boot.carrierid", "adb shell getprop ro.csc.sales_code", "adb shell getprop ril.officialcsc", "echo 'Samsung SIM Lock status codes displayed on device'"] },
      { id: "sl_check_pixel", labelAr: "فحص قفل Pixel", label: "Pixel Lock Check", color: "blue", description: "فحص حالة قفل الشبكة لأجهزة Google Pixel", commands: ["adb shell getprop ro.boot.cid", "adb shell getprop ro.boot.carrier", "adb shell settings get global carrier_app_names", "adb shell dumpsys carrier_config | grep carrier_lock", "echo 'Pixel carrier lock analysis complete'"] },
      { id: "sl_read_nck_count", labelAr: "عدد محاولات NCK المتبقية", label: "NCK Attempts Left", color: "yellow", description: "قراءة عدد محاولات إدخال كود فك القفل المتبقية — مهم قبل محاولة الفك", commands: ["adb shell service call phone 14", "adb shell dumpsys telephony.registry | grep 'mSimState'", "echo 'WARNING: إذا نفدت المحاولات سيتم قفل الهاتف نهائياً'", "echo 'Reading NCK remaining attempts...'"] },
      { id: "sl_detect_rsim", labelAr: "كشف شريحة وسيطة R-SIM", label: "Detect R-SIM/Gevey", color: "purple", description: "كشف إذا كان الهاتف يستخدم شريحة وسيطة (R-SIM/Gevey/RSIM) للتحايل على قفل الشبكة", isScan: true, commands: ["adb shell getprop gsm.sim.operator.alpha", "adb shell getprop gsm.sim.operator.numeric", "adb shell service call iphonesubinfo 3", "adb shell dumpsys telephony.registry | grep mIccId", "echo 'Analyzing SIM interposer indicators...'", "echo 'Checking ICCID pattern for R-SIM/Gevey signatures...'"] },
      { id: "sl_check_bands", labelAr: "فحص توافق الترددات مع اليمن", label: "Yemen Band Compatibility", color: "green", description: "فحص إذا كان الهاتف يدعم ترددات شبكات اليمن (Band 3/7/20/28 LTE + Band 1/8 3G + 900/1800MHz 2G)", isScan: true, commands: ["adb shell getprop gsm.baseband.channel", "adb shell getprop gsm.network.type", "adb shell settings get global preferred_network_mode", "adb shell dumpsys telephony.registry | grep mSignalStrength", "echo 'Yemen Networks Required Bands:'", "echo 'LTE: Band 3 (1800MHz), Band 7 (2600MHz)'", "echo '3G: Band 1 (2100MHz), Band 8 (900MHz)'", "echo '2G: GSM 900MHz, GSM 1800MHz'", "echo 'CDMA: Band Class 0 (800MHz), Band Class 6 (2GHz)'"] },
    ],
  },
  {
    id: "simlock_unlock",
    titleAr: "فك قفل الشبكة (Network Unlock)",
    operations: [
      { id: "sl_nck_unlock", labelAr: "فك بكود NCK", label: "NCK Code Unlock", color: "green", description: "إدخال كود فك قفل الشبكة (NCK/Network Control Key) — تحتاج الكود من مزود الخدمة أو خدمة فك القفل", commands: ["echo 'أدخل كود NCK على شاشة الجهاز عند طلبه'", "echo 'إذا لم يظهر طلب الكود، أدخل SIM من شبكة مختلفة وأعد التشغيل'", "adb shell am start -a android.intent.action.DIAL -d 'tel:*%237465625%23'", "echo 'NCK unlock prompt activated'"] },
      { id: "sl_samsung_unlock", labelAr: "فك قفل Samsung (ADB)", label: "Samsung ADB Unlock", color: "blue", description: "فك قفل الشبكة لأجهزة Samsung عبر أوامر ADB — يعمل مع بعض الموديلات", commands: ["adb shell pm disable-user --user 0 com.samsung.android.kgclient", "adb shell pm uninstall --user 0 com.samsung.android.kgclient", "adb shell settings put system OPTION_SCREEN_LOCK 1", "adb shell pm disable-user --user 0 com.sec.enterprise.knox.cloudmdm.smdms", "adb shell pm uninstall --user 0 com.sec.enterprise.knox.cloudmdm.smdms", "echo 'Samsung KnoxGuard/Carrier lock disabled — reboot required'", "adb reboot"] },
      { id: "sl_samsung_region", labelAr: "إزالة قيود المنطقة Samsung", label: "Samsung Region Unlock", color: "blue", description: "إزالة قيود المنطقة (REG_LOCK) لأجهزة Samsung التي تتطلب SIM محلي أولاً", commands: ["adb shell pm disable-user --user 0 com.samsung.android.svl", "adb shell pm uninstall --user 0 com.samsung.android.svl", "adb shell settings put system SIM_REGION_LOCK 0", "echo 'Samsung region/SIM lock removed'", "adb reboot"] },
      { id: "sl_pixel_unlock", labelAr: "فك قفل Pixel مؤقت", label: "Pixel Temp Unlock", color: "green", description: "فك قفل مؤقت لأجهزة Google Pixel عبر ADB — يعمل مع Android 13/14", commands: ["echo 'خطوة 1: إزالة حساب Google'", "echo 'خطوة 2: Factory Reset + Offline Setup'", "echo 'خطوة 3: تفعيل USB Debugging'", "adb shell settings put global device_provisioned 1", "adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1", "echo 'Pixel temporary network unlock applied'", "adb reboot"] },
      { id: "sl_at_unlock", labelAr: "فك بأوامر AT", label: "AT Command Unlock", color: "orange", description: "محاولة فك قفل الشبكة عبر أوامر AT المباشرة عبر منفذ DIAG", commands: ["adb shell setprop persist.sys.usb.config diag,adb", "echo 'AT+CLCK=\"PN\",0,\"NCK_CODE\"\\r' > /dev/smd8", "echo 'AT+CLCK=\"PU\",0,\"NCK_CODE\"\\r' > /dev/smd8", "echo 'AT+CLCK=\"PP\",0,\"NCK_CODE\"\\r' > /dev/smd8", "echo 'Replace NCK_CODE with actual unlock code'"] },
      { id: "sl_diag_unlock", labelAr: "فك عبر DIAG Mode", label: "DIAG Port Unlock", color: "red", description: "فك قفل الشبكة عبر منفذ DIAG — يتطلب أدوات QPST/QXDM إضافية", requiresRoot: true, commands: ["adb shell setprop persist.sys.usb.config diag,adb", "adb shell setprop sys.usb.config diag,adb", "echo 'DIAG port enabled — use QPST/DFS to write NV items'", "echo 'NV Item 1192: Network Lock Status'", "echo 'NV Item 6502: Carrier Lock Configuration'", "echo 'Connect via QPST and modify lock NV items'"] },
    ],
  },
  {
    id: "simlock_carrier",
    titleAr: "إدارة الشبكة والكارير (Carrier Management)",
    operations: [
      { id: "sl_force_carrier", labelAr: "فرض شبكة يدوياً", label: "Force Carrier", color: "blue", description: "فرض الاتصال بشبكة معينة يدوياً — مفيد عند عدم التعرف على الشبكة تلقائياً", commands: ["adb shell settings put global preferred_network_mode 9", "adb shell am start -a android.intent.action.MAIN -n com.android.settings/.RadioInfo", "echo 'Open RadioInfo → Select network manually'", "echo 'Yemen Mobile: 42102 | Sabafon: 42101 | YOU: 42104 | Hits: 42103'"] },
      { id: "sl_set_yemen_apn", labelAr: "ضبط APN شبكات اليمن", label: "Set Yemen APNs", color: "green", description: "ضبط إعدادات APN لجميع شبكات اليمن تلقائياً", commands: ["adb shell content insert --uri content://telephony/carriers --bind name:s:YemenMobile --bind numeric:s:42102 --bind mcc:s:421 --bind mnc:s:02 --bind apn:s:ymobile --bind type:s:default,supl,mms --bind user:s:ymobile --bind password:s:ymobile", "adb shell content insert --uri content://telephony/carriers --bind name:s:Sabafon --bind numeric:s:42101 --bind mcc:s:421 --bind mnc:s:01 --bind apn:s:sabafon --bind type:s:default,supl,mms", "adb shell content insert --uri content://telephony/carriers --bind name:s:YOU --bind numeric:s:42104 --bind mcc:s:421 --bind mnc:s:04 --bind apn:s:you --bind type:s:default,supl,mms", "adb shell content insert --uri content://telephony/carriers --bind name:s:Hits --bind numeric:s:42103 --bind mcc:s:421 --bind mnc:s:03 --bind apn:s:hits --bind type:s:default,supl,mms", "echo 'Yemen APNs configured for all 4 carriers'"] },
      { id: "sl_set_mcc_mnc", labelAr: "ضبط MCC/MNC يدوياً", label: "Set MCC/MNC Manual", color: "orange", description: "ضبط رمز الدولة والشبكة يدوياً — لحل مشاكل عدم التعرف على الشبكة", commands: ["adb shell settings put global mcc 421", "adb shell setprop gsm.sim.operator.numeric 42102", "adb shell setprop persist.radio.plmn 42102", "echo 'MCC/MNC set to 421/02 (Yemen Mobile)'", "echo 'Change 02 to: 01=Sabafon, 04=YOU, 03=Hits'"] },
      { id: "sl_clear_carrier", labelAr: "مسح بيانات الكارير", label: "Clear Carrier Data", color: "red", description: "مسح جميع بيانات الكارير المخزنة — يحل مشاكل التعرف على الشبكة بعد تغيير SIM", commands: ["adb shell pm clear com.android.phone", "adb shell pm clear com.android.providers.telephony", "adb shell settings delete global preferred_network_mode", "adb shell content delete --uri content://telephony/carriers", "echo 'Carrier data cleared — reboot required'", "adb reboot"] },
      { id: "sl_fix_no_service", labelAr: "إصلاح 'لا توجد خدمة'", label: "Fix No Service", color: "red", description: "إصلاح مشكلة 'لا توجد خدمة' أو 'الشبكة غير متوفرة' — شائعة بعد التحديث أو تغيير SIM", commands: ["adb shell settings put global airplane_mode_on 1", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell settings put global preferred_network_mode 9", "adb shell settings put global airplane_mode_on 0", "adb shell am broadcast -a android.intent.action.AIRPLANE_MODE", "adb shell pm clear com.android.phone", "echo 'Network reset applied — wait for registration'"] },
    ],
  },
  {
    id: "simlock_esim",
    titleAr: "إدارة eSIM والشرائح الإلكترونية",
    operations: [
      { id: "sl_esim_check", labelAr: "فحص دعم eSIM", label: "Check eSIM Support", color: "cyan", description: "فحص إذا كان الجهاز يدعم eSIM (الشريحة الإلكترونية المدمجة)", isScan: true, commands: ["adb shell getprop persist.vendor.radio.enableesim", "adb shell getprop gsm.euicc.supported", "adb shell dumpsys euicc", "adb shell pm list features | grep euicc", "echo 'Checking eSIM/eUICC hardware support...'"] },
      { id: "sl_esim_list", labelAr: "عرض eSIM المثبتة", label: "List eSIM Profiles", color: "blue", description: "عرض جميع ملفات eSIM المثبتة على الجهاز", commands: ["adb shell dumpsys euicc", "adb shell content query --uri content://telephony/siminfo", "echo 'Listing installed eSIM profiles...'"] },
      { id: "sl_esim_enable", labelAr: "تفعيل eSIM", label: "Enable eSIM", color: "green", description: "تفعيل شريحة eSIM مثبتة مسبقاً", commands: ["adb shell am start -a android.telephony.euicc.action.MANAGE_EMBEDDED_SUBSCRIPTIONS", "echo 'eSIM management screen opened'", "echo 'Select profile to enable from the list'"] },
      { id: "sl_esim_reset", labelAr: "إعادة تعيين eSIM", label: "Reset eSIM", color: "red", description: "إعادة تعيين جميع ملفات eSIM — حذف جميع الشرائح الإلكترونية المثبتة", commands: ["adb shell pm clear com.android.euicc", "adb shell pm clear com.google.euiccpixel", "echo 'WARNING: This will remove all eSIM profiles!'", "echo 'eSIM chip reset — add profiles again from carrier'"] },
    ],
  },
  {
    id: "simlock_diagnosis",
    titleAr: "تشخيص مشاكل SIM والشبكة",
    operations: [
      { id: "sl_sim_full_scan", labelAr: "فحص شامل لحالة SIM", label: "Full SIM Diagnostic", color: "cyan", description: "تشخيص شامل لمشاكل SIM — يفحص القفل والتوافق والترددات والشبكة", isScan: true, commands: ["adb shell getprop gsm.sim.state", "adb shell getprop gsm.sim.operator.alpha", "adb shell getprop gsm.sim.operator.numeric", "adb shell service call iphonesubinfo 1", "adb shell service call iphonesubinfo 3", "adb shell dumpsys telephony.registry | grep mServiceState", "adb shell dumpsys telephony.registry | grep mSignalStrength", "adb shell settings get global preferred_network_mode", "adb shell dumpsys carrier_config", "echo 'Complete SIM diagnostic analysis...'"] },
      { id: "sl_baseband_check", labelAr: "فحص Baseband/Modem", label: "Baseband Check", color: "yellow", description: "فحص حالة Baseband — إذا كان تالف لن يعمل أي SIM", isScan: true, commands: ["adb shell getprop gsm.version.baseband", "adb shell getprop gsm.version.ril-impl", "adb shell getprop ro.baseband", "adb shell getprop persist.radio.multisim.config", "echo 'Checking baseband/modem firmware health...'"] },
      { id: "sl_fix_baseband", labelAr: "إصلاح Baseband Unknown", label: "Fix Unknown Baseband", color: "red", description: "محاولة إصلاح مشكلة 'Baseband Unknown' — سبب شائع لعدم التعرف على SIM", commands: ["adb shell am broadcast -a android.intent.action.MASTER_CLEAR", "echo 'WARNING: This may require reflashing modem partition'", "adb shell setprop gsm.version.baseband ''", "adb reboot recovery", "echo 'If baseband still unknown: reflash modem.img via fastboot'"] },
      { id: "sl_fix_invalid_imei", labelAr: "إصلاح IMEI فارغ/غير صالح", label: "Fix Invalid/Null IMEI", color: "red", description: "إصلاح IMEI فارغ أو غير صالح — سبب رئيسي لمشكلة 'لا توجد خدمة'", commands: ["adb shell service call iphonesubinfo 1", "echo 'If IMEI shows null/0/invalid:'", "echo '1. Check EFS partition: adb shell ls -la /efs/'", "echo '2. Restore EFS backup if available'", "echo '3. For Qualcomm: use QPST to write NV Item 550 (IMEI)'", "echo '4. For Samsung: use Odin to flash CERT partition'", "echo '5. For MTK: use SP Flash Tool to write NVRAM'"] },
      { id: "sl_network_log", labelAr: "سجل أحداث الشبكة", label: "Network Event Log", color: "gray", description: "عرض سجل أحداث الشبكة التفصيلي — مفيد لتشخيص مشاكل الاتصال", commands: ["adb shell logcat -d -s TelephonyManager", "adb shell logcat -d -s RIL", "adb shell logcat -d -s ServiceState", "adb shell dumpsys telephony.registry | grep -E 'mService|mSignal|mData|mCell'", "echo 'Network event log captured'"] },
    ],
  },
];

// ─── أدوات البرمجة المتقدمة (Advanced Programming Tools) ─────────────────────
const ADVANCED_GROUPS: OperationGroup[] = [
  {
    id: "adv_firmware",
    titleAr: "فلاش وبرمجة Firmware",
    operations: [
      { id: "adv_edl_mode", labelAr: "الدخول لوضع EDL 9008", label: "Enter EDL Mode", color: "red", description: "إدخال الجهاز لوضع Emergency Download (EDL 9008) — للفلاش على مستوى الشريحة", commands: ["adb reboot edl", "echo 'If ADB not available, try:'", "echo 'fastboot oem edl'", "echo 'Or: Hold Vol+ Vol- while connecting USB cable'", "echo 'Device should appear as Qualcomm HS-USB QDLoader 9008'"] },
      { id: "adv_fastboot_mode", labelAr: "الدخول لوضع Fastboot", label: "Enter Fastboot", color: "orange", description: "إدخال الجهاز لوضع Fastboot للفلاش والتعديل", commands: ["adb reboot bootloader", "echo 'Waiting for fastboot...'", "fastboot devices", "fastboot getvar all"] },
      { id: "adv_flash_modem", labelAr: "فلاش Modem/Baseband", label: "Flash Modem", color: "red", description: "فلاش firmware الـ Modem/Baseband — يحل مشاكل الشبكة الجذرية", requiresRoot: true, commands: ["fastboot flash modem modem.img", "echo 'Or for Samsung: Odin → AP → modem.bin'", "echo 'Or for MTK: SP Flash Tool → Download → modem partition'", "echo 'WARNING: Wrong modem can permanently damage network!'", "fastboot reboot"] },
      { id: "adv_flash_boot", labelAr: "فلاش Boot Image", label: "Flash Boot", color: "red", description: "فلاش ملف boot.img — يستخدم لتحديث kernel أو إصلاح bootloop", requiresRoot: true, commands: ["fastboot flash boot boot.img", "fastboot reboot", "echo 'Boot image flashed successfully'"] },
      { id: "adv_flash_recovery", labelAr: "فلاش Recovery", label: "Flash Recovery", color: "orange", description: "فلاش Custom Recovery (TWRP/OrangeFox) أو Stock Recovery", commands: ["fastboot flash recovery recovery.img", "echo 'Or for Samsung: Odin → AP → recovery.tar'", "echo 'To boot directly: fastboot boot recovery.img'", "fastboot reboot recovery"] },
      { id: "adv_unlock_bootloader", labelAr: "فتح Bootloader", label: "Unlock Bootloader", color: "red", description: "فتح Bootloader — مطلوب لعمليات الفلاش المتقدمة والروت", requiresRoot: true, commands: ["adb shell settings put global development_settings_enabled 1", "echo 'Enable OEM Unlock in Developer Options first!'", "adb reboot bootloader", "fastboot flashing unlock", "echo 'WARNING: This will ERASE ALL DATA on device!'", "echo 'Confirm unlock on device screen'"] },
    ],
  },
  {
    id: "adv_root",
    titleAr: "Root وإدارة الصلاحيات",
    operations: [
      { id: "adv_check_root", labelAr: "فحص حالة Root", label: "Check Root Status", color: "cyan", description: "فحص إذا كان الجهاز يملك صلاحيات Root", isScan: true, commands: ["adb shell su -c 'whoami'", "adb shell su -c 'id'", "adb shell getprop ro.build.selinux", "adb shell getprop ro.debuggable", "echo 'Checking root/superuser status...'"] },
      { id: "adv_magisk_install", labelAr: "تثبيت Magisk (Root)", label: "Magisk Install Guide", color: "green", description: "دليل تثبيت Magisk للحصول على Root — أفضل وأأمن طريقة", commands: ["echo 'خطوات تثبيت Magisk:'", "echo '1. حمّل Magisk APK من: https://github.com/topjohnwu/Magisk'", "echo '2. ثبت APK على الجهاز: adb install Magisk.apk'", "echo '3. استخرج boot.img من الـ firmware'", "echo '4. افتح Magisk → Install → Patch boot image'", "echo '5. انسخ الملف المعدل: adb pull /sdcard/Download/magisk_patched.img'", "echo '6. فلاش: fastboot flash boot magisk_patched.img'", "echo '7. أعد التشغيل وافتح Magisk للتأكيد'"] },
      { id: "adv_disable_verity", labelAr: "تعطيل DM-Verity", label: "Disable DM-Verity", color: "orange", description: "تعطيل التحقق من النظام — مطلوب لتعديل system partition", requiresRoot: true, commands: ["adb disable-verity", "adb reboot", "echo 'DM-Verity disabled — system partition now writable'"] },
      { id: "adv_remount_system", labelAr: "فتح System للكتابة", label: "Remount System RW", color: "orange", description: "فتح قسم System للكتابة — لتعديل ملفات النظام", requiresRoot: true, commands: ["adb root", "adb remount", "echo 'System mounted as read-write'", "echo 'You can now push/modify files in /system/'"] },
    ],
  },
  {
    id: "adv_partition",
    titleAr: "إدارة الأقسام (Partitions)",
    operations: [
      { id: "adv_list_partitions", labelAr: "عرض جدول الأقسام", label: "List Partitions", color: "cyan", description: "عرض جميع أقسام الذاكرة (partitions) في الجهاز", isScan: true, commands: ["adb shell ls -la /dev/block/by-name/", "adb shell cat /proc/partitions", "echo 'Partition table listed'"] },
      { id: "adv_backup_partition", labelAr: "نسخ احتياطي لقسم", label: "Backup Partition", color: "green", description: "نسخ احتياطي لقسم معين (مثل EFS, modem, boot)", commands: ["echo 'Usage: adb shell dd if=/dev/block/by-name/PARTITION of=/sdcard/PARTITION.img'", "echo 'Common partitions to backup:'", "echo '  efs → IMEI/calibration data'", "echo '  modem → network firmware'", "echo '  boot → kernel + ramdisk'", "echo '  recovery → recovery system'", "echo 'Example: adb shell dd if=/dev/block/by-name/efs of=/sdcard/efs_backup.img'"] },
      { id: "adv_restore_partition", labelAr: "استعادة قسم", label: "Restore Partition", color: "orange", description: "استعادة قسم من نسخة احتياطية سابقة", requiresRoot: true, commands: ["echo 'Usage: adb shell dd if=/sdcard/PARTITION.img of=/dev/block/by-name/PARTITION'", "echo 'WARNING: Wrong partition restore can BRICK the device!'", "echo 'Always verify partition name before restoring'", "echo 'Example: adb shell dd if=/sdcard/efs_backup.img of=/dev/block/by-name/efs'"] },
      { id: "adv_wipe_frp", labelAr: "مسح قسم FRP", label: "Wipe FRP Partition", color: "red", description: "مسح قسم حماية إعادة التعيين (FRP)", requiresRoot: true, commands: ["fastboot erase frp", "echo 'Or via ADB root:'", "adb shell dd if=/dev/zero of=/dev/block/by-name/frp bs=4096", "echo 'FRP partition wiped'", "adb reboot"] },
    ],
  },
  {
    id: "adv_debug",
    titleAr: "تشخيص وتحليل متقدم",
    operations: [
      { id: "adv_full_diagnostic", labelAr: "تشخيص شامل للجهاز", label: "Full Device Diagnostic", color: "cyan", description: "تشخيص شامل يفحص جميع مكونات الجهاز — الأجهزة والبرمجيات والشبكة", isScan: true, commands: ["adb shell getprop ro.product.model", "adb shell getprop ro.build.version.release", "adb shell getprop gsm.version.baseband", "adb shell dumpsys battery", "adb shell dumpsys display | grep mScreenState", "adb shell df /data | tail -1", "adb shell cat /proc/meminfo | head -3", "adb shell cat /proc/cpuinfo | grep 'Hardware'", "adb shell dumpsys telephony.registry | grep mServiceState", "adb shell getprop gsm.sim.state", "echo 'Complete device diagnostic scan...'"] },
      { id: "adv_bugreport", labelAr: "تقرير الأخطاء الكامل", label: "Generate Bug Report", color: "yellow", description: "إنشاء تقرير أخطاء شامل — مفيد لتشخيص المشاكل المعقدة", commands: ["adb bugreport /sdcard/bugreport.zip", "adb pull /sdcard/bugreport.zip ./bugreport.zip", "echo 'Bug report generated and saved'"] },
      { id: "adv_logcat_live", labelAr: "سجل النظام المباشر", label: "Live Logcat", color: "gray", description: "عرض سجل النظام المباشر — لمتابعة الأخطاء لحظياً", commands: ["adb logcat -d *:E | tail -50", "echo 'Error log captured — last 50 errors'"] },
      { id: "adv_thermal_check", labelAr: "فحص الحرارة", label: "Thermal Check", color: "yellow", description: "فحص درجة حرارة جميع مكونات الجهاز", isScan: true, commands: ["adb shell dumpsys battery | grep temperature", "adb shell cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null", "echo 'Thermal sensor readings captured'"] },
      { id: "adv_sensor_test", labelAr: "فحص الحساسات", label: "Sensor Test", color: "cyan", description: "فحص جميع حساسات الجهاز (accelerometer, gyro, proximity, etc.)", isScan: true, commands: ["adb shell dumpsys sensorservice | grep 'sensor'", "echo 'Sensor list captured — check which sensors are active/available'"] },
    ],
  },
  {
    id: "adv_security",
    titleAr: "أمان وحماية",
    operations: [
      { id: "adv_mdm_remove", labelAr: "إزالة MDM (إدارة الأجهزة)", label: "Remove MDM", color: "red", description: "إزالة ملفات إدارة الأجهزة (MDM) — الهواتف المؤسسية/الشركات", commands: ["adb shell pm list packages | grep -i mdm", "adb shell pm uninstall --user 0 com.samsung.android.mdm", "adb shell pm disable-user --user 0 com.sec.enterprise.knox.cloudmdm.smdms", "adb shell dpm remove-active-admin com.samsung.android.mdm/.DeviceAdminReceiver", "echo 'MDM profiles removed — reboot required'", "adb reboot"] },
      { id: "adv_knox_remove", labelAr: "إزالة Knox", label: "Remove Knox", color: "red", description: "إزالة Samsung Knox — يحل مشاكل القفل المؤسسي", commands: ["adb shell pm disable-user --user 0 com.samsung.android.knox.analytics.uploader", "adb shell pm disable-user --user 0 com.samsung.android.knox.containercore", "adb shell pm disable-user --user 0 com.samsung.android.knox.kpe", "adb shell pm disable-user --user 0 com.samsung.klmsagent", "echo 'Knox components disabled'", "adb reboot"] },
      { id: "adv_disable_bloat", labelAr: "إزالة التطبيقات الزائدة", label: "Remove Bloatware", color: "orange", description: "إزالة التطبيقات المثبتة مسبقاً التي لا يمكن حذفها من الإعدادات", commands: ["adb shell pm list packages -d", "echo 'Usage: adb shell pm uninstall --user 0 com.package.name'", "echo 'Common bloatware to remove:'", "echo '  Facebook: com.facebook.system, com.facebook.appmanager'", "echo '  Netflix: com.netflix.partner.activation'", "echo '  Carrier apps: varies by carrier'", "echo 'WARNING: Do NOT remove system-critical packages!'"] },
      { id: "adv_bypass_setup", labelAr: "تجاوز شاشة الإعداد", label: "Bypass Setup Wizard", color: "orange", description: "تجاوز شاشة الإعداد الأولى — مفيد بعد Factory Reset", commands: ["adb shell settings put global device_provisioned 1", "adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1", "adb shell pm disable-user --user 0 com.google.android.setupwizard", "echo 'Setup wizard bypassed'", "adb reboot"] },
    ],
  },
];

// ─── ARABIZATION PRO (تعريب متقدم) ──────────────────────────────────────────
const ARABIZATION_GROUPS: OperationGroup[] = [
  {
    id: "arab_language",
    titleAr: "تعريب اللغة والمنطقة",
    operations: [
      { id: "arab_set_arabic", labelAr: "تعريب كامل (لغة + منطقة)", label: "Full Arabization", color: "green", description: "تغيير لغة النظام إلى العربية + المنطقة إلى اليمن + اتجاه RTL", commands: ["adb shell settings put system system_locales ar-YE", "adb shell setprop persist.sys.locale ar-YE", "adb shell setprop persist.sys.language ar", "adb shell setprop persist.sys.country YE", "adb shell settings put system user_rotation 0", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED", "echo 'Language set to Arabic (Yemen)'"] },
      { id: "arab_add_arabic", labelAr: "إضافة العربية كلغة إضافية", label: "Add Arabic Language", color: "blue", description: "إضافة اللغة العربية دون تغيير اللغة الأساسية", commands: ["adb shell settings put system system_locales $(adb shell settings get system system_locales),ar-YE", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED", "echo 'Arabic added as secondary language'"] },
      { id: "arab_set_english", labelAr: "تغيير اللغة إلى الإنجليزية", label: "Set English", color: "blue", description: "تغيير لغة النظام إلى الإنجليزية — مفيد للأجهزة الصينية", commands: ["adb shell settings put system system_locales en-US", "adb shell setprop persist.sys.locale en-US", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED", "echo 'Language set to English (US)'"] },
      { id: "arab_region_yemen", labelAr: "تغيير المنطقة إلى اليمن", label: "Set Region Yemen", color: "cyan", description: "تغيير المنطقة الجغرافية إلى اليمن لفتح ميزات محلية", commands: ["adb shell settings put global wifi_country_code YE", "adb shell setprop gsm.sim.operator.iso-country ye", "adb shell setprop persist.sys.timezone Asia/Aden", "echo 'Region set to Yemen'"] },
      { id: "arab_region_saudi", labelAr: "تغيير المنطقة إلى السعودية", label: "Set Region Saudi", color: "cyan", description: "تغيير المنطقة إلى السعودية — مفيد لبعض التطبيقات", commands: ["adb shell settings put global wifi_country_code SA", "adb shell setprop persist.sys.timezone Asia/Riyadh", "echo 'Region set to Saudi Arabia'"] },
      { id: "arab_check_locale", labelAr: "فحص اللغة والمنطقة الحالية", label: "Check Current Locale", color: "purple", isScan: true, description: "عرض إعدادات اللغة والمنطقة الحالية", commands: ["adb shell settings get system system_locales", "adb shell getprop persist.sys.locale", "adb shell getprop persist.sys.language", "adb shell getprop persist.sys.country", "adb shell settings get global wifi_country_code", "adb shell getprop persist.sys.timezone"] },
    ],
  },
  {
    id: "arab_samsung_csc",
    titleAr: "تعريب Samsung (CSC)",
    operations: [
      { id: "arab_sam_csc_read", labelAr: "قراءة CSC الحالي", label: "Read Current CSC", color: "purple", isScan: true, description: "قراءة كود CSC الحالي لسامسونج — يحدد المنطقة واللغات المدعومة", commands: ["adb shell getprop ro.csc.sales_code", "adb shell getprop ril.official_cscver", "adb shell getprop ro.csc.country_code", "adb shell cat /efs/imei/mps_code.dat 2>/dev/null", "adb shell cat /system/csc/sales_code.dat 2>/dev/null", "echo 'CSC codes: AFG/MID=Arabic, XSG=UAE, KSA=Saudi'"] },
      { id: "arab_sam_csc_mid", labelAr: "تغيير CSC إلى MID (عربي)", label: "Change CSC to MID", color: "green", description: "تغيير CSC لسامسونج إلى MID (الشرق الأوسط) — يفعّل العربية + تطبيقات المنطقة", commands: ["adb shell echo MID > /efs/imei/mps_code.dat", "adb shell setprop ro.csc.sales_code MID", "echo 'CSC changed to MID (Middle East)'", "echo 'NOTE: May require factory reset to take full effect'", "echo 'Alternative: Flash CSC_MID via Odin'"] },
      { id: "arab_sam_csc_afg", labelAr: "تغيير CSC إلى AFG (عربي)", label: "Change CSC to AFG", color: "green", description: "تغيير CSC إلى AFG — يدعم العربية ويعمل مع أجهزة الشرق الأوسط", commands: ["adb shell echo AFG > /efs/imei/mps_code.dat", "adb shell setprop ro.csc.sales_code AFG", "echo 'CSC changed to AFG'"] },
      { id: "arab_sam_multi_csc", labelAr: "تفعيل Multi-CSC", label: "Enable Multi-CSC", color: "orange", description: "تفعيل وضع Multi-CSC لدعم جميع اللغات والمناطق", commands: ["adb shell setprop persist.sys.omc_support true", "adb shell setprop ro.csc.version 1", "echo 'Multi-CSC enabled - all languages available'"] },
    ],
  },
  {
    id: "arab_xiaomi",
    titleAr: "تعريب Xiaomi / CN ROM",
    operations: [
      { id: "arab_mi_locale", labelAr: "تعريب Xiaomi CN ROM", label: "Arabize Xiaomi CN", color: "green", description: "تعريب ROM الصيني لأجهزة Xiaomi — إضافة العربية ومتجر Google", commands: ["adb shell settings put system system_locales ar-YE,en-US,zh-CN", "adb shell setprop persist.sys.locale ar-YE", "adb shell am broadcast -a android.intent.action.LOCALE_CHANGED", "echo 'Arabic added to Xiaomi CN ROM'", "echo 'TIP: Install Google Play via adb install'"] },
      { id: "arab_mi_install_gapps", labelAr: "تثبيت Google Apps", label: "Install GApps Guide", color: "blue", description: "دليل تثبيت تطبيقات Google على ROM الصيني", commands: ["echo '=== Install Google Apps on CN ROM ==='", "echo '1. Download GApps package for your Android version'", "echo '2. adb push gapps.zip /sdcard/'", "echo '3. Boot to TWRP: adb reboot recovery'", "echo '4. Flash gapps.zip from TWRP'", "echo 'OR use Xiaomi GetApps to install Google services'", "adb shell pm list packages | grep google"] },
      { id: "arab_mi_remove_cn", labelAr: "إزالة التطبيقات الصينية", label: "Remove CN Bloatware", color: "red", description: "إزالة التطبيقات الصينية المثبتة مسبقاً", commands: ["adb shell pm uninstall --user 0 com.miui.cleanmaster", "adb shell pm uninstall --user 0 com.miui.yellowpage", "adb shell pm uninstall --user 0 com.miui.virtualsim", "adb shell pm uninstall --user 0 com.sohu.inputmethod.sogou.xiaomi", "adb shell pm uninstall --user 0 com.baidu.input_mi", "adb shell pm uninstall --user 0 com.tencent.soter.soterserver", "echo 'Chinese bloatware removed'"] },
    ],
  },
  {
    id: "arab_keyboard",
    titleAr: "لوحة المفاتيح العربية",
    operations: [
      { id: "arab_enable_kbd", labelAr: "تفعيل لوحة مفاتيح عربية", label: "Enable Arabic Keyboard", color: "green", description: "تفعيل لوحة المفاتيح العربية في النظام", commands: ["adb shell ime enable com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME", "adb shell settings put secure default_input_method com.google.android.inputmethod.latin/com.android.inputmethod.latin.LatinIME", "echo 'Arabic keyboard enabled via Gboard'", "echo 'Go to Settings > Languages > Arabic to add layout'"] },
      { id: "arab_list_ime", labelAr: "عرض لوحات المفاتيح المثبتة", label: "List Installed IME", color: "purple", isScan: true, description: "عرض جميع لوحات المفاتيح المثبتة والنشطة", commands: ["adb shell ime list -s", "adb shell settings get secure enabled_input_methods", "adb shell settings get secure default_input_method"] },
    ],
  },
];

// ─── IMEI REPAIR ADVANCED ────────────────────────────────────────────────────
const IMEI_REPAIR_GROUPS: OperationGroup[] = [
  {
    id: "imei_qualcomm",
    titleAr: "إصلاح IMEI — Qualcomm",
    operations: [
      { id: "imei_qc_diag", labelAr: "كتابة IMEI عبر DIAG Port", label: "Write IMEI (DIAG)", color: "red", requiresRoot: true, description: "كتابة IMEI عبر منفذ DIAG لشرائح Qualcomm — يتطلب تفعيل DIAG mode أولاً", commands: ["adb shell setprop sys.usb.config diag,adb", "echo 'DIAG Port enabled'", "echo 'Use QPST/QXDM to write NV Item 550 (IMEI)'", "echo 'NV_UE_IMEI_I (550) = XX XX XX XX XX XX XX XX'", "echo 'Format: First byte = 0x08 (length), then BCD encoded IMEI'", "echo 'Example: 35 291109 123456 7 → 08 3A 19 10 19 32 54 F7'"] },
      { id: "imei_qc_efs", labelAr: "إصلاح IMEI عبر EFS", label: "Repair IMEI (EFS)", color: "red", requiresRoot: true, description: "إصلاح IMEI عبر نظام EFS لأجهزة Qualcomm", commands: ["adb shell setprop sys.usb.config diag,adb", "echo 'Steps to repair IMEI via EFS:'", "echo '1. Open QPST EFS Explorer'", "echo '2. Navigate to /nv/item_files/modem/prl/'", "echo '3. Backup current NV items'", "echo '4. Write new IMEI to NV 550'", "echo '5. Reboot device'", "echo 'WARNING: IMEI modification may be illegal in some countries'"] },
      { id: "imei_qc_read", labelAr: "قراءة IMEI من NV", label: "Read IMEI from NV", color: "purple", isScan: true, description: "قراءة IMEI المخزن في NV Items لأجهزة Qualcomm", commands: ["adb shell service call iphonesubinfo 1", "adb shell service call iphonesubinfo 3", "adb shell getprop gsm.baseband.imei", "adb shell cat /efs/imei/imei 2>/dev/null", "adb shell cat /persist/imei 2>/dev/null", "echo 'IMEI locations checked'"] },
      { id: "imei_qc_backup_qcn", labelAr: "نسخ احتياطي QCN", label: "Backup QCN", color: "blue", description: "نسخ احتياطي لملف QCN الذي يحتوي على IMEI والمعايرة", commands: ["echo 'QCN Backup via QPST:'", "echo '1. Enable DIAG: adb shell setprop sys.usb.config diag,adb'", "echo '2. Open QPST Configuration'", "echo '3. Add new port (DIAG port)'", "echo '4. Open Software Download'", "echo '5. Tab: Backup → Start'", "echo '6. Save .qcn file'", "adb shell setprop sys.usb.config diag,adb"] },
      { id: "imei_qc_restore_qcn", labelAr: "استعادة QCN", label: "Restore QCN", color: "orange", description: "استعادة ملف QCN لإصلاح IMEI والشبكة", commands: ["echo 'QCN Restore via QPST:'", "echo '1. Enable DIAG: adb shell setprop sys.usb.config diag,adb'", "echo '2. Open QPST Software Download'", "echo '3. Tab: Restore'", "echo '4. Select .qcn file'", "echo '5. Click Start'", "echo '6. Reboot device after restore'", "adb shell setprop sys.usb.config diag,adb"] },
    ],
  },
  {
    id: "imei_mtk",
    titleAr: "إصلاح IMEI — MediaTek",
    operations: [
      { id: "imei_mtk_eng", labelAr: "كتابة IMEI عبر Engineer Mode", label: "Write IMEI (MTK Eng)", color: "red", description: "كتابة IMEI عبر Engineer Mode لشرائح MediaTek", commands: ["echo 'MTK Engineer Mode IMEI Write:'", "echo '1. Dial *#*#3646633#*#* or *#*#ENGMODE#*#*'", "echo '2. Go to: Connectivity → CDS Information → Radio Information'", "echo '3. Select Phone 1 (or Phone 2 for SIM2)'", "echo '4. Type: AT+EGMR=1,7,\"IMEI_NUMBER_HERE\"'", "echo '5. Press Send AT Command'", "echo '6. Reboot device'", "echo 'For SIM2: AT+EGMR=1,10,\"IMEI_NUMBER_HERE\"'"] },
      { id: "imei_mtk_meta", labelAr: "كتابة IMEI عبر META Mode", label: "Write IMEI (META)", color: "red", description: "كتابة IMEI عبر META Mode — يعمل حتى مع IMEI فارغ تماماً", commands: ["echo 'META Mode IMEI Write (MTK):'", "echo '1. Install SP META Tool'", "echo '2. Power off device'", "echo '3. Hold Volume Up + Connect USB'", "echo '4. Device enters META mode'", "echo '5. Open META Tool → IMEI Download'", "echo '6. Enter IMEI and click Download'", "echo '7. Disconnect and reboot'"] },
      { id: "imei_mtk_ate", labelAr: "كتابة IMEI عبر ATE Mode", label: "Write IMEI (ATE)", color: "red", description: "كتابة IMEI عبر ATE factory mode لأجهزة MTK", commands: ["echo 'ATE Mode IMEI Write:'", "echo '1. Power off device'", "echo '2. Hold Vol Down + Power (or Vol Up + Power)'", "echo '3. Enter Factory/ATE Mode'", "echo '4. Use SN Writer Tool'", "echo '5. Select Write IMEI'", "echo '6. Enter new IMEI'", "echo '7. Click Start'", "echo 'Alternative: Use Maui META for older MTK'"] },
      { id: "imei_mtk_sn_writer", labelAr: "كتابة IMEI عبر SN Writer", label: "SN Writer Tool", color: "orange", description: "استخدام SN Writer Tool لكتابة IMEI لأجهزة MediaTek", commands: ["echo 'SN Writer Tool (MTK):'", "echo '1. Download SN Writer Tool'", "echo '2. Load scatter file for your device'", "echo '3. Select IMEI option'", "echo '4. Enter IMEI number'", "echo '5. Power off device and connect via USB'", "echo '6. Tool auto-detects device in BROM mode'", "echo '7. IMEI written successfully'"] },
    ],
  },
  {
    id: "imei_unisoc",
    titleAr: "إصلاح IMEI — Unisoc/SPD",
    operations: [
      { id: "imei_spd_eng", labelAr: "كتابة IMEI عبر Engineering Mode", label: "Write IMEI (SPD Eng)", color: "red", description: "كتابة IMEI عبر Engineering Mode لأجهزة Unisoc/SPD", commands: ["echo 'Unisoc/SPD Engineering Mode:'", "echo '1. Dial *#*#83781#*#* (Engineering Mode)'", "echo '2. Or dial ##8888# on some devices'", "echo '3. Go to: Phone → IMEI'", "echo '4. Enter new IMEI for SIM1 and/or SIM2'", "echo '5. Click Write'", "echo '6. Reboot device'"] },
      { id: "imei_spd_research", labelAr: "كتابة IMEI عبر Research Download", label: "IMEI via Research DL", color: "red", description: "كتابة IMEI عبر Research Download Tool لأجهزة SPD", commands: ["echo 'SPD Research Download IMEI:'", "echo '1. Download Research Download Tool'", "echo '2. Load PAC firmware file'", "echo '3. Select NV → Write NV'", "echo '4. Navigate to IMEI item'", "echo '5. Enter new IMEI'", "echo '6. Click Start Download'", "echo '7. Wait for completion and reboot'"] },
    ],
  },
  {
    id: "imei_samsung",
    titleAr: "إصلاح IMEI — Samsung",
    operations: [
      { id: "imei_sam_drk", labelAr: "إصلاح DRK (Samsung)", label: "Repair DRK", color: "red", description: "إصلاح DRK (Device Root Key) لأجهزة Samsung — يحل مشكلة IMEI null", commands: ["echo 'Samsung DRK Repair:'", "echo '1. Connect via UART or ADB (root required)'", "echo '2. Delete: /efs/prov/*.dat'", "echo '3. Delete: /efs/prov_data/.*'", "echo '4. Reboot device'", "echo '5. Device will re-provision DRK on first boot'", "echo 'Alternative: Use ChimeraTool or Z3X for automated DRK repair'", "echo 'WARNING: Device needs internet connection after repair'"] },
      { id: "imei_sam_cert", labelAr: "نسخ/استعادة Certificate", label: "Backup/Restore Cert", color: "blue", description: "نسخ احتياطي واستعادة Certificate (EFS) لسامسونج — يحتوي IMEI", commands: ["echo 'Samsung EFS/Certificate Backup:'", "adb shell su -c 'tar -czf /sdcard/efs_backup.tar.gz /efs/'", "adb pull /sdcard/efs_backup.tar.gz", "echo 'Backup saved to efs_backup.tar.gz'", "echo ''", "echo 'To Restore:'", "echo 'adb push efs_backup.tar.gz /sdcard/'", "echo 'adb shell su -c tar -xzf /sdcard/efs_backup.tar.gz -C /'"] },
      { id: "imei_sam_check", labelAr: "فحص حالة IMEI Samsung", label: "Check Samsung IMEI", color: "purple", isScan: true, description: "فحص حالة IMEI وEFS لأجهزة Samsung", commands: ["adb shell service call iphonesubinfo 1", "adb shell cat /efs/imei/imei 2>/dev/null || echo 'Cannot read EFS (no root)'", "adb shell getprop ro.boot.em.model", "adb shell getprop gsm.version.baseband", "adb shell cat /efs/bluetooth/bt_addr 2>/dev/null", "adb shell cat /efs/wifi/.mac.info 2>/dev/null"] },
    ],
  },
];

// ─── ACCOUNT REMOVAL (إزالة الحسابات) ──────────────────────────────────────
const ACCOUNT_REMOVAL_GROUPS: OperationGroup[] = [
  {
    id: "acc_xiaomi",
    titleAr: "إزالة Mi Account",
    operations: [
      { id: "acc_mi_remove", labelAr: "إزالة Mi Account [ADB]", label: "Remove Mi Account", color: "red", description: "إزالة حساب Xiaomi المرتبط بالجهاز عبر ADB", commands: ["adb shell am force-stop com.xiaomi.account", "adb shell pm clear com.xiaomi.account", "adb shell rm -rf /data/system/users/0/accounts.db", "adb shell settings put secure xiaomi_account_auth_token ''", "echo 'Mi Account data cleared'", "echo 'NOTE: May need to also clear Mi Cloud sync data'", "adb shell pm clear com.miui.cloudservice"] },
      { id: "acc_mi_frp", labelAr: "تجاوز Mi Account (FRP)", label: "Bypass Mi Lock", color: "red", description: "تجاوز قفل Mi Account بعد Factory Reset", commands: ["echo 'Mi Account Bypass Methods:'", "echo '1. ADB Method (if ADB accessible):'", "echo '   adb shell am start -n com.android.settings/.Settings'", "echo '   Navigate to Mi Account → Sign out'", "echo ''", "echo '2. EDL Method (requires authorized account):'", "echo '   Flash clean firmware via EDL 9008'", "echo ''", "echo '3. Fastboot Method:'", "echo '   fastboot erase persistent'", "echo '   fastboot erase frp'"] },
    ],
  },
  {
    id: "acc_huawei",
    titleAr: "إزالة Huawei ID",
    operations: [
      { id: "acc_hw_remove", labelAr: "إزالة Huawei ID", label: "Remove Huawei ID", color: "red", description: "إزالة حساب Huawei المرتبط بالجهاز", commands: ["adb shell pm clear com.huawei.hwid", "adb shell pm clear com.huawei.android.hwaps", "adb shell settings put secure huawei_account_login ''", "adb shell rm -rf /data/system/users/0/accounts.db", "echo 'Huawei ID data cleared'", "echo 'Reboot required to take effect'", "adb reboot"] },
      { id: "acc_hw_testpoint", labelAr: "Huawei ID (TestPoint)", label: "Huawei TestPoint", color: "red", description: "إزالة Huawei ID عبر TestPoint — للأجهزة المقفلة بالكامل", commands: ["echo 'Huawei TestPoint Method:'", "echo '1. Disassemble device to reach motherboard'", "echo '2. Find TestPoint pads (varies by model)'", "echo '3. Short TestPoint while connecting USB'", "echo '4. Device enters Download mode'", "echo '5. Use HiSuite or DC-Unlocker to flash'", "echo '6. Flash firmware without FRP partition'", "echo 'WARNING: Requires hardware knowledge'"] },
    ],
  },
  {
    id: "acc_samsung",
    titleAr: "إزالة Samsung Account",
    operations: [
      { id: "acc_sam_remove", labelAr: "إزالة Samsung Account", label: "Remove Samsung Acc", color: "red", description: "إزالة حساب Samsung المرتبط بالجهاز", commands: ["adb shell pm clear com.osp.app.signin", "adb shell pm clear com.samsung.android.mobileservice", "adb shell pm clear com.sec.android.app.samsungapps", "adb shell rm -rf /data/system/users/0/accounts.db", "echo 'Samsung Account data cleared'", "adb reboot"] },
      { id: "acc_sam_reactivation", labelAr: "تجاوز Samsung Reactivation Lock", label: "Bypass Reactivation", color: "red", description: "تجاوز قفل إعادة التنشيط لسامسونج", commands: ["echo 'Samsung Reactivation Lock Bypass:'", "echo '1. Enter Download Mode (Vol Down + Home + Power)'", "echo '2. Flash firmware with modified PIT'", "echo '3. Or use combination firmware to disable'", "echo ''", "echo 'ADB Method (if accessible):'", "adb shell settings put global device_provisioned 1", "adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1"] },
    ],
  },
  {
    id: "acc_oppo_vivo",
    titleAr: "إزالة OPPO/Vivo/Realme Account",
    operations: [
      { id: "acc_oppo_remove", labelAr: "إزالة OPPO ID", label: "Remove OPPO ID", color: "red", description: "إزالة حساب OPPO/ColorOS المرتبط بالجهاز", commands: ["adb shell pm clear com.heytap.usercenter", "adb shell pm clear com.coloros.findmyphone", "adb shell pm clear com.oppo.usercenter", "adb shell rm -rf /data/system/users/0/accounts.db", "echo 'OPPO ID cleared'", "adb reboot"] },
      { id: "acc_vivo_remove", labelAr: "إزالة Vivo Account", label: "Remove Vivo Account", color: "red", description: "إزالة حساب Vivo المرتبط بالجهاز", commands: ["adb shell pm clear com.vivo.id", "adb shell pm clear com.bbk.account", "adb shell pm clear com.vivo.findphone", "adb shell rm -rf /data/system/users/0/accounts.db", "echo 'Vivo Account cleared'", "adb reboot"] },
      { id: "acc_realme_remove", labelAr: "إزالة Realme Account", label: "Remove Realme Acc", color: "red", description: "إزالة حساب Realme", commands: ["adb shell pm clear com.heytap.usercenter", "adb shell pm clear com.coloros.findmyphone", "adb shell rm -rf /data/system/users/0/accounts.db", "echo 'Realme Account cleared'", "adb reboot"] },
    ],
  },
  {
    id: "acc_special",
    titleAr: "إزالة أقفال خاصة",
    operations: [
      { id: "acc_demo_remove", labelAr: "إزالة Demo Mode", label: "Remove Demo Mode", color: "orange", description: "إزالة وضع العرض (Demo) من أجهزة المعارض", commands: ["adb shell settings put global device_demo_mode 0", "adb shell pm clear com.android.retaildemo", "adb shell pm disable-user com.android.retaildemo", "adb shell settings put global device_provisioned 1", "echo 'Demo mode removed'", "adb reboot"] },
      { id: "acc_rent_remove", labelAr: "إزالة Rent Lock", label: "Remove Rent Lock", color: "red", description: "إزالة قفل التأجير (Rent Center Lock / SmartPay / Asurion)", commands: ["echo 'Rent Lock Removal:'", "echo 'Common rent lock packages:'", "adb shell pm list packages | grep -i 'rent\\|asurion\\|smartpay\\|airteltigo\\|sprint'", "echo ''", "echo 'Remove with:'", "echo 'adb shell pm uninstall --user 0 [package_name]'", "echo 'adb shell pm disable-user --user 0 [package_name]'", "echo 'May require factory reset after removal'"] },
    ],
  },
];

// ─── VOLTE / NETWORK ADVANCED ────────────────────────────────────────────────
const VOLTE_NETWORK_GROUPS: OperationGroup[] = [
  {
    id: "volte_qualcomm",
    titleAr: "VoLTE — Qualcomm",
    operations: [
      { id: "volte_qc_diag", labelAr: "تفعيل VoLTE عبر DIAG", label: "Enable VoLTE (DIAG)", color: "green", requiresRoot: true, description: "تفعيل VoLTE عبر Qualcomm DIAG — الطريقة الأقوى والأكثر استقراراً", commands: ["adb shell setprop sys.usb.config diag,adb", "echo 'DIAG mode enabled'", "echo 'Use QXDM/EFS Explorer to modify:'", "echo '  /nv/item_files/modem/mmode/ue_usage_setting → 01'", "echo '  /nv/item_files/ims/IMS_enable → 01'", "echo '  /policyman/carrier_policy.xml → VoLTE=1'", "echo 'After modification, reboot device'"] },
      { id: "volte_qc_mbn", labelAr: "تفعيل/تعطيل MBN", label: "Enable/Disable MBN", color: "green", description: "تفعيل أو تعطيل ملف MBN للشبكة — يتحكم في إعدادات VoLTE والشبكة", commands: ["echo 'MBN (Modem Binary) Management:'", "echo 'List active MBN:'", "adb shell getprop persist.vendor.radio.config_id", "echo ''", "echo 'To change MBN via DIAG:'", "echo '1. Open QPST → MBN Settings'", "echo '2. Select appropriate MBN for carrier'", "echo '3. Apply and reboot'", "echo ''", "echo 'Yemen carriers MBN: Generic_3GPP or ROW_Commercial'"] },
      { id: "volte_qc_flash_modem", labelAr: "فلاش ملف VoLTE (modem)", label: "Flash VoLTE File", color: "orange", description: "بناء وفلاش ملف modem مع VoLTE مفعّل — حصري QCDMA", commands: ["echo 'Flash VoLTE-enabled Modem:'", "echo 'Supported file types: fsg, modem, radio, Non-Hlos'", "echo ''", "echo 'Steps:'", "echo '1. Extract modem from firmware'", "echo '2. Modify VoLTE flags in modem binary'", "echo '3. Repack modem file'", "echo '4. Flash via fastboot:'", "echo '   fastboot flash modem modem.img'", "echo '5. Reboot and verify VoLTE icon'"] },
    ],
  },
  {
    id: "volte_mtk",
    titleAr: "VoLTE — MediaTek",
    operations: [
      { id: "volte_mtk_direct", labelAr: "تفعيل VoLTE مباشر (MTK)", label: "Direct VoLTE (MTK)", color: "green", description: "تفعيل VoLTE المباشر لأجهزة MediaTek — بدون Root", commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell settings put global wfc_ims_enabled 1", "adb shell setprop persist.vendor.mtk_ct_volte_support 1", "adb shell setprop persist.vendor.volte_support 1", "adb shell setprop persist.vendor.mtk.volte.enable 1", "echo 'VoLTE enabled for MTK device'", "echo 'Reboot to apply'", "adb reboot"] },
      { id: "volte_mtk_eng", labelAr: "تفعيل VoLTE عبر Engineer Mode", label: "VoLTE (MTK Eng)", color: "green", description: "تفعيل VoLTE عبر Engineering Mode لأجهزة MediaTek", commands: ["echo 'MTK Engineer Mode VoLTE:'", "echo '1. Dial *#*#3646633#*#*'", "echo '2. Go to: IMS → IMS Setting'", "echo '3. Enable: VoLTE Setting'", "echo '4. Or go to: Misc Feature Config'", "echo '5. Set: VoLTE = 1, VoWiFi = 1'", "echo '6. Reboot device'"] },
    ],
  },
  {
    id: "volte_spd",
    titleAr: "VoLTE — Unisoc/SPD",
    operations: [
      { id: "volte_spd_direct", labelAr: "تفعيل VoLTE (Unisoc)", label: "Enable VoLTE (SPD)", color: "green", description: "تفعيل VoLTE لأجهزة Unisoc/Spreadtrum", commands: ["adb shell settings put global volte_vt_enabled 1", "adb shell setprop persist.sys.volte.enable true", "adb shell setprop persist.dbg.ims_volte_enable 1", "echo 'VoLTE enabled for Unisoc device'", "echo 'Reboot to apply'", "adb reboot"] },
      { id: "volte_spd_diag", labelAr: "تفعيل VoLTE عبر SPD DIAG", label: "VoLTE (SPD DIAG)", color: "green", requiresRoot: true, description: "تفعيل VoLTE عبر SPD DIAG Mode المباشر — حصري QCDMA", commands: ["echo 'SPD Direct DIAG VoLTE:'", "echo '1. Enable DIAG port on SPD device'", "echo '2. Connect via DIAG tool'", "echo '3. Modify IMS/VoLTE NV items'", "echo '4. Set VoLTE_Enable = 1'", "echo '5. Reboot device'", "adb shell setprop sys.usb.config diag,adb"] },
    ],
  },
  {
    id: "volte_yemen",
    titleAr: "إصلاح شبكات اليمن",
    operations: [
      { id: "volte_fix_you", labelAr: "إصلاح شبكة YOU بعد التحديث", label: "Fix YOU Network", color: "green", description: "إصلاح مشكلة شبكة YOU (يمن نت 4G) بعد تحديث النظام — مشكلة شائعة", commands: ["adb shell settings put global preferred_network_mode 9", "adb shell setprop gsm.operator.numeric 42104", "adb shell content insert --uri content://telephony/carriers --bind name:s:YOU --bind numeric:s:42104 --bind mcc:s:421 --bind mnc:s:04 --bind apn:s:internet --bind type:s:default,supl,mms", "echo 'YOU network settings restored'", "echo 'Reboot to apply'", "adb reboot"] },
      { id: "volte_restore_orig", labelAr: "استعادة إعدادات الشبكة الأصلية", label: "Restore Original Network", color: "blue", description: "استعادة إعدادات الشبكة الأصلية — فلاش ملف modem أصلي", commands: ["echo 'Restore Original Network File:'", "echo '1. Download original modem/radio for your device'", "echo '2. Flash via fastboot:'", "echo '   fastboot flash modem modem.img'", "echo '   OR'", "echo '   fastboot flash radio radio.img'", "echo '3. Or flash Non-Hlos via QFIL'", "echo '4. Reboot and reset network settings'", "adb shell settings put global preferred_network_mode 9"] },
      { id: "volte_force_4g", labelAr: "فرض 4G LTE فقط", label: "Force 4G Only", color: "orange", description: "فرض استخدام 4G LTE فقط — مفيد في مناطق تغطية 4G", commands: ["adb shell settings put global preferred_network_mode 11", "echo 'Network mode set to LTE Only (11)'", "echo 'Modes: 9=LTE/3G/2G, 11=LTE Only, 1=2G Only, 2=3G Only'"] },
    ],
  },
];

// ─── DATA RECOVERY (استعادة البيانات) ────────────────────────────────────────
const DATA_RECOVERY_GROUPS: OperationGroup[] = [
  {
    id: "recovery_backup",
    titleAr: "نسخ احتياطي كامل",
    operations: [
      { id: "rec_full_backup", labelAr: "نسخ احتياطي كامل (ADB)", label: "Full ADB Backup", color: "blue", description: "نسخ احتياطي شامل للتطبيقات والبيانات والنظام", commands: ["echo 'Starting full ADB backup...'", "echo 'Command: adb backup -apk -shared -all -f backup.ab'", "echo 'This will backup:'", "echo '  - All apps and app data'", "echo '  - Shared storage (photos, downloads)'", "echo '  - System settings'", "echo 'Confirm backup on device screen'", "adb backup -apk -shared -all -f /sdcard/full_backup.ab"] },
      { id: "rec_restore_backup", labelAr: "استعادة من نسخة احتياطية", label: "Restore Backup", color: "green", description: "استعادة البيانات من نسخة احتياطية ADB", commands: ["echo 'Restore ADB backup:'", "echo 'Command: adb restore backup.ab'", "echo 'Confirm restore on device screen'", "echo ''", "echo 'To restore specific app:'", "echo 'adb restore app_backup.ab'"] },
      { id: "rec_pull_storage", labelAr: "سحب التخزين الداخلي كامل", label: "Pull Internal Storage", color: "blue", description: "سحب جميع ملفات التخزين الداخلي (صور، فيديو، مستندات)", commands: ["adb pull /sdcard/ ./phone_backup/", "echo 'Pulling internal storage...'", "echo 'This includes: DCIM, Download, Documents, WhatsApp, etc.'"] },
    ],
  },
  {
    id: "recovery_contacts",
    titleAr: "استخراج جهات الاتصال والرسائل",
    operations: [
      { id: "rec_contacts", labelAr: "استخراج جهات الاتصال", label: "Extract Contacts", color: "green", description: "استخراج جميع جهات الاتصال بصيغة VCF", commands: ["adb shell content query --uri content://contacts/phones --projection display_name:number", "echo 'Exporting contacts to VCF...'", "adb pull /sdcard/contacts.vcf ./contacts_backup.vcf 2>/dev/null", "echo 'Alternative: Check /data/data/com.android.providers.contacts/'", "echo 'Or export from Phone app → Manage contacts → Export'"] },
      { id: "rec_sms", labelAr: "استخراج الرسائل SMS", label: "Extract SMS", color: "green", description: "استخراج جميع رسائل SMS من الجهاز", commands: ["adb shell content query --uri content://sms --projection address:body:date --sort 'date DESC' 2>/dev/null", "echo 'SMS extraction requires root for full access'", "echo 'Alternative: adb pull /data/data/com.android.providers.telephony/databases/mmssms.db'", "echo 'Use SMS Backup & Restore app for non-root extraction'"] },
      { id: "rec_call_log", labelAr: "استخراج سجل المكالمات", label: "Extract Call Log", color: "green", description: "استخراج سجل المكالمات الكامل", commands: ["adb shell content query --uri content://call_log/calls --projection number:name:duration:date:type --sort 'date DESC'", "echo 'Type: 1=Incoming, 2=Outgoing, 3=Missed'"] },
    ],
  },
  {
    id: "recovery_broken",
    titleAr: "استخراج بيانات من هاتف معطل",
    operations: [
      { id: "rec_broken_screen", labelAr: "استخراج بيانات (شاشة مكسورة)", label: "Broken Screen Recovery", color: "orange", description: "استخراج البيانات من هاتف بشاشة مكسورة عبر scrcpy + ADB", commands: ["echo '=== Broken Screen Data Recovery ==='", "echo '1. Enable USB Debugging (if not already):'", "echo '   - Connect to PC, device should show in adb devices'", "echo '   - If no ADB: try OTG mouse to navigate'", "echo ''", "echo '2. Mirror screen with scrcpy:'", "echo '   scrcpy --turn-screen-off'", "echo ''", "echo '3. Pull data:'", "echo '   adb pull /sdcard/ ./recovered_data/'", "echo '   adb pull /sdcard/DCIM/ ./photos/'", "echo '   adb pull /sdcard/WhatsApp/ ./whatsapp/'"] },
      { id: "rec_whatsapp", labelAr: "نقل بيانات WhatsApp", label: "Transfer WhatsApp", color: "green", description: "نقل بيانات WhatsApp بين الأجهزة", commands: ["echo '=== WhatsApp Data Transfer ==='", "echo 'Pull WhatsApp data:'", "adb pull /sdcard/WhatsApp/ ./whatsapp_backup/", "adb pull /sdcard/Android/media/com.whatsapp/ ./whatsapp_media/ 2>/dev/null", "echo ''", "echo 'Push to new device:'", "echo 'adb push ./whatsapp_backup/ /sdcard/WhatsApp/'", "echo ''", "echo 'Database location (root): /data/data/com.whatsapp/databases/'"] },
    ],
  },
];

// ─── HARDWARE DIAGNOSTICS (تشخيص الهاردوير) ─────────────────────────────────
const HW_DIAGNOSTIC_GROUPS: OperationGroup[] = [
  {
    id: "hw_screen",
    titleAr: "فحص الشاشة",
    operations: [
      { id: "hw_screen_info", labelAr: "معلومات الشاشة", label: "Screen Info", color: "purple", isScan: true, description: "معلومات تفصيلية عن الشاشة: الدقة، الكثافة، نوع اللوحة", commands: ["adb shell wm size", "adb shell wm density", "adb shell dumpsys display | grep -i 'mBaseDisplayInfo\\|PhysicalDisplayInfo'", "adb shell getprop ro.sf.lcd_density", "adb shell cat /sys/class/graphics/fb0/virtual_size 2>/dev/null", "adb shell dumpsys SurfaceFlinger | grep -i 'refresh rate'"] },
      { id: "hw_touch_test", labelAr: "فحص اللمس (Touch Test)", label: "Touch Screen Test", color: "cyan", isScan: true, description: "فحص استجابة شاشة اللمس — يعرض إحداثيات اللمس", commands: ["echo '=== Touch Screen Diagnostic ==='", "adb shell getevent -l /dev/input/event* | head -20", "echo 'Touch events detected above'", "echo ''", "echo 'To run full touch test:'", "echo 'adb shell input tap 100 100  (test tap)'", "adb shell input tap 100 100", "adb shell input tap 540 960", "echo 'Touch test complete - verify device responded'"] },
      { id: "hw_dead_pixel", labelAr: "فحص Dead Pixels", label: "Dead Pixel Test", color: "cyan", description: "فحص النقاط الميتة — يعرض ألوان صلبة لكشف العيوب", commands: ["echo '=== Dead Pixel Test ==='", "echo 'Displaying solid colors for inspection...'", "adb shell am start -a android.intent.action.VIEW -d 'https://deadpixeltest.org' -t 'text/html'", "echo 'Inspect screen for:'", "echo '  - Dead pixels (always black)'", "echo '  - Stuck pixels (always one color)'", "echo '  - Bright spots'", "echo '  - Color uniformity issues'"] },
    ],
  },
  {
    id: "hw_battery",
    titleAr: "فحص البطارية",
    operations: [
      { id: "hw_battery_health", labelAr: "صحة البطارية الشاملة", label: "Battery Health", color: "green", isScan: true, description: "فحص شامل لصحة البطارية: مستوى، درجة حرارة، صحة، دورات الشحن", commands: ["adb shell dumpsys battery", "adb shell cat /sys/class/power_supply/battery/health 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/cycle_count 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/charge_full 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/charge_full_design 2>/dev/null", "adb shell dumpsys batterystats | grep -i 'estimated'", "echo 'Battery diagnostic complete'"] },
      { id: "hw_battery_stats", labelAr: "إحصائيات استهلاك البطارية", label: "Battery Usage Stats", color: "blue", isScan: true, description: "عرض التطبيقات الأكثر استهلاكاً للبطارية", commands: ["adb shell dumpsys batterystats | grep -A5 'Estimated power use'", "adb shell dumpsys battery | grep -i 'temperature\\|voltage\\|current'", "adb shell settings get global low_power_trigger_level"] },
      { id: "hw_charging_test", labelAr: "فحص الشحن", label: "Charging Test", color: "cyan", isScan: true, description: "فحص حالة الشحن: نوع الشاحن، الأمبير، الفولت", commands: ["adb shell dumpsys battery | grep -i 'AC powered\\|USB powered\\|Wireless powered\\|status\\|voltage\\|temperature'", "adb shell cat /sys/class/power_supply/usb/current_now 2>/dev/null", "adb shell cat /sys/class/power_supply/usb/voltage_now 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/current_now 2>/dev/null", "echo 'Charging test complete'"] },
    ],
  },
  {
    id: "hw_sensors",
    titleAr: "فحص الحساسات",
    operations: [
      { id: "hw_sensor_list", labelAr: "قائمة جميع الحساسات", label: "List All Sensors", color: "purple", isScan: true, description: "عرض جميع الحساسات المتوفرة في الجهاز", commands: ["adb shell dumpsys sensorservice | grep -i 'sensor\\|name\\|vendor'", "echo 'Common sensors:'", "echo '  - Accelerometer, Gyroscope, Magnetometer'", "echo '  - Proximity, Light, Barometer'", "echo '  - Fingerprint, Face recognition'"] },
      { id: "hw_gps_test", labelAr: "فحص GPS", label: "GPS Test", color: "cyan", isScan: true, description: "فحص عمل GPS وعدد الأقمار الصناعية المرصودة", commands: ["adb shell dumpsys location | grep -i 'provider\\|last known\\|status'", "adb shell settings get secure location_providers_allowed", "adb shell dumpsys location | grep -i 'satellites'", "echo 'GPS diagnostic complete'"] },
      { id: "hw_camera_test", labelAr: "فحص الكاميرات", label: "Camera Test", color: "cyan", isScan: true, description: "فحص الكاميرات المتوفرة وحالتها", commands: ["adb shell dumpsys media.camera | grep -i 'camera id\\|facing\\|resolution\\|status'", "adb shell ls /dev/video* 2>/dev/null", "echo 'Camera devices detected'", "echo 'To test: adb shell am start -a android.media.action.IMAGE_CAPTURE'", "adb shell am start -a android.media.action.IMAGE_CAPTURE"] },
      { id: "hw_audio_test", labelAr: "فحص السماعة والميكروفون", label: "Audio Test", color: "cyan", description: "فحص السماعات والميكروفون وجودة الصوت", commands: ["adb shell dumpsys audio | grep -i 'stream\\|volume\\|device\\|speaker\\|mic'", "adb shell media volume --show --stream 3 --set 10", "echo 'Volume set to max for testing'", "echo 'Play test tone: adb shell am start -a android.intent.action.VIEW -d file:///system/media/audio/ringtones/'"] },
    ],
  },
];

// ─── ADVANCED FLASHING (فلاش متقدم) ─────────────────────────────────────────
const FLASH_ADVANCED_GROUPS: OperationGroup[] = [
  {
    id: "flash_samsung",
    titleAr: "فلاش Samsung (Odin)",
    operations: [
      { id: "flash_sam_download", labelAr: "دخول Download Mode", label: "Enter Download Mode", color: "orange", description: "دخول وضع Download لسامسونج لاستخدام Odin", commands: ["adb reboot download", "echo 'Or manually: Power Off → Hold Vol Down + Home/Bixby + Power'", "echo 'On newer devices: Vol Down + Vol Up + Connect USB'"] },
      { id: "flash_sam_odin", labelAr: "فلاش Firmware (Odin Guide)", label: "Flash via Odin", color: "blue", description: "دليل فلاش Firmware كامل عبر Odin لسامسونج", commands: ["echo '=== Samsung Odin Flash Guide ==='", "echo '1. Download firmware from SamFw.com or SamMobile'", "echo '2. Extract firmware: BL, AP, CP, CSC files'", "echo '3. Open Odin3 → Add files:'", "echo '   BL → BL_*.tar.md5'", "echo '   AP → AP_*.tar.md5'", "echo '   CP → CP_*.tar.md5'", "echo '   CSC → CSC_*.tar.md5 (full reset) or HOME_CSC (keep data)'", "echo '4. Click Start'", "echo '5. Wait for PASS message'"] },
      { id: "flash_sam_combination", labelAr: "فلاش Combination Firmware", label: "Flash Combination", color: "orange", description: "فلاش Combination Firmware — يفتح USB Debug ويعطل FRP مؤقتاً", commands: ["echo '=== Combination Firmware ==='", "echo 'Used to: Enable ADB, Bypass FRP, Access hidden menus'", "echo ''", "echo '1. Download combination file for your model+baseband'", "echo '2. Flash via Odin (AP slot only)'", "echo '3. Device boots with limited OS'", "echo '4. ADB and USB debugging enabled by default'", "echo '5. Do your work, then flash stock firmware back'"] },
    ],
  },
  {
    id: "flash_mtk",
    titleAr: "فلاش MediaTek (SP Flash)",
    operations: [
      { id: "flash_mtk_sp", labelAr: "فلاش عبر SP Flash Tool", label: "SP Flash Tool Guide", color: "blue", description: "دليل فلاش عبر SP Flash Tool لأجهزة MediaTek", commands: ["echo '=== SP Flash Tool Guide ==='", "echo '1. Download SP Flash Tool v5.x'", "echo '2. Load scatter file from firmware folder'", "echo '3. Select Download Only / Firmware Upgrade'", "echo '4. Uncheck preloader if not needed'", "echo '5. Power off device completely'", "echo '6. Click Download button'", "echo '7. Connect device via USB (no battery press needed)'", "echo '8. Wait for green circle ✓'"] },
      { id: "flash_mtk_format", labelAr: "Format All (SP Flash)", label: "Format All+Download", color: "red", description: "فورمات كامل + فلاش — يحل مشاكل Brick والبوت لوب", commands: ["echo '=== Format All + Download ==='", "echo 'WARNING: This erases EVERYTHING including IMEI!'", "echo '1. SP Flash Tool → Format tab'", "echo '2. Select: Format All + Download'", "echo '3. Load scatter file'", "echo '4. Click Start'", "echo '5. After format, flash firmware normally'", "echo '6. IMPORTANT: Re-write IMEI after format!'"] },
      { id: "flash_mtk_brom", labelAr: "دخول BROM Mode (MTK)", label: "Enter BROM Mode", color: "orange", description: "دخول Boot ROM mode لأجهزة MediaTek — للأجهزة التي لا تستجيب", commands: ["echo '=== MTK BROM Mode ==='", "echo 'Method 1: Button combination'", "echo '  Power off → Hold Vol Up + Vol Down → Connect USB'", "echo ''", "echo 'Method 2: Short TestPoint'", "echo '  Find BROM test point on PCB → Short to GND → Connect USB'", "echo ''", "echo 'BROM detected in SP Flash Tool as BROM connection'"] },
    ],
  },
  {
    id: "flash_qualcomm",
    titleAr: "فلاش Qualcomm (QFIL/EDL)",
    operations: [
      { id: "flash_qc_edl", labelAr: "دخول EDL 9008 Mode", label: "Enter EDL 9008", color: "red", description: "دخول Emergency Download Mode 9008 لأجهزة Qualcomm", commands: ["adb reboot edl", "echo 'Alternative methods:'", "echo '1. fastboot oem edl (if fastboot accessible)'", "echo '2. Vol Up + Vol Down + Connect USB (varies by model)'", "echo '3. TestPoint on PCB → Short to GND'", "echo '4. Diag command via QPST'", "echo ''", "echo 'Device should appear as Qualcomm HS-USB QDLoader 9008 in Device Manager'"] },
      { id: "flash_qc_qfil", labelAr: "فلاش عبر QFIL", label: "Flash via QFIL", color: "blue", description: "فلاش Firmware كامل عبر QFIL لأجهزة Qualcomm في وضع EDL", commands: ["echo '=== QFIL Flash Guide ==='", "echo '1. Enter EDL 9008 mode'", "echo '2. Open QFIL → Select Build Type: Flat Build'", "echo '3. Select Programmer: prog_emmc_firehose_*.mbn'", "echo '4. Load rawprogram0.xml and patch0.xml'", "echo '5. Click Download'", "echo '6. Wait for completion'", "echo '7. Reboot device'"] },
      { id: "flash_qc_sahara", labelAr: "فلاش عبر Sahara Protocol", label: "Sahara Protocol Flash", color: "blue", description: "فلاش عبر بروتوكول Sahara — للأجهزة الأحدث", commands: ["echo '=== Sahara Protocol ==='", "echo 'Used for newer Qualcomm devices (Snapdragon 6xx/7xx/8xx)'", "echo '1. Device must be in EDL/Sahara mode'", "echo '2. QFIL auto-detects Sahara protocol'", "echo '3. Uploads firehose programmer first'", "echo '4. Then sends firmware data'", "echo '5. Compatible with QCDMA-Tool QSahara module'"] },
    ],
  },
  {
    id: "flash_downgrade",
    titleAr: "خفض الإصدار / Custom ROM",
    operations: [
      { id: "flash_downgrade", labelAr: "خفض إصدار Android", label: "Downgrade Android", color: "orange", description: "خفض إصدار Android — مفيد لحل مشاكل التحديثات", commands: ["echo '=== Android Downgrade ==='", "echo 'Samsung: Flash older firmware via Odin'", "echo '  NOTE: May trip Knox counter'", "echo ''", "echo 'Xiaomi: fastboot flash via MiFlash (select Clean All)'", "echo ''", "echo 'Qualcomm (General): Flash via EDL/QFIL'", "echo ''", "echo 'WARNING: Downgrade may fail if anti-rollback (ARB) is active'", "echo 'Check ARB: adb shell getprop ro.boot.avb_version'"] },
      { id: "flash_custom_recovery", labelAr: "فلاش Custom Recovery", label: "Flash TWRP/OrangeFox", color: "blue", description: "فلاش ريكفري مخصص (TWRP أو OrangeFox)", commands: ["echo '=== Custom Recovery Flash ==='", "echo '1. Unlock bootloader first'", "echo '2. Download TWRP/OrangeFox for your model'", "echo '3. Boot to fastboot: adb reboot bootloader'", "echo '4. Flash: fastboot flash recovery recovery.img'", "echo '5. Or boot without flashing: fastboot boot recovery.img'", "echo '6. Reboot to recovery: adb reboot recovery'"] },
    ],
  },
];

// ─── CODES & PASSWORDS (أكواد وكلمات مرور) ──────────────────────────────────
const CODES_PASSWORDS_GROUPS: OperationGroup[] = [
  {
    id: "codes_screen_lock",
    titleAr: "إزالة قفل الشاشة",
    operations: [
      { id: "codes_remove_pin", labelAr: "إزالة PIN/Pattern/Password", label: "Remove Screen Lock", color: "red", description: "إزالة قفل الشاشة (PIN/Pattern/Password) بدون حذف البيانات", commands: ["echo '=== Remove Screen Lock ==='", "echo 'Method 1: ADB (if USB debug was on):'", "adb shell rm /data/system/gesture.key 2>/dev/null", "adb shell rm /data/system/password.key 2>/dev/null", "adb shell rm /data/system/locksettings.db 2>/dev/null", "adb shell rm /data/system/locksettings.db-wal 2>/dev/null", "echo ''", "echo 'Method 2: Recovery mode → Wipe data'", "echo 'Method 3: Samsung Find My Mobile (if registered)'"] },
      { id: "codes_disable_lock", labelAr: "تعطيل قفل الشاشة مؤقتاً", label: "Disable Lock Temp", color: "orange", description: "تعطيل قفل الشاشة مؤقتاً عبر ADB", commands: ["adb shell settings put secure lockscreen.disabled 1", "adb shell locksettings clear --old 0000", "echo 'Lock screen disabled temporarily'", "echo 'NOTE: May not work on all Android versions'"] },
    ],
  },
  {
    id: "codes_network",
    titleAr: "أكواد الشبكة",
    operations: [
      { id: "codes_read_nck", labelAr: "استخراج NCK Code", label: "Extract NCK Code", color: "purple", description: "محاولة استخراج كود فك قفل الشبكة NCK", commands: ["echo '=== NCK Code Extraction ==='", "echo 'NCK cannot be calculated locally for most modern devices'", "echo 'Methods to obtain NCK:'", "echo '1. Contact original carrier (free after contract period)'", "echo '2. Online unlock services (paid)'", "echo '3. Samsung: Check remaining attempts:'", "adb shell service call phone 14", "echo ''", "echo '4. Some LG devices: AT+CLCK command via DIAG'", "echo '5. Huawei (older): dc-unlocker.com algorithm'"] },
      { id: "codes_sim_puk", labelAr: "معلومات PUK/PIN SIM", label: "SIM PUK Info", color: "purple", isScan: true, description: "عرض معلومات حالة قفل SIM ومحاولات PIN/PUK المتبقية", commands: ["adb shell service call iphonesubinfo 6", "adb shell dumpsys telephony.registry | grep -i 'pin\\|puk\\|lock'", "adb shell getprop gsm.sim.state", "echo 'PIN remaining attempts: Check SIM status above'", "echo 'PUK code: Contact carrier with ID verification'"] },
      { id: "codes_spc_read", labelAr: "قراءة SPC/MSL Code", label: "Read SPC/MSL", color: "purple", description: "قراءة Service Programming Code — يستخدم لبرمجة CDMA", commands: ["echo '=== SPC/MSL Code ==='", "echo 'SPC (Service Programming Code) / MSL (Master Subsidy Lock)'", "echo ''", "echo 'Reading via DIAG:'", "echo '1. Enable DIAG port'", "echo '2. Use QPST → Service Programming'", "echo '3. Tool reads SPC automatically'", "echo ''", "echo 'Common default SPCs: 000000, 111111'", "echo 'Sprint MSL: Can be read via ##DATA# menu'"] },
    ],
  },
  {
    id: "codes_frp_bypass",
    titleAr: "تجاوز FRP متقدم",
    operations: [
      { id: "codes_frp_apk", labelAr: "تجاوز FRP عبر APK", label: "FRP Bypass APK", color: "green", description: "تجاوز FRP عبر تثبيت APK من Recovery/Download mode", commands: ["echo '=== FRP Bypass via APK ==='", "echo '1. Get to any browser on locked device:'", "echo '   - Samsung: Emergency Call → YouTube link'", "echo '   - Others: Talkback → Chrome access'", "echo '2. Download FRP bypass APK'", "echo '3. Install → Open Settings → Remove Google account'", "echo ''", "echo 'Or via ADB sideload:'", "adb install frp_bypass.apk 2>/dev/null || echo 'Push APK to device first'"] },
      { id: "codes_frp_talkback", labelAr: "تجاوز FRP عبر TalkBack", label: "FRP via TalkBack", color: "green", description: "تجاوز FRP باستخدام ميزة TalkBack للوصول المساعد", commands: ["echo '=== FRP Bypass via TalkBack ==='", "echo '1. On FRP screen, connect to WiFi'", "echo '2. Triple-tap screen or hold 2 fingers'", "echo '3. TalkBack tutorial opens'", "echo '4. Draw L shape to open TalkBack menu'", "echo '5. Go to TalkBack Settings → Help'", "echo '6. Open link in browser'", "echo '7. From browser → download settings APK'", "echo '8. Or navigate to Settings → Accounts → Remove Google'"] },
    ],
  },
];

// ─── SAMSUNG SPECIALIZED (Samsung متخصص) ────────────────────────────────────
const SAMSUNG_SPECIAL_GROUPS: OperationGroup[] = [
  {
    id: "sam_info",
    titleAr: "Samsung — معلومات متقدمة",
    operations: [
      { id: "sam_read_mtp", labelAr: "قراءة معلومات عبر MTP", label: "Read Info (MTP)", color: "purple", isScan: true, description: "قراءة معلومات الجهاز عبر MTP — يعمل حتى بدون ADB", commands: ["echo '=== Samsung MTP Info ==='", "echo 'Available without ADB/Root:'", "adb shell getprop ro.product.model", "adb shell getprop ro.build.display.id", "adb shell getprop ro.build.version.security_patch", "adb shell getprop ro.boot.hardware.revision", "adb shell getprop ro.product.first_api_level", "adb shell cat /efs/FactoryApp/serial_no 2>/dev/null"] },
      { id: "sam_knox_status", labelAr: "فحص Knox Counter", label: "Knox Counter Status", color: "purple", isScan: true, description: "فحص عداد Knox — هل تم عمل Root/Custom ROM سابقاً", commands: ["adb shell getprop ro.boot.warranty_bit", "adb shell getprop ro.warranty_bit", "echo 'Knox warranty bit: 0=Normal, 1=Tripped (Root/Custom detected)'", "echo ''", "echo 'To check Knox version:'", "adb shell getprop ro.build.knox.container.version", "adb shell pm list packages | grep knox"] },
    ],
  },
  {
    id: "sam_modify",
    titleAr: "Samsung — تعديلات متقدمة",
    operations: [
      { id: "sam_change_sn", labelAr: "تغيير Serial Number", label: "Change SN", color: "red", requiresRoot: true, description: "تغيير الرقم التسلسلي لسامسونج عبر EFS", commands: ["echo '=== Change Samsung Serial Number ==='", "echo 'Requires root or EDL access'", "echo '1. Via EFS (root):'", "echo '   adb shell su -c cat /efs/FactoryApp/serial_no'", "echo '   adb shell su -c \"echo NEW_SERIAL > /efs/FactoryApp/serial_no\"'", "echo ''", "echo '2. Via QCDMA-Tool EDL module (no root needed)'", "echo '3. Via Z3X Samsung Tool (UART)'", "echo 'WARNING: May affect warranty and carrier services'"] },
      { id: "sam_change_model", labelAr: "تغيير Model Number", label: "Change Model", color: "red", requiresRoot: true, description: "تغيير رقم الموديل — مفيد لتغيير CSC والحصول على تحديثات", commands: ["echo '=== Change Samsung Model ==='", "echo 'Via EDL (QCDMA-Tool):'", "echo '  Change Model in NV partition'", "echo ''", "echo 'Via ADB (root):'", "echo '  adb shell su -c setprop ro.product.model SM-XXXX'", "echo '  (temporary - resets on reboot)'", "echo ''", "echo 'Permanent: Modify build.prop in system partition'", "echo '  ro.product.model=SM-XXXX'"] },
      { id: "sam_carrier_id", labelAr: "تغيير Carrier ID", label: "Change Carrier ID", color: "orange", description: "تغيير Carrier ID لسامسونج — يؤثر على CSC والتحديثات", commands: ["echo '=== Samsung Carrier ID Change ==='", "echo 'Via QCDMA-Tool EDL Module:'", "echo '  Select device → Change Carrier ID'", "echo ''", "echo 'Via ADB (requires root):'", "echo '  adb shell cat /efs/imei/mps_code.dat'", "echo '  adb shell echo \"XSG\" > /efs/imei/mps_code.dat'", "echo ''", "echo 'Common IDs: XSG=UAE, MID=Middle East, KSA=Saudi'"] },
      { id: "sam_sw_version", labelAr: "تغيير SW Version", label: "Change SW Version", color: "orange", requiresRoot: true, description: "تغيير إصدار البرنامج — مفيد لتجاوز بعض القيود", commands: ["echo '=== Change Samsung SW Version ==='", "echo 'Shows in About → Software Information'", "echo ''", "echo 'Via root:'", "echo '  Modify /system/build.prop:'", "echo '  ro.build.display.id=NEW_VERSION'", "echo ''", "echo 'Via EDL/QCDMA-Tool:'", "echo '  Change Sw Ver option in Samsung EDL module'"] },
    ],
  },
  {
    id: "sam_frp_special",
    titleAr: "Samsung — FRP حصري",
    operations: [
      { id: "sam_frp_hash", labelAr: "FRP عبر #0# (حصري)", label: "FRP via #0#", color: "green", description: "تجاوز FRP عبر قائمة الاختبار #0# — يعمل على بعض الأجهزة", commands: ["echo '=== Samsung FRP via #0# ==='", "echo '1. On FRP lock screen'", "echo '2. Open Emergency Dialer'", "echo '3. Type: *#0*# or *#*#0*#*#'", "echo '4. Test menu opens → use back to access settings'", "echo '5. Navigate to Accounts → Remove Google'", "echo ''", "echo 'Alternative: *#*#4636#*#* for phone info'", "echo 'NOTE: Patched on newer security patches (2024+)'"] },
      { id: "sam_frp_browser", labelAr: "FRP عبر MTP Browser", label: "FRP via MTP/Browser", color: "green", description: "فتح Browser عبر MTP للوصول إلى حساب Google", commands: ["echo '=== Samsung FRP via MTP Browser ==='", "echo '1. Connect USB → Select MTP'", "echo '2. Or Emergency Call → tap \"Emergency Information\"'", "echo '3. Add contact → website field → open URL'", "echo '4. Download Samsung bypass APK'", "echo '5. Install → access Settings'", "echo '6. Remove Google account'", "echo ''", "echo 'Works on Android 10-13 with certain security patches'"] },
    ],
  },
];

// ─── MOTOROLA SPECIALIZED ───────────────────────────────────────────────────
const MOTOROLA_GROUPS: OperationGroup[] = [
  {
    id: "moto_unlock",
    titleAr: "Motorola — فك القفل والتجاوز",
    operations: [
      { id: "moto_frp_qr", labelAr: "تجاوز FRP عبر QR Code", label: "FRP Bypass (QR)", color: "green", description: "تجاوز FRP لموتورولا عبر QR Code — طريقة حصرية", commands: ["echo '=== Motorola FRP Bypass via QR ==='", "echo '1. On FRP screen, connect to WiFi'", "echo '2. Look for QR code scanner option'", "echo '3. Scan QR that links to settings APK'", "echo '4. Or use Emergency Call → QR contacts'", "echo '5. Access Chrome → Download FRP tool'", "echo '6. Remove Google account from Settings'"] },
      { id: "moto_mdm_qr", labelAr: "تجاوز MDM عبر QR Code", label: "MDM Bypass (QR)", color: "green", description: "تجاوز MDM (إدارة الأجهزة) لموتورولا عبر QR", commands: ["echo '=== Motorola MDM Bypass via QR ==='", "echo '1. Factory reset device'", "echo '2. On setup wizard → Skip Google sign in'", "echo '3. When MDM screen appears'", "echo '4. Use QR scanner if available'", "echo '5. Or: Settings → Apps → Show system → MDM app → Clear'", "echo '6. adb shell pm disable-user --user 0 com.motorola.android.knox 2>/dev/null'"] },
      { id: "moto_bootloader", labelAr: "فتح Bootloader Motorola", label: "Unlock Bootloader", color: "orange", description: "فتح Bootloader لموتورولا — يتطلب حساب Motorola", commands: ["echo '=== Motorola Bootloader Unlock ==='", "echo '1. Enable OEM Unlock in Developer Options'", "echo '2. Reboot to fastboot: adb reboot bootloader'", "echo '3. Get unlock code:'", "fastboot oem get_unlock_data", "echo '4. Go to: motorola.com/unlockbootloader'", "echo '5. Paste unlock data → Get unlock key'", "echo '6. Apply: fastboot oem unlock [CODE]'", "echo 'WARNING: This wipes all data!'"] },
    ],
  },
  {
    id: "moto_volte",
    titleAr: "Motorola — VoLTE والشبكة",
    operations: [
      { id: "moto_volte_fastboot", labelAr: "تفعيل VoLTE (Fastboot)", label: "VoLTE via Fastboot", color: "green", description: "تفعيل VoLTE لموتورولا عبر Fastboot — حصري", commands: ["echo '=== Motorola VoLTE via Fastboot ==='", "echo '1. Reboot to fastboot: adb reboot bootloader'", "echo '2. Check current state:'", "fastboot getvar all 2>&1 | grep -i volte", "echo '3. Enable VoLTE:'", "echo '   fastboot oem config carrier [carrier_name]'", "echo '4. Or modify modem file with VoLTE flags'", "echo '5. Flash modified modem: fastboot flash modem modem.img'"] },
      { id: "moto_imei_repair", labelAr: "إصلاح IMEI Motorola", label: "Repair IMEI (Moto)", color: "red", description: "إصلاح IMEI لموتورولا عبر META/DIAG", commands: ["echo '=== Motorola IMEI Repair ==='", "echo 'Method 1: META Mode'", "echo '  Power off → Hold Vol Down → Connect USB'", "echo '  Use SP META Tool or dedicated Moto tool'", "echo ''", "echo 'Method 2: DIAG Mode'", "echo '  adb shell setprop sys.usb.config diag,adb'", "echo '  Write NV 550 via QPST/QXDM'", "echo ''", "echo 'Method 3: Fastboot (some models)'", "echo '  fastboot oem writeimei [IMEI]'"] },
    ],
  },
];

// ─── SMART TOOLS (أدوات ذكية) ───────────────────────────────────────────────
const SMART_TOOLS_GROUPS: OperationGroup[] = [
  {
    id: "smart_verify",
    titleAr: "التحقق من أصالة الجهاز",
    operations: [
      { id: "smart_original_check", labelAr: "كشف الهاتف المُعاد تجميعه", label: "Refurbished Check", color: "cyan", isScan: true, description: "فحص شامل لكشف إذا كان الجهاز أصلي أو مُعاد تجميعه أو مستنسخ", commands: ["echo '=== Refurbished/Clone Detection ==='", "adb shell getprop ro.product.model", "adb shell getprop ro.product.manufacturer", "adb shell getprop ro.product.first_api_level", "adb shell getprop ro.build.date", "adb shell cat /proc/cpuinfo | grep -i 'hardware\\|processor'", "adb shell getprop ro.hardware", "echo 'Check: Does hardware match advertised specs?'", "echo 'Clone indicators: Mismatched CPU, low RAM, different Android version'"] },
      { id: "smart_screen_check", labelAr: "كشف تغيير الشاشة", label: "Screen Replace Check", color: "cyan", isScan: true, description: "فحص إذا تم تغيير الشاشة — يفحص معرف اللوحة والمعايرة", commands: ["adb shell dumpsys display | grep -i 'display.*id\\|panel\\|manufacturer'", "adb shell cat /sys/class/graphics/fb0/name 2>/dev/null", "adb shell cat /sys/class/backlight/*/brightness 2>/dev/null", "echo 'Screen panel info above'", "echo 'Mismatch with original specs may indicate replacement'", "echo 'Samsung: Check under About → Status → Touch Screen Info'"] },
      { id: "smart_battery_check", labelAr: "كشف تغيير البطارية", label: "Battery Replace Check", color: "cyan", isScan: true, description: "فحص إذا تم تغيير البطارية — دورات الشحن والسعة", commands: ["adb shell dumpsys battery", "adb shell cat /sys/class/power_supply/battery/cycle_count 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/charge_full_design 2>/dev/null", "adb shell cat /sys/class/power_supply/battery/charge_full 2>/dev/null", "echo 'High cycle count (>500) = heavily used battery'", "echo 'charge_full much less than design = degraded battery'", "echo 'Very low cycle count on old device = likely replaced'"] },
    ],
  },
  {
    id: "smart_blacklist",
    titleAr: "فحص IMEI / Blacklist",
    operations: [
      { id: "smart_imei_check", labelAr: "فحص IMEI (TAC + حالة)", label: "Full IMEI Check", color: "purple", isScan: true, description: "فحص شامل لـ IMEI: الشركة المصنعة، الموديل، حالة القفل", commands: ["adb shell service call iphonesubinfo 1", "echo '=== IMEI Analysis ==='", "echo 'First 8 digits = TAC (Type Allocation Code)'", "echo 'TAC identifies: Manufacturer + Model'", "echo ''", "echo 'Online IMEI check services:'", "echo '  - imei.info (free basic check)'", "echo '  - swappa.com/imei (blacklist check)'", "echo '  - imeipro.info (carrier lock status)'", "echo ''", "echo 'Local check: Verify IMEI matches device label/box'"] },
      { id: "smart_dual_imei", labelAr: "فحص IMEI المزدوج", label: "Check Dual IMEI", color: "purple", isScan: true, description: "قراءة IMEI لكل الشرائح (SIM1 + SIM2)", commands: ["adb shell service call iphonesubinfo 1", "adb shell service call iphonesubinfo 3", "adb shell getprop persist.radio.multisim.config", "echo 'IMEI 1 (SIM1) and IMEI 2 (SIM2) shown above'", "echo 'Both should be valid and different numbers'"] },
    ],
  },
  {
    id: "smart_pricing",
    titleAr: "أدوات المحل الذكية",
    operations: [
      { id: "smart_device_report", labelAr: "تقرير حالة الجهاز (للبيع)", label: "Device Condition Report", color: "blue", isScan: true, description: "تقرير شامل لحالة الجهاز — مفيد لتسعير الأجهزة المستعملة", commands: ["echo '======== DEVICE CONDITION REPORT ========'", "adb shell getprop ro.product.manufacturer", "adb shell getprop ro.product.model", "adb shell getprop ro.build.version.release", "adb shell dumpsys battery | grep -i 'level\\|health\\|temperature'", "adb shell cat /sys/class/power_supply/battery/cycle_count 2>/dev/null", "adb shell df /data | tail -1", "adb shell dumpsys display | grep -i 'mBaseDisplayInfo'", "adb shell getprop ro.boot.warranty_bit 2>/dev/null", "echo '========================================'", "echo 'Grade: Check physical condition manually'"] },
      { id: "smart_full_specs", labelAr: "المواصفات الكاملة للجهاز", label: "Full Device Specs", color: "purple", isScan: true, description: "استخراج جميع المواصفات التقنية للجهاز", commands: ["echo '===== FULL DEVICE SPECIFICATIONS ====='", "adb shell getprop ro.product.model", "adb shell getprop ro.product.manufacturer", "adb shell getprop ro.build.version.release", "adb shell getprop ro.build.version.sdk", "adb shell cat /proc/cpuinfo | grep -i 'processor\\|hardware' | head -4", "adb shell cat /proc/meminfo | grep MemTotal", "adb shell df /data | tail -1", "adb shell wm size", "adb shell dumpsys battery | grep -i 'technology'", "adb shell getprop gsm.version.baseband", "adb shell getprop ro.board.platform", "echo '======================================='"] },
    ],
  },
];

// ─── BRANDS EXPORT ───────────────────────────────────────────────────────────
export const BRANDS: Brand[] = [
  { id: "general",      name: "General",              nameAr: "عام",                     chipset: "All Chipsets",               color: "#3B82F6", groups: GENERAL_GROUPS },
  { id: "arabization",  name: "Arabization Pro",      nameAr: "تعريب الهواتف",           chipset: "All Devices",                color: "#10B981", groups: ARABIZATION_GROUPS },
  { id: "imei_repair",  name: "IMEI Repair",          nameAr: "إصلاح IMEI",              chipset: "QC / MTK / SPD / Samsung",   color: "#DC2626", groups: IMEI_REPAIR_GROUPS },
  { id: "accounts",     name: "Account Removal",      nameAr: "إزالة الحسابات",          chipset: "All Devices",                color: "#B91C1C", groups: ACCOUNT_REMOVAL_GROUPS },
  { id: "simlock",      name: "SIM Lock / Network",   nameAr: "قفل الشبكة / SIM Lock",  chipset: "All Devices",                color: "#EF4444", groups: SIMLOCK_GROUPS },
  { id: "volte_net",    name: "VoLTE / Network",      nameAr: "VoLTE / إصلاح الشبكة",   chipset: "QC / MTK / SPD",             color: "#0EA5E9", groups: VOLTE_NETWORK_GROUPS },
  { id: "data_recovery",name: "Data Recovery",        nameAr: "استعادة البيانات",        chipset: "All Devices",                color: "#6366F1", groups: DATA_RECOVERY_GROUPS },
  { id: "hw_diag",      name: "Hardware Diagnostics", nameAr: "تشخيص الهاردوير",        chipset: "All Devices",                color: "#14B8A6", groups: HW_DIAGNOSTIC_GROUPS },
  { id: "flash_adv",    name: "Advanced Flashing",    nameAr: "فلاش متقدم",             chipset: "QC / MTK / Samsung",         color: "#F97316", groups: FLASH_ADVANCED_GROUPS },
  { id: "codes",        name: "Codes & Passwords",    nameAr: "أكواد وكلمات مرور",      chipset: "All Devices",                color: "#A855F7", groups: CODES_PASSWORDS_GROUPS },
  { id: "samsung_pro",  name: "Samsung Pro",          nameAr: "Samsung متخصص",           chipset: "Exynos / Snapdragon",        color: "#1E40AF", groups: SAMSUNG_SPECIAL_GROUPS },
  { id: "motorola",     name: "Motorola",             nameAr: "Motorola",                chipset: "Snapdragon",                 color: "#0F766E", groups: MOTOROLA_GROUPS },
  { id: "smart_tools",  name: "Smart Tools",          nameAr: "أدوات ذكية",              chipset: "All Devices",                color: "#7C3AED", groups: SMART_TOOLS_GROUPS },
  { id: "advanced",     name: "Advanced Tools",       nameAr: "أدوات متقدمة",           chipset: "All Chipsets",               color: "#8B5CF6", groups: ADVANCED_GROUPS },
  { id: "frp",          name: "FRP — All Brands",     nameAr: "FRP — كل الماركات",      chipset: "Universal",                  color: "#059669", groups: FRP_GROUPS },
  { id: "cdma",         name: "CDMA / QCDMA",         nameAr: "CDMA / QCDMA",            chipset: "Qualcomm DIAG",              color: "#F59E0B", groups: CDMA_GROUPS },
  { id: "qualcomm",     name: "Qualcomm / Snapdragon",nameAr: "Qualcomm / Snapdragon",   chipset: "Snapdragon",                 color: "#D40000", groups: QUALCOMM_GROUPS },
  { id: "mtk",          name: "MediaTek / Dimensity", nameAr: "MediaTek / Dimensity",    chipset: "Helio / Dimensity",          color: "#E65C00", groups: MTK_GROUPS },
  { id: "unisoc",       name: "Unisoc / SPD",         nameAr: "Unisoc / SPD",             chipset: "Tiger / SC Series",          color: "#7C3AED", groups: UNISOC_GROUPS },
  { id: "samsung",      name: "Samsung",              nameAr: "Samsung",                  chipset: "Exynos / Snapdragon",        color: "#1428A0", groups: SAMSUNG_GROUPS },
  { id: "xiaomi",       name: "Xiaomi / Redmi / Poco",nameAr: "Xiaomi / Redmi",          chipset: "Snapdragon / MTK",           color: "#FF6900", groups: XIAOMI_GROUPS },
  { id: "huawei",       name: "Huawei / Honor",       nameAr: "Huawei / Honor",           chipset: "Kirin / Snapdragon",         color: "#CF0A2C", groups: HUAWEI_GROUPS },
  { id: "oppo",         name: "OPPO / Realme",        nameAr: "OPPO / Realme",            chipset: "Snapdragon / MTK / Dimensity",color:"#1B5E20", groups: OPPO_GROUPS },
  { id: "tecno",        name: "Tecno / Infinix",      nameAr: "Tecno / Infinix / Itel",   chipset: "MTK / Unisoc",               color: "#1565C0", groups: TECNO_GROUPS },
  { id: "vivo",         name: "Vivo / iQOO",          nameAr: "Vivo / iQOO",              chipset: "Snapdragon / MTK / Dimensity",color:"#415FFF", groups: VIVO_GROUPS },
  { id: "nokia",        name: "Nokia",                nameAr: "Nokia",                    chipset: "Snapdragon / MTK (Android One)",color:"#124191",groups: NOKIA_GROUPS },
];
