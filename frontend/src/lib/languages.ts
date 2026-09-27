export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  category: 'OFFICIAL_22' | 'TRIBAL_PROMINENT';
  region?: string;
  script?: string;
}

export const LANGUAGES: LanguageOption[] = [
  // Prominent Tribal Languages & Dialects
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', category: 'TRIBAL_PROMINENT', region: 'Jharkhand, Odisha, West Bengal', script: 'Ol Chiki' },
  { code: 'gon', name: 'Gondi', nativeName: 'गोंडी (Gondi)', category: 'TRIBAL_PROMINENT', region: 'Madhya Pradesh, Chhattisgarh, Maharashtra' },
  { code: 'bhb', name: 'Bhili', nativeName: 'भीली (Bhili)', category: 'TRIBAL_PROMINENT', region: 'Rajasthan, MP, Gujarat' },
  { code: 'kru', name: 'Kurukh / Oraon', nativeName: 'कुरुख़ (Oraon)', category: 'TRIBAL_PROMINENT', region: 'Jharkhand, Chhattisgarh' },
  { code: 'unr', name: 'Mundari', nativeName: 'मुंडारी (Mundari)', category: 'TRIBAL_PROMINENT', region: 'Jharkhand, Odisha' },
  { code: 'hoc', name: 'Ho', nativeName: 'ᱦᱚ: (Ho)', category: 'TRIBAL_PROMINENT', region: 'Jharkhand, Odisha', script: 'Warang Citi' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi', category: 'TRIBAL_PROMINENT', region: 'Meghalaya' },
  { code: 'grt', name: 'Garo', nativeName: 'A·chik ku·sik (Garo)', category: 'TRIBAL_PROMINENT', region: 'Meghalaya, Assam' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', category: 'TRIBAL_PROMINENT', region: 'Mizoram' },
  { code: 'trp', name: 'Kokborok', nativeName: 'ককবরক (Kokborok)', category: 'TRIBAL_PROMINENT', region: 'Tripura' },

  // 22 Official Scheduled Languages of India
  { code: 'en', name: 'English', nativeName: 'English (US/IN)', category: 'OFFICIAL_22' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hindi)', category: 'OFFICIAL_22' },
  { code: 'asm', name: 'Assamese', nativeName: 'অসমীয়া (Assamese)', category: 'OFFICIAL_22', region: 'Assam' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)', category: 'OFFICIAL_22', region: 'West Bengal, Tripura' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\' (Bodo)', category: 'OFFICIAL_22', region: 'Assam (BTAD)' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी (Dogri)', category: 'OFFICIAL_22', region: 'Jammu & Kashmir' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી (Gujarati)', category: 'OFFICIAL_22', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Kannada)', category: 'OFFICIAL_22', region: 'Karnataka' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर (Kashmiri)', category: 'OFFICIAL_22', region: 'Jammu & Kashmir' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी (Konkani)', category: 'OFFICIAL_22', region: 'Goa, Maharashtra' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली (Maithili)', category: 'OFFICIAL_22', region: 'Bihar, Jharkhand' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം (Malayalam)', category: 'OFFICIAL_22', region: 'Kerala' },
  { code: 'mni', name: 'Manipuri / Meitei', nativeName: 'মৈতৈলোন্ (Manipuri)', category: 'OFFICIAL_22', region: 'Manipur' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)', category: 'OFFICIAL_22', region: 'Maharashtra' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली (Nepali)', category: 'OFFICIAL_22', region: 'Sikkim, West Bengal' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ (Odia)', category: 'OFFICIAL_22', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ (Punjabi)', category: 'OFFICIAL_22', region: 'Punjab' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम् (Sanskrit)', category: 'OFFICIAL_22' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिन्धी (Sindhi)', category: 'OFFICIAL_22' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)', category: 'OFFICIAL_22', region: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)', category: 'OFFICIAL_22', region: 'Andhra Pradesh, Telangana' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو (Urdu)', category: 'OFFICIAL_22' },
];

export const UI_TRANSLATIONS: Record<string, { portalTitle: string; subtitle: string; applyNow: string; trackStatus: string }> = {
  en: {
    portalTitle: 'National Fellowship & Scholarship Portal for ST Students',
    subtitle: 'Ministry of Tribal Affairs, Government of India',
    applyNow: 'Apply Online',
    trackStatus: 'Track Application Status',
  },
  hi: {
    portalTitle: 'अनुसूचित जनजाति छात्रों के लिए राष्ट्रीय फेलोशिप एवं छात्रवृत्ति पोर्टल',
    subtitle: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    applyNow: 'ऑनलाइन आवेदन करें',
    trackStatus: 'आवेदन की स्थिति देखें',
  },
  sat: {
    portalTitle: 'ᱮᱥ.ᱴᱤ. ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱯᱷᱮᱞᱳᱥᱤᱯ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱳᱨᱴᱟᱞ',
    subtitle: ' tribal.gov.in • ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ',
    applyNow: 'ᱚᱱᱞᱟᱭᱤᱱ ᱟᱵᱮᱫᱚᱱ',
    trackStatus: 'ᱟᱵᱮᱫᱚᱱ ᱥᱛᱷᱤᱛᱤ ᱧᱮᱞ',
  },
  gon: {
    portalTitle: 'एस.टी. पोरोर साठी राष्ट्रीय फेलोशिप मति छात्रवृत्ति पोर्टल',
    subtitle: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    applyNow: 'ऑनलाइन अर्ज कीम',
    trackStatus: 'अर्ज स्थिति चोइम',
  },
  brx: {
    portalTitle: 'ST फरायसाफोरनि थाखाय हादरारि फेलोशिप आरो स्कलारसिप पर्टेल',
    subtitle: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    applyNow: 'अनलाइन आरज खालाम',
    trackStatus: 'आरजनि थासारि नाय',
  },
  or: {
    portalTitle: 'ST ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଜାତୀୟ ଫେଲୋସିପ୍ ଏବଂ ବୃତ୍ତି ପୋର୍ଟାଲ୍',
    subtitle: 'ଜନଜାତି ବ୍ୟାପାର ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର',
    applyNow: 'ଅନଲାଇନ୍ ଆବେଦନ କରନ୍ତୁ',
    trackStatus: 'ଆବେଦନ ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ',
  },
};
