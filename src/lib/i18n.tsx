import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  native: string;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', native: 'English', label: 'English' },
  { code: 'hi', native: 'हिन्दी', label: 'Hindi' },
  { code: 'bn', native: 'বাংলা', label: 'Bengali' },
  { code: 'mr', native: 'मराठी', label: 'Marathi' },
  { code: 'ta', native: 'தமிழ்', label: 'Tamil' },
  { code: 'te', native: 'తెలుగు', label: 'Telugu' }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    nav_registry: "Certificate Registry",
    nav_verify: "Verify Certificate",
    nav_docs: "Documentation",
    nav_signin: "Sign In",
    nav_getstarted: "Get Started",
    nav_features: "Features",
    nav_how: "How it works",
    hero_title: "One nation. One portal. Every weight & measure, verified.",
    hero_sub: "A unified digital platform replacing paper-based verification of weighing and measuring instruments — online applications, scheduled field inspections, and QR-secured digital certificates for shops, hospitals, fuel stations and industries across India.",
    cta_apply: "Apply for Verification",
    cta_verify: "Verify a Certificate",
    stat_certs: "Certificates issued",
    stat_inst: "Instruments registered",
    stat_apps: "Applications processed",
    features_title: "Everything the verification ecosystem needs to go paperless.",
    how_title: "From application to certified — fully digital.",
    roles_title: "Built for every stakeholder in legal metrology.",
    check_now: "Check a certificate right now",
    faq_title: "Questions, answered.",
    cta_ready: "Ready to go paperless?",
    verify_title: "Verify a Certificate",
    verify_sub: "Scan the QR code on any certificate, or enter the certificate number below. Checked live against the national registry.",
    btn_verify: "Verify",
    side_dashboard: "Dashboard",
    side_instruments: "Instruments",
    side_applications: "Applications",
    side_queue: "Verification Queue",
    side_certificates: "Certificates",
    side_notifications: "Notifications",
    side_users: "Users & Roles",
    side_audit: "Audit Logs",
    side_public_verify: "Public Verify",
    side_docs: "Documentation",
    side_signout: "Sign Out",
    my_dashboard: "My Dashboard"
  },
  hi: {
    nav_registry: "प्रमाणपत्र रजिस्ट्री",
    nav_verify: "प्रमाणपत्र सत्यापित करें",
    nav_docs: "दस्तावेज़ीकरण",
    nav_signin: "साइन इन",
    nav_getstarted: "शुरू करें",
    nav_features: "विशेषताएं",
    nav_how: "कार्यप्रणाली",
    hero_title: "एक राष्ट्र। एक पोर्टल। हर बाट और माप, सत्यापित।",
    hero_sub: "दुकानों, अस्पतालों, पेट्रोल पंपों और उद्योगों के लिए तौल एवं माप उपकरणों के कागज़ी सत्यापन की जगह एक एकीकृत डिजिटल प्लेटफ़ॉर्म — ऑनलाइन आवेदन, निर्धारित क्षेत्र निरीक्षण और QR-सुरक्षित डिजिटल प्रमाणपत्र।",
    cta_apply: "सत्यापन हेतु आवेदन करें",
    cta_verify: "प्रमाणपत्र सत्यापित करें",
    stat_certs: "जारी प्रमाणपत्र",
    stat_inst: "पंजीकृत उपकरण",
    stat_apps: "संसाधित आवेदन",
    features_title: "सत्यापन तंत्र को कागज़-मुक्त बनाने के लिए आवश्यक सब कुछ।",
    how_title: "आवेदन से प्रमाणन तक — पूर्णतः डिजिटल।",
    roles_title: "विधिक माप विज्ञान के हर हितधारक के लिए।",
    check_now: "अभी प्रमाणपत्र जांचें",
    faq_title: "प्रश्न, उत्तर सहित।",
    cta_ready: "कागज़-मुक्त होने के लिए तैयार?",
    verify_title: "प्रमाणपत्र सत्यापित करें",
    verify_sub: "किसी भी प्रमाणपत्र पर QR कोड स्कैन करें, या नीचे प्रमाणपत्र संख्या दर्ज करें। राष्ट्रीय रजिस्ट्री से लाइव जांच।",
    btn_verify: "सत्यापित करें",
    side_dashboard: "डैशबोर्ड",
    side_instruments: "उपकरण",
    side_applications: "आवेदन",
    side_queue: "सत्यापन कतार",
    side_certificates: "प्रमाणपत्र",
    side_notifications: "सूचनाएं",
    side_users: "उपयोगकर्ता व भूमिकाएं",
    side_audit: "ऑडिट लॉग",
    side_public_verify: "सार्वजनिक सत्यापन",
    side_docs: "दस्तावेज़ीकरण",
    side_signout: "साइन आउट",
    my_dashboard: "मेरा डैशबोर्ड"
  },
  bn: {
    nav_registry: "সার্টিফিকেট রেজিস্ট্রি",
    nav_verify: "সার্টিফিকেট যাচাই করুন",
    nav_docs: "ডকুমেন্টেশন",
    nav_signin: "সাইন ইন",
    nav_getstarted: "শুরু করুন",
    nav_features: "বৈশিষ্ট্য",
    nav_how: "কীভাবে কাজ করে",
    hero_title: "এক দেশ। এক পোর্টাল। প্রতিটি ওজন ও পরিমাপ, যাচাইকৃত।",
    hero_sub: "দোকান, হাসপাতাল, জ্বালানি স্টেশন ও শিল্পের জন্য ওজন ও পরিমাপ যন্ত্রের কাগজভিত্তিক যাচাইয়ের বদলে একটি একীভূত ডিজিটাল প্ল্যাটফর্ম — অনলাইন আবেদন, নির্ধারিত মাঠ পরিদর্শন এবং QR-সুরক্ষিত ডিজিটাল সার্টিফিকেট।",
    cta_apply: "যাচাইয়ের জন্য আবেদন করুন",
    cta_verify: "সার্টিফিকেট যাচাই করুন",
    stat_certs: "ইস্যুকৃত সার্টিফিকেট",
    stat_inst: "নিবন্ধিত যন্ত্র",
    stat_apps: "প্রক্রিয়াকৃত আবেদন",
    features_title: "যাচাই ব্যবস্থাকে কাগজবিহীন করতে যা যা প্রয়োজন।",
    how_title: "আবেদন থেকে সার্টিফিকেশন — সম্পূর্ণ ডিজিটাল।",
    roles_title: "লিগ্যাল মেট্রোলজির প্রতিটি অংশীদারের জন্য।",
    check_now: "এখনই একটি সার্টিফিকেট যাচাই করুন",
    faq_title: "প্রশ্ন ও উত্তর।",
    cta_ready: "কাগজবিহীন হতে প্রস্তুত?",
    verify_title: "সার্টিফিকেট যাচাই করুন",
    verify_sub: "যেকোনো সার্টিফিকেটের QR কোড স্ক্যান করুন, বা নিচে সার্টিফিকেট নম্বর লিখুন। জাতীয় রেজিস্ট্রির সাথে লাইভ যাচাই।",
    btn_verify: "যাচাই করুন",
    side_dashboard: "ড্যাশবোর্ড",
    side_instruments: "যন্ত্রপাতি",
    side_applications: "আবেদনসমূহ",
    side_queue: "যাচাই সারি",
    side_certificates: "সার্টিফিকেট",
    side_notifications: "বিজ্ঞপ্তি",
    side_users: "ব্যবহারকারী ও ভূমিকা",
    side_audit: "অডিট লগ",
    side_public_verify: "পাবলিক যাচাই",
    side_docs: "ডকুমেন্টেশন",
    side_signout: "সাইন আউট",
    my_dashboard: "আমার ড্যাশবোর্ড"
  },
  mr: {
    nav_registry: "प्रमाणपत्र नोंदणी",
    nav_verify: "प्रमाणपत्र पडताळा",
    nav_docs: "दस्तऐवजीकरण",
    nav_signin: "साइन इन",
    nav_getstarted: "सुरू करा",
    nav_features: "वैशिष्ट्ये",
    nav_how: "कसे कार्य करते",
    hero_title: "एक राष्ट्र. एक पोर्टल. प्रत्येक वजन-माप, पडताळलेले.",
    hero_sub: "दुकाने, रुग्णालये, इंधन स्टेशन आणि उद्योगांसाठी वजन-मापन उपकरणांच्या कागदी पडताळणीऐवजी एकीकृत डिजिटल व्यासपीठ — ऑनलाइन अर्ज, नियोजित क्षेत्र तपासणी आणि QR-सुरक्षित डिजिटल प्रमाणपत्रे.",
    cta_apply: "पडताळणीसाठी अर्ज करा",
    cta_verify: "प्रमाणपत्र पडताळा",
    stat_certs: "जारी प्रमाणपत्रे",
    stat_inst: "नोंदणीकृत उपकरणे",
    stat_apps: "प्रक्रिया केलेले अर्ज",
    features_title: "पडताळणी यंत्रणा कागदविरहित करण्यासाठी आवश्यक सर्व काही.",
    how_title: "अर्जापासून प्रमाणनापर्यंत — पूर्णपणे डिजिटल.",
    roles_title: "वैध मापनशास्त्रातील प्रत्येक भागधारकासाठी.",
    check_now: "आत्ताच प्रमाणपत्र तपासा",
    faq_title: "प्रश्न, उत्तरांसह.",
    cta_ready: "कागदविरहित होण्यास तयार?",
    verify_title: "प्रमाणपत्र पडताळा",
    verify_sub: "कोणत्याही प्रमाणपत्रावरील QR कोड स्कॅन करा, किंवा खाली प्रमाणपत्र क्रमांक टाका. राष्ट्रीय नोंदणीशी थेट तपासणी.",
    btn_verify: "पडताळा",
    side_dashboard: "डॅशबोर्ड",
    side_instruments: "उपकरणे",
    side_applications: "अर्ज",
    side_queue: "पडताळणी रांग",
    side_certificates: "प्रमाणपत्रे",
    side_notifications: "सूचना",
    side_users: "वापरकर्ते व भूमिका",
    side_audit: "ऑडिट लॉग",
    side_public_verify: "सार्वजनिक पडताळणी",
    side_docs: "दस्तऐवजीकरण",
    side_signout: "साइन आउट",
    my_dashboard: "माझा डॅशबोर्ड"
  },
  ta: {
    nav_registry: "சான்றிதழ் பதிவேடு",
    nav_verify: "சான்றிதழை சரிபார்க்கவும்",
    nav_docs: "ஆவணங்கள்",
    nav_signin: "உள்நுழைய",
    nav_getstarted: "தொடங்குங்கள்",
    nav_features: "அம்சங்கள்",
    nav_how: "செயல்முறை",
    hero_title: "ஒரே நாடு. ஒரே போர்டல். ஒவ்வொரு எடையும் அளவையும், சரிபார்க்கப்பட்டது.",
    hero_sub: "கடைகள், மருத்துவமனைகள், எரிபொருள் நிலையங்கள் மற்றும் தொழிற்சாலைகளுக்கான எடை மற்றும் அளவீட்டு கருவிகளின் காகித சரிபார்ப்புக்கு பதிலாக ஒருங்கிணைந்த டிஜிட்டல் தளம் — ஆன்லைன் விண்ணப்பங்கள், திட்டமிடப்பட்ட கள ஆய்வுகள், QR-பாதுகாக்கப்பட்ட டிஜிட்டல் சான்றிதழ்கள்.",
    cta_apply: "சரிபார்ப்புக்கு விண்ணப்பிக்கவும்",
    cta_verify: "சான்றிதழை சரிபார்க்கவும்",
    stat_certs: "வழங்கப்பட்ட சான்றிதழ்கள்",
    stat_inst: "பதிவு செய்யப்பட்ட கருவிகள்",
    stat_apps: "செயலாக்கப்பட்ட விண்ணப்பங்கள்",
    features_title: "சரிபார்ப்பு அமைப்பை காகிதமற்றதாக்க தேவையான அனைத்தும்.",
    how_title: "விண்ணப்பம் முதல் சான்றிதழ் வரை — முழுமையாக டிஜிட்டல்.",
    roles_title: "சட்ட அளவியலின் ஒவ்வொரு பங்குதாரருக்கும்.",
    check_now: "இப்போதே ஒரு சான்றிதழை சரிபார்க்கவும்",
    faq_title: "கேள்விகள், பதில்கள்.",
    cta_ready: "காகிதமற்றதாக மாற தயாரா?",
    verify_title: "சான்றிதழை சரிபார்க்கவும்",
    verify_sub: "எந்த சான்றிதழிலும் உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும், அல்லது கீழே சான்றிதழ் எண்ணை உள்ளிடவும். தேசிய பதிவேட்டுடன் நேரடி சரிபார்ப்பு.",
    btn_verify: "சரிபார்க்க",
    side_dashboard: "டாஷ்போர்டு",
    side_instruments: "கருவிகள்",
    side_applications: "விண்ணப்பங்கள்",
    side_queue: "சரிபார்ப்பு வரிசை",
    side_certificates: "சான்றிதழ்கள்",
    side_notifications: "அறிவிப்புகள்",
    side_users: "பயனர்கள் & பங்குகள்",
    side_audit: "தணிக்கை பதிவுகள்",
    side_public_verify: "பொது சரிபார்ப்பு",
    side_docs: "ஆவணங்கள்",
    side_signout: "வெளியேறு",
    my_dashboard: "என் டாஷ்போர்டு"
  },
  te: {
    nav_registry: "సర్టిఫికెట్ రిజిస్ట్రీ",
    nav_verify: "సర్టిఫికెట్ ధృవీకరించండి",
    nav_docs: "డాక్యుమెంటేషన్",
    nav_signin: "సైన్ ఇన్",
    nav_getstarted: "ప్రారంభించండి",
    nav_features: "ఫీచర్లు",
    nav_how: "ఎలా పనిచేస్తుంది",
    hero_title: "ఒకే దేశం. ఒకే పోర్టల్. ప్రతి తూనిక & కొలత, ధృవీకరించబడింది.",
    hero_sub: "దుకాణాలు, ఆసుపత్రులు, ఇంధన స్టేషన్లు మరియు పరిశ్రమల కోసం తూనిక మరియు కొలత పరికరాల కాగితపు ధృవీకరణ స్థానంలో ఏకీకృత డిజిటల్ వేదిక — ఆన్‌లైన్ దరఖాస్తులు, షెడ్యూల్ చేసిన క్షేత్ర తనిఖీలు, QR-సురక్షిత డిజిటల్ సర్టిఫికెట్లు.",
    cta_apply: "ధృవీకరణ కోసం దరఖాస్తు చేయండి",
    cta_verify: "సర్టిఫికెట్ ధృవీకరించండి",
    stat_certs: "జారీ చేసిన సర్టిఫికెట్లు",
    stat_inst: "నమోదైన పరికరాలు",
    stat_apps: "ప్రాసెస్ చేసిన దరఖాస్తులు",
    features_title: "ధృవీకరణ వ్యవస్థను కాగితరహితం చేయడానికి అవసరమైనవన్నీ.",
    how_title: "దరఖాస్తు నుండి సర్టిఫికేషన్ వరకు — పూర్తిగా డిజిటల్.",
    roles_title: "లీగల్ మెట్రాలజీలోని ప్రతి భాగస్వామి కోసం.",
    check_now: "ఇప్పుడే ఒక సర్టిఫికెట్ తనిఖీ చేయండి",
    faq_title: "ప్రశ్నలు, సమాధానాలు.",
    cta_ready: "కాగితరహితం కావడానికి సిద్ధమా?",
    verify_title: "సర్టిఫికెట్ ధృవీకరించండి",
    verify_sub: "ఏదైనా సర్టిఫికెట్‌పై ఉన్న QR కోడ్‌ను స్కాన్ చేయండి, లేదా క్రింద సర్టిఫికెట్ నంబర్ నమోదు చేయండి. జాతీయ రిజిస్ట్రీతో లైవ్ తనిఖీ.",
    btn_verify: "ధృవీకరించు",
    side_dashboard: "డాష్‌బోర్డ్",
    side_instruments: "పరికరాలు",
    side_applications: "దరఖాస్తులు",
    side_queue: "ధృవీకరణ క్యూ",
    side_certificates: "సర్టిఫికెట్లు",
    side_notifications: "నోటిఫికేషన్లు",
    side_users: "వినియోగదారులు & పాత్రలు",
    side_audit: "ఆడిట్ లాగ్‌లు",
    side_public_verify: "పబ్లిక్ ధృవీకరణ",
    side_docs: "డాక్యుమెంటేషన్",
    side_signout: "సైన్ అవుట్",
    my_dashboard: "నా డాష్‌బోర్డ్"
  }
};

const LANG_STORAGE_KEY = 'everify-lang';

interface I18nContextType {
  lang: SupportedLanguage;
  setLang: (l: SupportedLanguage) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k: string) => TRANSLATIONS.en[k] || k
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {}
    return 'en';
  });

  const setLang = useCallback((l: SupportedLanguage) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string): string => {
      return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
