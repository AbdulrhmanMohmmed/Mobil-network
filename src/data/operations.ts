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

// ─── BRANDS EXPORT ───────────────────────────────────────────────────────────
export const BRANDS: Brand[] = [
  { id: "general",   name: "General",             nameAr: "عام",                    chipset: "All Chipsets",              color: "#3B82F6", groups: GENERAL_GROUPS },
  { id: "frp",       name: "FRP — All Brands",    nameAr: "FRP — كل الماركات",     chipset: "Universal",                 color: "#059669", groups: FRP_GROUPS },
  { id: "qualcomm",  name: "Qualcomm / Snapdragon",nameAr: "Qualcomm / Snapdragon", chipset: "Snapdragon",                color: "#D40000", groups: QUALCOMM_GROUPS },
  { id: "mtk",       name: "MediaTek / Dimensity", nameAr: "MediaTek / Dimensity",  chipset: "Helio / Dimensity",         color: "#E65C00", groups: MTK_GROUPS },
  { id: "unisoc",    name: "Unisoc / SPD",         nameAr: "Unisoc / SPD",           chipset: "Tiger / SC Series",         color: "#7C3AED", groups: UNISOC_GROUPS },
  { id: "samsung",   name: "Samsung",             nameAr: "Samsung",                chipset: "Exynos / Snapdragon",       color: "#1428A0", groups: SAMSUNG_GROUPS },
  { id: "xiaomi",    name: "Xiaomi / Redmi / Poco",nameAr: "Xiaomi / Redmi",        chipset: "Snapdragon / MTK",          color: "#FF6900", groups: XIAOMI_GROUPS },
  { id: "huawei",    name: "Huawei / Honor",      nameAr: "Huawei / Honor",         chipset: "Kirin / Snapdragon",        color: "#CF0A2C", groups: HUAWEI_GROUPS },
  { id: "oppo",      name: "OPPO / Realme",       nameAr: "OPPO / Realme",          chipset: "Snapdragon / MTK / Dimensity",color:"#1B5E20",groups: OPPO_GROUPS },
  { id: "tecno",     name: "Tecno / Infinix",     nameAr: "Tecno / Infinix / Itel", chipset: "MTK / Unisoc",              color: "#1565C0", groups: TECNO_GROUPS },
  { id: "vivo",      name: "Vivo / iQOO",         nameAr: "Vivo / iQOO",            chipset: "Snapdragon / MTK / Dimensity",color:"#415FFF",groups: VIVO_GROUPS },
  { id: "nokia",     name: "Nokia",               nameAr: "Nokia",                  chipset: "Snapdragon / MTK (Android One)",color:"#124191",groups: NOKIA_GROUPS },
];
