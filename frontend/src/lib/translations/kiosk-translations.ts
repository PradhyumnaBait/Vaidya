/**
 * Vaidya Kiosk — Typed Translation Dictionaries
 *
 * Supported languages: English (en), Hindi (hi), Marathi (mr).
 * Designed for patient-facing kiosk interface.
 */

export interface KioskTranslationSchema {
  common: {
    back: string
    continue: string
    startOver: string
    cancel: string
    staffHelp: string
    listening: string
    speakNow: string
    tapToSpeak: string
    orSelectOne: string
    skip: string
    servingToken: string
    instituteName: string
    ministry: string
    edit: string
  }
  header: {
    title: string
    estRemaining: string
    emergencyHelp: string
    switchLanguage: string
  }
  attract: {
    touchToBegin: string
    touchToBeginSub: string
    availableLanguages: string
  }
  language: {
    title: string
    titleSub: string
    instructions: string
    confirmButton: string
  }
  identify: {
    title: string
    titleSub: string
    methodAbha: string
    methodAbhaDesc: string
    methodPhone: string
    methodPhoneDesc: string
    methodNew: string
    methodNewDesc: string
    enterAbha: string
    enterPhone: string
    searching: string
    patientFound: string
    isThisYou: string
    yesThisIsMe: string
    notMe: string
    registerTitle: string
    nameLabel: string
    ageLabel: string
    genderLabel: string
    male: string
    female: string
    other: string
    phoneLabel: string
    registerButton: string
  }
  consent: {
    title: string
    titleSub: string
    audioTitle: string
    pillar1Title: string
    pillar1Desc: string
    pillar2Title: string
    pillar2Desc: string
    pillar3Title: string
    pillar3Desc: string
    agreeButton: string
  }
  intake: {
    title: string
    titleSub: string
    introDesc: string
    startIntakeButton: string
    complaintTitle: string
    complaintSub: string
    durationTitle: string
    durationSub: string
    qualityTitle: string
    qualitySub: string
    lifestyleTitle: string
    lifestyleSub: string
    speakAnswer: string
    hearQuestion: string
    matchedOption: string
    acceptAnswer: string
    triageNotice: string
    summaryTitle: string
    proceedToDocs: string
    editAnswers: string
  }
  documents: {
    title: string
    titleSub: string
    haveDocs: string
    haveDocsDesc: string
    noDocs: string
    noDocsDesc: string
    scannerTitle: string
    placeFlat: string
    goodLight: string
    fullPage: string
    tapToCapture: string
    processingTitle: string
    qualityWarningTitle: string
    qualityWarningDesc: string
    scanAgain: string
    continueAnyway: string
    yourDocsTitle: string
    scanAnother: string
    continueToReview: string
  }
  review: {
    title: string
    titleSub: string
    patientDetailsTitle: string
    healthSummaryTitle: string
    documentsTitle: string
    aiSummaryTitle: string
    aiSummaryDisclaimer: string
    isEverythingCorrect: string
    confirmAndGenerateToken: string
    editHealthAnswers: string
    reviewDocuments: string
  }
  token: {
    title: string
    titleSub: string
    tokenNumberLabel: string
    tokenNumber: string
    estimatedWaitLabel: string
    estimatedWait: string
    locationLabel: string
    location: string
    status1: string
    status2: string
    status3: string
    printButton: string
    printing: string
    printSuccess: string
    proceedWaiting: string
    nextStepsDesc: string
    resetCountdown: string
    resetNow: string
  }
}

export const KIOSK_TRANSLATIONS: Record<'en' | 'hi' | 'mr', KioskTranslationSchema> = {
  en: {
    common: {
      back: 'Back',
      continue: 'Continue',
      startOver: 'Start Over',
      cancel: 'Cancel',
      staffHelp: 'Need help? Ask hospital staff',
      listening: 'Listening… Speak now',
      speakNow: 'Speak now',
      tapToSpeak: 'Tap to speak',
      orSelectOne: 'or select one',
      skip: 'Skip this question',
      servingToken: 'Serving Token #28',
      instituteName: 'All India Institute of Ayurveda',
      ministry: 'Ministry of Ayush · SIH26047',
      edit: 'Edit',
    },
    header: {
      title: 'Vaidya Clinical Intake',
      estRemaining: '~5 min remaining',
      emergencyHelp: 'Emergency? Tap for staff',
      switchLanguage: 'Language',
    },
    attract: {
      touchToBegin: 'Touch anywhere to begin',
      touchToBeginSub: 'Clinical Intake & OPD Registration',
      availableLanguages: 'Available Languages',
    },
    language: {
      title: 'Select Preferred Language',
      titleSub: 'अपनी भाषा चुनें / तुमची भाषा निवडा',
      instructions: 'You can speak or read in this language throughout the visit.',
      confirmButton: 'Continue in English →',
    },
    identify: {
      title: 'Patient Identification',
      titleSub: 'Identify with ABHA, Mobile, or Register as New',
      methodAbha: 'Scan ABHA Card / QR',
      methodAbhaDesc: 'Ayushman Bharat Digital Health Card',
      methodPhone: 'Mobile / ABHA Number',
      methodPhoneDesc: 'Enter 10-digit phone or 14-digit ABHA',
      methodNew: 'New Patient Registration',
      methodNewDesc: 'First-time hospital visitor',
      enterAbha: 'Enter 14-digit ABHA Number',
      enterPhone: 'Enter 10-digit Mobile Number',
      searching: 'Looking up patient records…',
      patientFound: 'Patient Record Found',
      isThisYou: 'Please confirm your identity',
      yesThisIsMe: 'Yes, this is me — Continue →',
      notMe: 'Not me — Search again',
      registerTitle: 'New Patient Details',
      nameLabel: 'Full Name',
      ageLabel: 'Age (Years)',
      genderLabel: 'Sex / Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      phoneLabel: 'Mobile Number',
      registerButton: 'Register & Proceed to Consent →',
    },
    consent: {
      title: 'Informed Consent & Privacy',
      titleSub: 'How your health information is protected',
      audioTitle: 'Listen to privacy terms in your language',
      pillar1Title: 'Used only for this visit',
      pillar1Desc: 'Your symptoms and records are shared only with your consulting physician.',
      pillar2Title: 'Zero permanent kiosk storage',
      pillar2Desc: 'All session data is instantly erased from this kiosk when your session finishes.',
      pillar3Title: 'You control your data',
      pillar3Desc: 'You may stop, skip any question, or ask hospital staff for assistance anytime.',
      agreeButton: 'I Understand & Consent — Begin Intake →',
    },
    intake: {
      title: 'Clinical Health Assessment',
      titleSub: 'A few quick questions before your doctor consultation',
      introDesc: 'Speak naturally in your language or tap answers on screen.',
      startIntakeButton: 'Start Health Assessment →',
      complaintTitle: 'What brings you here today?',
      complaintSub: 'Speak using the microphone or select a category below.',
      durationTitle: 'When did this problem begin?',
      durationSub: 'Select onset and duration of your symptoms.',
      qualityTitle: 'How would you describe the pain?',
      qualitySub: 'Select the sensation that best matches.',
      lifestyleTitle: 'Does food or routine affect your symptoms?',
      lifestyleSub: 'Ahara / Vihara (Dietary and daily routine triggers).',
      speakAnswer: 'Speak answer',
      hearQuestion: 'Hear question',
      matchedOption: 'Matched Option',
      acceptAnswer: 'Accept Answer & Continue →',
      triageNotice: 'Routine OPD Consultation (No acute red flags detected)',
      summaryTitle: 'Clinical Intake Summary',
      proceedToDocs: 'Proceed to Medical Documents →',
      editAnswers: 'Edit Answers',
    },
    documents: {
      title: 'Previous Medical Documents',
      titleSub: 'Scan paper prescriptions, lab reports, or discharge summaries',
      haveDocs: 'I have new documents',
      haveDocsDesc: 'Scan prescriptions, reports, or discharge summaries using the scanner camera.',
      noDocs: 'No new documents',
      noDocsDesc: 'Existing hospital records are linked. Proceed straight to review.',
      scannerTitle: 'Position document on scanner',
      placeFlat: 'Place Flat',
      goodLight: 'Good Light',
      fullPage: 'Full Page Visible',
      tapToCapture: 'Tap to capture scan',
      processingTitle: 'Reading medical document…',
      qualityWarningTitle: "We couldn't read this document clearly",
      qualityWarningDesc: 'The captured scan has low contrast or blur. Would you like to retake it?',
      scanAgain: 'Scan Again with Good Light',
      continueAnyway: 'Continue Anyway (Doctor will review paper copy)',
      yourDocsTitle: 'Your captured documents',
      scanAnother: 'Scan another document',
      continueToReview: 'Continue to Final Review →',
    },
    review: {
      title: 'Final Review & Confirmation',
      titleSub: 'Please check your information before generating your OPD token.',
      patientDetailsTitle: 'Patient Information',
      healthSummaryTitle: 'Health Concerns Recorded',
      documentsTitle: 'Medical Documents Attached',
      aiSummaryTitle: 'AI-Assisted Pre-Consultation Summary',
      aiSummaryDisclaimer: 'Pre-consultation clinical synthesis for doctor preparation — not a medical diagnosis.',
      isEverythingCorrect: 'Is everything correct?',
      confirmAndGenerateToken: 'Confirm & Generate OPD Token →',
      editHealthAnswers: 'Edit Health Answers',
      reviewDocuments: 'Review Documents',
    },
    token: {
      title: 'Your OPD Consultation Token',
      titleSub: 'सब कुछ तैयार है — आपका परामर्श टोकन',
      tokenNumberLabel: 'Token Number',
      tokenNumber: 'A-028',
      estimatedWaitLabel: 'Estimated Wait Time',
      estimatedWait: '~15 minutes (3 patients ahead)',
      locationLabel: 'Consultation Room',
      location: 'Room 104 — Internal Medicine & Ayush OPD (1st Floor)',
      status1: 'Patient clinical interview complete',
      status2: 'Medical documents structured for physician',
      status3: 'Pre-consultation brief transmitted to OPD desk',
      printButton: '🖨️ Print Token Slip',
      printing: 'Printing thermal token slip…',
      printSuccess: 'Token slip printed! Please collect from the tray below.',
      proceedWaiting: 'Proceed to Waiting Area B',
      nextStepsDesc: 'Please take a seat in OPD Waiting Zone B. Your token number will be announced on the digital display.',
      resetCountdown: 'Screen will automatically reset for privacy in',
      resetNow: 'Done / Reset Kiosk Now',
    },
  },

  hi: {
    common: {
      back: 'पीछे',
      continue: 'आगे बढ़ें',
      startOver: 'शुरू से करें',
      cancel: 'रद्द करें',
      staffHelp: 'सहायता चाहिए? अस्पताल स्टाफ से पूछें',
      listening: 'हम सुन रहे हैं… बोलिए',
      speakNow: 'अब बोलिए',
      tapToSpeak: 'बोलने के लिए छुएं',
      orSelectOne: 'या नीचे से चुनें',
      skip: 'यह प्रश्न छोड़ें',
      servingToken: 'वर्तमान टोकन #28',
      instituteName: 'अखिल भारतीय आयुर्वेद संस्थान',
      ministry: 'आयुष मंत्रालय · SIH26047',
      edit: 'बदलें',
    },
    header: {
      title: 'वैद्य क्लिनिकल इनटेक',
      estRemaining: '~5 मिनट शेष',
      emergencyHelp: 'आपातकालीन सहायता',
      switchLanguage: 'भाषा',
    },
    attract: {
      touchToBegin: 'शुरू करने के लिए स्क्रीन छुएं',
      touchToBeginSub: 'ओपीडी पंजीकरण एवं स्वास्थ्य जांच',
      availableLanguages: 'उपलब्ध भाषाएं',
    },
    language: {
      title: 'अपनी पसंदीदा भाषा चुनें',
      titleSub: 'Select Preferred Language',
      instructions: 'आप इस पूरी प्रक्रिया में इसी भाषा में पढ़ और बोल सकते हैं।',
      confirmButton: 'हिंदी में जारी रखें →',
    },
    identify: {
      title: 'रोगी पहचान',
      titleSub: 'आभा (ABHA), मोबाइल नंबर या नए रोगी के रूप में पंजीकरण करें',
      methodAbha: 'आभा कार्ड / क्यूआर स्कैन',
      methodAbhaDesc: 'आयुष्मान भारत डिजिटल स्वास्थ्य खाता',
      methodPhone: 'मोबाइल / आभा नंबर',
      methodPhoneDesc: '10 अंकों का फोन या 14 अंकों का आभा दर्ज करें',
      methodNew: 'नए रोगी का पंजीकरण',
      methodNewDesc: 'पहली बार अस्पताल आने वाले रोगी',
      enterAbha: '14 अंकों का आभा नंबर दर्ज करें',
      enterPhone: '10 अंकों का मोबाइल नंबर दर्ज करें',
      searching: 'रोगी का रिकॉर्ड खोजा जा रहा है…',
      patientFound: 'रोगी का रिकॉर्ड मिल गया',
      isThisYou: 'कृपया अपनी पहचान की पुष्टि करें',
      yesThisIsMe: 'हाँ, यह मैं हूँ — आगे बढ़ें →',
      notMe: 'यह मैं नहीं हूँ — दोबारा खोजें',
      registerTitle: 'नए रोगी का विवरण',
      nameLabel: 'पूरा नाम',
      ageLabel: 'आयु (वर्ष)',
      genderLabel: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      phoneLabel: 'मोबाइल नंबर',
      registerButton: 'पंजीकरण करें और सहमति पर जाएं →',
    },
    consent: {
      title: 'सहमति एवं डेटा सुरक्षा',
      titleSub: 'आपकी स्वास्थ्य जानकारी कैसे सुरक्षित रखी जाती है',
      audioTitle: 'गोपनीयता नियम अपनी भाषा में सुनें',
      pillar1Title: 'केवल इस परामर्श के लिए उपयोग',
      pillar1Desc: 'आपके लक्षण और रिपोर्ट केवल आपके डॉक्टर के साथ साझा किए जाते हैं।',
      pillar2Title: 'कियोस्क पर कोई डेटा नहीं रहता',
      pillar2Desc: 'सत्र समाप्त होते ही इस मशीन से सारा डेटा तुरंत मिटा दिया जाता है।',
      pillar3Title: 'आपका पूरा नियंत्रण',
      pillar3Desc: 'आप कभी भी किसी प्रश्न को छोड़ सकते हैं या स्टाफ की मदद ले सकते हैं।',
      agreeButton: 'मैं समझ गया/गई — जांच शुरू करें →',
    },
    intake: {
      title: 'स्वास्थ्य संबंधी प्राथमिक जांच',
      titleSub: 'डॉक्टर से मिलने से पहले 4 छोटे प्रश्न',
      introDesc: 'अपनी भाषा में बोलें या स्क्रीन पर उत्तर छुएं।',
      startIntakeButton: 'स्वास्थ्य प्रश्न शुरू करें →',
      complaintTitle: 'आज आप किस समस्या के लिए आए हैं?',
      complaintSub: 'माइक दबाकर बोलें या नीचे श्रेणी चुनें।',
      durationTitle: 'यह समस्या कब से है?',
      durationSub: 'लक्षणों की शुरुआत और समय चुनें।',
      qualityTitle: 'यह दर्द कैसा महसूस होता है?',
      qualitySub: 'सटीक लक्षण का चयन करें।',
      lifestyleTitle: 'क्या भोजन या दिनचर्या से असर पड़ता है?',
      lifestyleSub: 'आहार एवं विहार (भोजन और दिनचर्या संबंधी प्रभाव)।',
      speakAnswer: 'बोलकर बताएं',
      hearQuestion: 'प्रश्न सुनें',
      matchedOption: 'पहचाना गया उत्तर',
      acceptAnswer: 'उत्तर स्वीकार करें और आगे बढ़ें →',
      triageNotice: 'सामान्य ओपीडी परामर्श (कोई गंभीर आपातकालीन लक्षण नहीं)',
      summaryTitle: 'जांच सारांश',
      proceedToDocs: 'दस्तावेज़ स्कैन पर जाएं →',
      editAnswers: 'उत्तर बदलें',
    },
    documents: {
      title: 'पिछले मेडिकल दस्तावेज़',
      titleSub: 'दवा के पर्चे, लैब रिपोर्ट या डिस्चार्ज समरी स्कैन करें',
      haveDocs: 'मेरे पास नए दस्तावेज़ हैं',
      haveDocsDesc: 'कियोस्क स्कैनर से पर्चे या रिपोर्ट स्कैन करें।',
      noDocs: 'कोई नया दस्तावेज़ नहीं है',
      noDocsDesc: 'पुराने रिकॉर्ड जुड़े हैं। सीधे समीक्षा पर आगे बढ़ें।',
      scannerTitle: 'दस्तावेज़ को स्कैनर पर रखें',
      placeFlat: 'सपाट रखें',
      goodLight: 'पर्याप्त प्रकाश',
      fullPage: 'पूरा पृष्ठ दिखना चाहिए',
      tapToCapture: 'स्कैन करने के लिए छुएं',
      processingTitle: 'दस्तावेज़ पढ़ा जा रहा है…',
      qualityWarningTitle: 'दस्तावेज़ स्पष्ट नहीं पढ़ा जा सका',
      qualityWarningDesc: 'स्कैन में धुंधलापन या कम रोशनी है। क्या आप दोबारा स्कैन करना चाहते हैं?',
      scanAgain: 'अच्छी रोशनी में दोबारा स्कैन करें',
      continueAnyway: 'ऐसे ही जारी रखें (डॉक्टर असली पर्चा देखेंगे)',
      yourDocsTitle: 'स्कैन किए गए दस्तावेज़',
      scanAnother: 'एक और दस्तावेज़ स्कैन करें',
      continueToReview: 'अंतिम समीक्षा पर जाएं →',
    },
    review: {
      title: 'अंतिम समीक्षा एवं पुष्टि',
      titleSub: 'टोकन जारी करने से पहले कृपया अपना विवरण जांच लें।',
      patientDetailsTitle: 'रोगी का विवरण',
      healthSummaryTitle: 'दर्ज की गई स्वास्थ्य समस्याएं',
      documentsTitle: 'संलग्न मेडिकल दस्तावेज़',
      aiSummaryTitle: 'एआई-सहायता प्राप्त प्रारंभिक सारांश',
      aiSummaryDisclaimer: 'यह डॉक्टर की तैयारी के लिए प्रारंभिक सारांश है — कोई अंतिम चिकित्सीय निदान नहीं।',
      isEverythingCorrect: 'क्या सब कुछ सही है?',
      confirmAndGenerateToken: 'पुष्टि करें और ओपीडी टोकन पाएं →',
      editHealthAnswers: 'स्वास्थ्य उत्तर बदलें',
      reviewDocuments: 'दस्तावेज़ देखें',
    },
    token: {
      title: 'आपका ओपीडी परामर्श टोकन',
      titleSub: 'पंजीकरण पूर्ण हुआ — कृपया अपनी बारी की प्रतीक्षा करें',
      tokenNumberLabel: 'टोकन क्रमांक',
      tokenNumber: 'A-028',
      estimatedWaitLabel: 'अनुमानित प्रतीक्षा समय',
      estimatedWait: '~15 मिनट (आगे 3 रोगी हैं)',
      locationLabel: 'परामर्श कक्ष',
      location: 'कक्ष संख्या 104 — मेडिसिन एवं आयुष ओपीडी (प्रथम तल)',
      status1: 'रोगी की प्राथमिक जांच पूर्ण',
      status2: 'मेडिकल दस्तावेज़ डॉक्टर के लिए तैयार',
      status3: 'प्रारंभिक रिपोर्ट ओपीडी डेस्क को भेजी गई',
      printButton: '🖨️ टोकन पर्ची प्रिंट करें',
      printing: 'टोकन पर्ची प्रिंट हो रही है…',
      printSuccess: 'टोकन पर्ची प्रिंट हो गई! नीचे ट्रे से प्राप्त करें।',
      proceedWaiting: 'प्रतीक्षा क्षेत्र बी में जाएं',
      nextStepsDesc: 'कृपया ओपीडी प्रतीक्षा क्षेत्र बी में बैठें। डिजिटल डिस्प्ले स्क्रीन पर आपका टोकन नंबर बोला जाएगा।',
      resetCountdown: 'गोपनीयता के लिए स्क्रीन स्वतः रीसेट होगी',
      resetNow: 'पूर्ण / अभी रीसेट करें',
    },
  },

  mr: {
    common: {
      back: 'मागे',
      continue: 'पुढे जा',
      startOver: 'पुन्हा सुरू करा',
      cancel: 'रद्द करा',
      staffHelp: 'मदत हवी आहे? रुग्णालय कर्मचाऱ्यांना विचारा',
      listening: 'आम्ही ऐकत आहोत… बोला',
      speakNow: 'आता बोला',
      tapToSpeak: 'बोलण्यासाठी स्पर्श करा',
      orSelectOne: 'किंवा खालील पर्याय निवडा',
      skip: 'हा प्रश्न वगळा',
      servingToken: 'सध्याचा टोकन #28',
      instituteName: 'अखिल भारतीय आयुर्वेद संस्था',
      ministry: 'आयुष मंत्रालय · SIH26047',
      edit: 'बदला',
    },
    header: {
      title: 'वैद्य क्लिनिकल इनटेक',
      estRemaining: '~५ मिनिटे बाकी',
      emergencyHelp: 'तातडीची मदत',
      switchLanguage: 'भाषा',
    },
    attract: {
      touchToBegin: 'सुरू करण्यासाठी स्क्रीनला स्पर्श करा',
      touchToBeginSub: 'ओपीडी नोंदणी व प्राथमिक आरोग्य तपासणी',
      availableLanguages: 'उपलब्ध भाषा',
    },
    language: {
      title: 'तुमची भाषा निवडा',
      titleSub: 'Select Preferred Language',
      instructions: 'तुम्ही या संपूर्ण तपासणीत याच भाषेत वाचू आणि बोलू शकता.',
      confirmButton: 'मराठीत पुढे जा →',
    },
    identify: {
      title: 'रुग्ण ओळख',
      titleSub: 'आभा (ABHA), मोबाईल नंबर किंवा नवीन रुग्ण म्हणून नोंदणी करा',
      methodAbha: 'आभा कार्ड / क्यूआर स्कॅन',
      methodAbhaDesc: 'आयुष्मान भारत डिजिटल आरोग्य कार्ड',
      methodPhone: 'मोबाईल / आभा नंबर',
      methodPhoneDesc: '१० अंकी मोबाईल किंवा १४ अंकी आभा क्रमांक टाका',
      methodNew: 'नवीन रुग्ण नोंदणी',
      methodNewDesc: 'पहिल्यांदाच रुग्णालयात आलेले रुग्ण',
      enterAbha: '१४ अंकी आभा क्रमांक प्रविष्ट करा',
      enterPhone: '१० अंकी मोबाईल क्रमांक प्रविष्ट करा',
      searching: 'रुग्ण माहिती शोधत आहे…',
      patientFound: 'रुग्ण नोंद सापडली',
      isThisYou: 'कृपया आपल्या ओळखीची खात्री करा',
      yesThisIsMe: 'होय, ही माझीच माहिती आहे — पुढे जा →',
      notMe: 'माझी माहिती नाही — पुन्हा शोधा',
      registerTitle: 'नवीन रुग्ण तपशील',
      nameLabel: 'पूर्ण नाव',
      ageLabel: 'वय (वर्षे)',
      genderLabel: 'लिंग',
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
      phoneLabel: 'मोबाईल क्रमांक',
      registerButton: 'नोंदणी करा व संमतीकडे जा →',
    },
    consent: {
      title: 'माहिती संमती व गोपनीयता',
      titleSub: 'आपली आरोग्य माहिती कशी सुरक्षित ठेवली जाते',
      audioTitle: 'गोपनीयता अटी आपल्या भाषेत ऐका',
      pillar1Title: 'केवळ या भेटीसाठी वापर',
      pillar1Desc: 'तुमची लक्षणे व अहवाल केवळ तपासणाऱ्या डॉक्टरांसोबत शेअर केले जातात.',
      pillar2Title: 'कियोस्कवर कोणतीही माहिती राहत नाही',
      pillar2Desc: 'सत्र संपताच या मशीनवरून सर्व माहिती त्वरित नष्ट केली जाते.',
      pillar3Title: 'तुमचे पूर्ण नियंत्रण',
      pillar3Desc: 'तुम्ही कोणताही प्रश्न वगळू शकता किंवा कर्मचाऱ्यांची मदत घेऊ शकता.',
      agreeButton: 'मला समजले — तपासणी सुरू करा →',
    },
    intake: {
      title: 'प्राथमिक आरोग्य तपासणी',
      titleSub: 'डॉक्टरांना भेटण्यापूर्वी ४ छोटे प्रश्न',
      introDesc: 'आपल्या भाषेत बोला किंवा स्क्रीनवर पर्याय निवडा.',
      startIntakeButton: 'आरोग्य तपासणी सुरू करा →',
      complaintTitle: 'तुम्हाला आज काय त्रास होतोय?',
      complaintSub: 'माईक दाबून बोला किंवा खालील प्रकार निवडा.',
      durationTitle: 'हा त्रास कधीपासून होत आहे?',
      durationSub: 'त्रासाची सुरुवात आणि कालावधी निवडा.',
      qualityTitle: 'हे दुखणे कसे जाणवते?',
      qualitySub: 'योग्य दुखण्याचा प्रकार निवडा.',
      lifestyleTitle: 'जेवणाचा किंवा दिनचर्येचा काही फरक पडतो का?',
      lifestyleSub: 'आहार आणि विहार (आहार आणि दिनचर्येचा प्रभाव).',
      speakAnswer: 'बोलून सांगा',
      hearQuestion: 'प्रश्न ऐका',
      matchedOption: 'ओळखलेला पर्याय',
      acceptAnswer: 'उत्तर मान्य करा व पुढे जा →',
      triageNotice: 'नियमित ओपीडी तपासणी (कोणतीही आणीबाणी लक्षणे आढळली नाहीत)',
      summaryTitle: 'तपासणी सारांश',
      proceedToDocs: 'कागदपत्रे स्कॅनकडे जा →',
      editAnswers: 'उत्तर बदला',
    },
    documents: {
      title: 'मागील वैद्यकीय कागदपत्रे',
      titleSub: 'डॉक्टरांची चिठ्ठी, लॅब रिपोर्ट किंवा डिस्चार्ज सारांश स्कॅन करा',
      haveDocs: 'माझ्याकडे नवीन कागदपत्रे आहेत',
      haveDocsDesc: 'कॅमेरा स्कॅनरने प्रिस्क्रिप्शन किंवा रिपोर्ट स्कॅन करा.',
      noDocs: 'नवीन कागदपत्रे नाहीत',
      noDocsDesc: 'जुनी माहिती जोडलेली आहे. थेट पुनरावलोकनाकडे जा.',
      scannerTitle: 'कागदपत्र स्कॅनरवर ठेवा',
      placeFlat: 'सपाट ठेवा',
      goodLight: 'पुरेसा प्रकाश',
      fullPage: 'पूर्ण पान दिसले पाहिजे',
      tapToCapture: 'स्कॅन करण्यासाठी स्पर्श करा',
      processingTitle: 'कागदपत्र वाचत आहे…',
      qualityWarningTitle: 'कागदपत्र स्पष्ट दिसले नाही',
      qualityWarningDesc: 'स्कॅनमध्ये अस्पष्टता किंवा सावली आहे. आपण पुन्हा स्कॅन करू इच्छिता?',
      scanAgain: 'चांगल्या प्रकाशात पुन्हा स्कॅन करा',
      continueAnyway: 'असेच पुढे जा (डॉक्टर प्रत्यक्ष कागदपत्र तपासतील)',
      yourDocsTitle: 'स्कॅन केलेली कागदपत्रे',
      scanAnother: 'आणखी कागदपत्र स्कॅन करा',
      continueToReview: 'अंतिम पुनरावलोकनाकडे जा →',
    },
    review: {
      title: 'अंतिम पुनरावलोकन व खात्री',
      titleSub: 'टोकन मिळण्यापूर्वी कृपया सर्व माहिती तपासून घ्या.',
      patientDetailsTitle: 'रुग्णाची माहिती',
      healthSummaryTitle: 'नोंदवलेल्या आरोग्य तक्रारी',
      documentsTitle: 'जोडलेली कागदपत्रे',
      aiSummaryTitle: 'एआय-सहाय्यित पूर्व-सल्ला सारांश',
      aiSummaryDisclaimer: 'हा डॉक्टरांच्या पूर्वतयारीसाठीचा सारांश आहे — कोणताही वैद्यकीय अंतिम निष्कर्ष नाही.',
      isEverythingCorrect: 'सर्व माहिती बरोबर आहे का?',
      confirmAndGenerateToken: 'खात्री करा व ओपीडी टोकन मिळवा →',
      editHealthAnswers: 'आरोग्य उत्तरे बदला',
      reviewDocuments: 'कागदपत्रे तपासा',
    },
    token: {
      title: 'आपला ओपीडी सल्लागार टोकन',
      titleSub: 'नोंदणी पूर्ण झाली — कृपया आपली पाळी येईपर्यंत प्रतीक्षा करा',
      tokenNumberLabel: 'टोकन क्रमांक',
      tokenNumber: 'A-028',
      estimatedWaitLabel: 'अंदाजे प्रतीक्षा वेळ',
      estimatedWait: '~१५ मिनिटे (पुढे ३ रुग्ण आहेत)',
      locationLabel: 'तपासणी कक्ष',
      location: 'कक्ष क्र. १०४ — मेडिसिन व आयुष ओपीडी (पहिला मजला)',
      status1: 'रुग्णाची प्राथमिक मुलाखत पूर्ण',
      status2: 'वैद्यकीय कागदपत्रे डॉक्टरांसाठी तयार',
      status3: 'प्राथमिक माहिती ओपीडी डेस्कला पाठवली',
      printButton: '🖨️ टोकन पावती प्रिंट करा',
      printing: 'टोकन पावती प्रिंट होत आहे…',
      printSuccess: 'टोकन पावती प्रिंट झाली! कृपया खालच्या ट्रेमधून घ्या.',
      proceedWaiting: 'प्रतीक्षा क्षेत्र बी कडे जा',
      nextStepsDesc: 'कृपया ओपीडी वेटिंग झोन बी मध्ये बसा. डिजिटल स्क्रीनवर आपला टोकन नंबर पुकारला जाईल.',
      resetCountdown: 'गोपनीयतेसाठी स्क्रीन आपोआप रीसेट होईल',
      resetNow: 'पूर्ण / आता रीसेट करा',
    },
  },
}
