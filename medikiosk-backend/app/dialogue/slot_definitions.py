"""
MediKiosk — Slot Definitions & Static Question Templates

Defines:
- The priority-ordered SOCRATES slot registry
- The Ayush Core-4 slot registry
- Multilingual fallback question templates (used when LLM/Groq is unavailable)
- Touch-card option templates for each slot
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal


@dataclass
class TouchCard:
    label: str                  # Vernacular display label
    value: str                  # Canonical clinical value stored in slot
    icon_key: str               # Frontend icon map key


@dataclass
class SlotTemplate:
    slot_id: str
    track: Literal["socrates", "ayush"]
    priority_tier: int          # 1=critical, 2=important, 3=ayush, 4=optional
    question_templates: dict[str, str]   # language → question text
    touch_cards: dict[str, list[TouchCard]]  # language → card list


# ── SOCRATES Slot Templates ───────────────────────────────────────────────────

SOCRATES_TEMPLATES: list[SlotTemplate] = [
    SlotTemplate(
        slot_id="site",
        track="socrates",
        priority_tier=1,
        question_templates={
            "hi": "आपको कहाँ तकलीफ हो रही है?",
            "mr": "तुम्हाला कुठे त्रास होत आहे?",
            "gu": "તમને ક્યાં તકલીફ છે?",
            "en": "Where are you experiencing discomfort?",
        },
        touch_cards={
            "hi": [
                TouchCard("सिर", "head", "icon_head"),
                TouchCard("छाती", "chest/precordial", "icon_chest"),
                TouchCard("पेट", "abdomen/epigastric", "icon_abdomen"),
                TouchCard("हाथ-पैर", "limbs", "icon_limbs"),
            ],
            "mr": [
                TouchCard("डोके", "head", "icon_head"),
                TouchCard("छाती", "chest/precordial", "icon_chest"),
                TouchCard("पोट", "abdomen/epigastric", "icon_abdomen"),
                TouchCard("हातपाय", "limbs", "icon_limbs"),
            ],
            "en": [
                TouchCard("Head", "head", "icon_head"),
                TouchCard("Chest", "chest/precordial", "icon_chest"),
                TouchCard("Abdomen", "abdomen/epigastric", "icon_abdomen"),
                TouchCard("Limbs", "limbs", "icon_limbs"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="character",
        track="socrates",
        priority_tier=1,
        question_templates={
            "hi": "दर्द कैसा है — जलन, दबाव, चुभन, या भारीपन?",
            "mr": "वेदना कशी आहे — जळजळ, दाब, टोचणे किंवा जडपणा?",
            "gu": "દુઃખાવો કેવો છે — બળતરા, દબાણ, ટોંચ, કે ભારીપન?",
            "en": "How does the pain feel — burning, pressure, stabbing, or heaviness?",
        },
        touch_cards={
            "hi": [
                TouchCard("जलन", "burning", "icon_burn"),
                TouchCard("दबाव/कुचलन", "crushing/pressure", "icon_pressure"),
                TouchCard("चुभन", "stabbing/sharp", "icon_stab"),
                TouchCard("भारीपन", "heaviness/dull", "icon_heavy"),
            ],
            "mr": [
                TouchCard("जळजळ", "burning", "icon_burn"),
                TouchCard("दाब/जड", "crushing/pressure", "icon_pressure"),
                TouchCard("टोचणे", "stabbing/sharp", "icon_stab"),
                TouchCard("जडपणा", "heaviness/dull", "icon_heavy"),
            ],
            "en": [
                TouchCard("Burning", "burning", "icon_burn"),
                TouchCard("Crushing/Pressure", "crushing/pressure", "icon_pressure"),
                TouchCard("Stabbing/Sharp", "stabbing/sharp", "icon_stab"),
                TouchCard("Heavy/Dull", "heaviness/dull", "icon_heavy"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="radiation",
        track="socrates",
        priority_tier=1,
        question_templates={
            "hi": "क्या दर्द कहीं और फैलता है — जैसे बाएं हाथ, जबड़े, या पीठ में?",
            "mr": "वेदना दुसरीकडे पसरते का — जसे डाव्या हाताला, जबड्याला किंवा पाठीला?",
            "gu": "શું દુઃખાવો બીજે ફેલાય છે — જેમ કે ડાબા હાથ, જડબા, કે પીઠ?",
            "en": "Does the pain spread anywhere — like the left arm, jaw, or back?",
        },
        touch_cards={
            "hi": [
                TouchCard("बाएं हाथ में", "left arm", "icon_arm_left"),
                TouchCard("जबड़े में", "jaw", "icon_jaw"),
                TouchCard("पीठ में", "back", "icon_back"),
                TouchCard("कहीं नहीं फैलता", "none", "icon_none"),
            ],
            "mr": [
                TouchCard("डाव्या हाताला", "left arm", "icon_arm_left"),
                TouchCard("जबड्याला", "jaw", "icon_jaw"),
                TouchCard("पाठीला", "back", "icon_back"),
                TouchCard("कुठेही नाही", "none", "icon_none"),
            ],
            "en": [
                TouchCard("Left arm", "left arm", "icon_arm_left"),
                TouchCard("Jaw/Neck", "jaw", "icon_jaw"),
                TouchCard("Back", "back", "icon_back"),
                TouchCard("Does not spread", "none", "icon_none"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="onset",
        track="socrates",
        priority_tier=2,
        question_templates={
            "hi": "यह तकलीफ कब से है — आज से, कुछ दिनों से, या हफ्तों से?",
            "mr": "हा त्रास कधापासून आहे — आजपासून, काही दिवसांपासून, किंवा आठवड्यांपासून?",
            "gu": "આ તકલીફ ક્યારથી છે — આજથી, થોડા દિવસોથી, કે અઠવાડિયાઓથી?",
            "en": "How long have you had this — since today, a few days, or weeks?",
        },
        touch_cards={
            "hi": [
                TouchCard("आज शुरू हुआ", "acute onset - today", "icon_today"),
                TouchCard("2-3 दिन से", "2-3 days", "icon_days"),
                TouchCard("1-2 हफ्ते से", "1-2 weeks", "icon_weeks"),
                TouchCard("महीनों से", "chronic - months", "icon_months"),
            ],
            "mr": [
                TouchCard("आज सुरू", "acute onset - today", "icon_today"),
                TouchCard("2-3 दिवसांपासून", "2-3 days", "icon_days"),
                TouchCard("1-2 आठवड्यांपासून", "1-2 weeks", "icon_weeks"),
                TouchCard("महिन्यांपासून", "chronic - months", "icon_months"),
            ],
            "en": [
                TouchCard("Started today", "acute onset - today", "icon_today"),
                TouchCard("2-3 days", "2-3 days", "icon_days"),
                TouchCard("1-2 weeks", "1-2 weeks", "icon_weeks"),
                TouchCard("Months/Chronic", "chronic - months", "icon_months"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="severity",
        track="socrates",
        priority_tier=2,
        question_templates={
            "hi": "10 में से कितना दर्द है? 1 = हल्का, 10 = असहनीय।",
            "mr": "10 पैकी किती वेदना आहे? 1 = हलकी, 10 = असह्य.",
            "gu": "10 માંથી કેટલો દુઃખાવો છે? 1 = હળવો, 10 = અસહ્ય.",
            "en": "On a scale of 1 to 10, how severe is the pain? 1=mild, 10=unbearable.",
        },
        touch_cards={
            "hi": [
                TouchCard("1-3 (हल्का)", "3", "icon_pain_low"),
                TouchCard("4-6 (मध्यम)", "6", "icon_pain_mid"),
                TouchCard("7-8 (तीव्र)", "8", "icon_pain_high"),
                TouchCard("9-10 (असहनीय)", "10", "icon_pain_max"),
            ],
            "mr": [
                TouchCard("1-3 (हलकी)", "3", "icon_pain_low"),
                TouchCard("4-6 (मध्यम)", "6", "icon_pain_mid"),
                TouchCard("7-8 (तीव्र)", "8", "icon_pain_high"),
                TouchCard("9-10 (असह्य)", "10", "icon_pain_max"),
            ],
            "en": [
                TouchCard("1-3 (Mild)", "3", "icon_pain_low"),
                TouchCard("4-6 (Moderate)", "6", "icon_pain_mid"),
                TouchCard("7-8 (Severe)", "8", "icon_pain_high"),
                TouchCard("9-10 (Unbearable)", "10", "icon_pain_max"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="associations",
        track="socrates",
        priority_tier=2,
        question_templates={
            "hi": "क्या साथ में कोई और तकलीफ है — जैसे उल्टी, सांस फूलना, या पसीना?",
            "mr": "सोबत इतर काही त्रास आहे का — जसे उलटी, श्वास लागणे, किंवा घाम?",
            "gu": "સાથે બીજી કોઈ તકલીફ છે — જેમ ઉલ્ટી, શ્વાસ ચડવો, કે પરસેવો?",
            "en": "Any other symptoms — like nausea, breathlessness, or sweating?",
        },
        touch_cards={
            "hi": [
                TouchCard("उल्टी/मतली", "nausea/vomiting", "icon_nausea"),
                TouchCard("सांस फूलना", "dyspnoea/breathlessness", "icon_breath"),
                TouchCard("पसीना", "diaphoresis/sweating", "icon_sweat"),
                TouchCard("कोई नहीं", "none", "icon_none"),
            ],
            "mr": [
                TouchCard("उलटी/मळमळ", "nausea/vomiting", "icon_nausea"),
                TouchCard("श्वास लागणे", "dyspnoea/breathlessness", "icon_breath"),
                TouchCard("घाम येणे", "diaphoresis/sweating", "icon_sweat"),
                TouchCard("काहीही नाही", "none", "icon_none"),
            ],
            "en": [
                TouchCard("Nausea/Vomiting", "nausea/vomiting", "icon_nausea"),
                TouchCard("Breathlessness", "dyspnoea/breathlessness", "icon_breath"),
                TouchCard("Sweating", "diaphoresis/sweating", "icon_sweat"),
                TouchCard("None", "none", "icon_none"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="time_course",
        track="socrates",
        priority_tier=2,
        question_templates={
            "hi": "दर्द हमेशा रहता है या आता-जाता है?",
            "mr": "वेदना नेहमी असते की येते-जाते?",
            "gu": "દુઃખાવો હંમેશ રહે છે કે આવ-જા કરે છે?",
            "en": "Is the pain constant or does it come and go?",
        },
        touch_cards={
            "hi": [
                TouchCard("हमेशा रहता है", "constant", "icon_constant"),
                TouchCard("आता-जाता है", "intermittent", "icon_intermittent"),
                TouchCard("धीरे-धीरे बढ़ रहा है", "progressive", "icon_progressive"),
            ],
            "mr": [
                TouchCard("नेहमी असते", "constant", "icon_constant"),
                TouchCard("येते-जाते", "intermittent", "icon_intermittent"),
                TouchCard("हळूहळू वाढत आहे", "progressive", "icon_progressive"),
            ],
            "en": [
                TouchCard("Constant", "constant", "icon_constant"),
                TouchCard("Comes and goes", "intermittent", "icon_intermittent"),
                TouchCard("Getting worse", "progressive", "icon_progressive"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="exacerbating",
        track="socrates",
        priority_tier=2,
        question_templates={
            "hi": "कौन सी चीज दर्द बढ़ाती है — खाना, व्यायाम, या लेटना?",
            "mr": "कशाने वेदना वाढते — जेवण, व्यायाम, किंवा झोपणे?",
            "gu": "શાથી દુઃખાવો વધે — ખાવું, કસરત, કે સૂવું?",
            "en": "What makes it worse — eating, exertion, or lying down?",
        },
        touch_cards={
            "hi": [
                TouchCard("खाने से", "eating/food", "icon_food"),
                TouchCard("चलने/कसरत से", "exertion/walking", "icon_walk"),
                TouchCard("लेटने से", "lying down", "icon_lie"),
                TouchCard("कुछ नहीं बढ़ाता", "none identified", "icon_none"),
            ],
            "mr": [
                TouchCard("जेवणाने", "eating/food", "icon_food"),
                TouchCard("चालण्याने/व्यायामाने", "exertion/walking", "icon_walk"),
                TouchCard("झोपल्याने", "lying down", "icon_lie"),
                TouchCard("काहीच नाही", "none identified", "icon_none"),
            ],
            "en": [
                TouchCard("Eating", "eating/food", "icon_food"),
                TouchCard("Walking/Exertion", "exertion/walking", "icon_walk"),
                TouchCard("Lying down", "lying down", "icon_lie"),
                TouchCard("Nothing specific", "none identified", "icon_none"),
            ],
        },
    ),
]

# ── Ayush Core-4 Slot Templates ───────────────────────────────────────────────

AYUSH_TEMPLATES: list[SlotTemplate] = [
    SlotTemplate(
        slot_id="agni",
        track="ayush",
        priority_tier=3,
        question_templates={
            "hi": "आपकी भूख कैसी है और खाने के बाद कैसा महसूस होता है?",
            "mr": "तुमची भूक कशी आहे आणि जेवल्यानंतर कसे वाटते?",
            "gu": "તમારી ભૂખ કેવી છે અને ખાધા પછી કેવું લાગે છે?",
            "en": "How is your appetite, and how do you feel after eating?",
        },
        touch_cards={
            "hi": [
                TouchCard("भूख कम, खाने के बाद भारीपन", "mandagni - low appetite heavy after eating", "icon_agni_manda"),
                TouchCard("बहुत तेज़ भूख, जलन होती है", "tikshnagni - excessive hunger burning", "icon_agni_tikshna"),
                TouchCard("कभी भूख, कभी नहीं — अनियमित", "vishamagni - irregular hunger", "icon_agni_vishama"),
                TouchCard("सामान्य भूख, अच्छा पाचन", "samagni - normal digestion", "icon_agni_sama"),
            ],
            "mr": [
                TouchCard("भूक कमी, जेवल्यावर जडपणा", "mandagni - low appetite heavy after eating", "icon_agni_manda"),
                TouchCard("खूप भूक, जळजळ होते", "tikshnagni - excessive hunger burning", "icon_agni_tikshna"),
                TouchCard("कधी भूक, कधी नाही", "vishamagni - irregular hunger", "icon_agni_vishama"),
                TouchCard("सामान्य भूक, चांगले पचन", "samagni - normal digestion", "icon_agni_sama"),
            ],
            "en": [
                TouchCard("Low appetite, heavy after meals", "mandagni - low appetite heavy after eating", "icon_agni_manda"),
                TouchCard("Excessive hunger, burning stomach", "tikshnagni - excessive hunger burning", "icon_agni_tikshna"),
                TouchCard("Irregular — sometimes hungry, sometimes not", "vishamagni - irregular hunger", "icon_agni_vishama"),
                TouchCard("Normal hunger, digests well", "samagni - normal digestion", "icon_agni_sama"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="koshtha",
        track="ayush",
        priority_tier=3,
        question_templates={
            "hi": "शौच कैसा होता है — रोज़ नहीं होता, बहुत जल्दी होता है, या सामान्य?",
            "mr": "शौच कसे होते — रोज नाही, खूप लवकर होते, किंवा सामान्य?",
            "gu": "ઝાડો કેવો છે — દરરોજ નહીં, ઘણો ઝડપી, કે સામાન્ય?",
            "en": "How are your bowel movements — irregular/constipated, frequent/loose, or normal?",
        },
        touch_cards={
            "hi": [
                TouchCard("कठोर, कम होता है, ज़ोर लगाना पड़ता है", "krura - constipated hard stools", "icon_koshtha_krura"),
                TouchCard("पतला, जल्दी-जल्दी होता है", "mridu - loose frequent stools", "icon_koshtha_mridu"),
                TouchCard("सामान्य, रोज़ होता है", "madhyama - regular normal", "icon_koshtha_madhyama"),
            ],
            "mr": [
                TouchCard("कठीण, कमी होते, जोर द्यावा लागतो", "krura - constipated hard stools", "icon_koshtha_krura"),
                TouchCard("पातळ, वारंवार होते", "mridu - loose frequent stools", "icon_koshtha_mridu"),
                TouchCard("सामान्य, दररोज होते", "madhyama - regular normal", "icon_koshtha_madhyama"),
            ],
            "en": [
                TouchCard("Hard, straining needed", "krura - constipated hard stools", "icon_koshtha_krura"),
                TouchCard("Loose, frequent", "mridu - loose frequent stools", "icon_koshtha_mridu"),
                TouchCard("Regular, normal", "madhyama - regular normal", "icon_koshtha_madhyama"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="dosha_indicators",
        track="ayush",
        priority_tier=3,
        question_templates={
            "hi": "आप गर्मी ज़्यादा सहते हैं या ठंड? और नींद कैसी है?",
            "mr": "तुम्हाला उष्णता जास्त सहन होते की थंडी? आणि झोप कशी आहे?",
            "gu": "તમે ગરમી વધારે સહો છો કે ઠંડી? અને ઊઘ કેવી છે?",
            "en": "Do you tolerate heat or cold better? And how is your sleep?",
        },
        touch_cards={
            "hi": [
                TouchCard("गर्मी नहीं सहती, जलन होती है", "heat_intolerance burning - pitta", "icon_pitta"),
                TouchCard("ठंड नहीं सहता, हड्डियों में दर्द", "cold_intolerance joint_pain - vata", "icon_vata"),
                TouchCard("भारीपन, नींद ज़्यादा, आलस", "heaviness excessive_sleep lethargy - kapha", "icon_kapha"),
                TouchCard("सामान्य — कोई खास समस्या नहीं", "balanced - no dominance", "icon_balanced"),
            ],
            "en": [
                TouchCard("Cannot tolerate heat, burning sensations", "heat_intolerance burning - pitta", "icon_pitta"),
                TouchCard("Cannot tolerate cold, joint pains", "cold_intolerance joint_pain - vata", "icon_vata"),
                TouchCard("Heaviness, excess sleep, lethargy", "heaviness excessive_sleep lethargy - kapha", "icon_kapha"),
                TouchCard("Balanced — no major issues", "balanced - no dominance", "icon_balanced"),
            ],
        },
    ),
    SlotTemplate(
        slot_id="ahara_vihara",
        track="ayush",
        priority_tier=3,
        question_templates={
            "hi": "खाने में क्या पसंद है — तीखा, मीठा, या ठंडा? और कसरत कितनी करते हैं?",
            "mr": "जेवणात काय आवडते — तिखट, गोड, किंवा थंड? आणि व्यायाम किती करता?",
            "en": "What food do you prefer — spicy, sweet, or cold? And how much do you exercise?",
        },
        touch_cards={
            "hi": [
                TouchCard("तीखा और तला हुआ पसंद", "spicy_fried_preference - pitta_kapha", "icon_spicy"),
                TouchCard("मीठा और ठंडा पसंद", "sweet_cold_preference - kapha", "icon_sweet"),
                TouchCard("हल्का और गर्म पसंद", "light_warm_preference - vata", "icon_light"),
                TouchCard("कोई खास पसंद नहीं", "no_preference", "icon_neutral"),
            ],
            "en": [
                TouchCard("Prefer spicy/fried", "spicy_fried_preference - pitta_kapha", "icon_spicy"),
                TouchCard("Prefer sweet/cold", "sweet_cold_preference - kapha", "icon_sweet"),
                TouchCard("Prefer light/warm", "light_warm_preference - vata", "icon_light"),
                TouchCard("No strong preference", "no_preference", "icon_neutral"),
            ],
        },
    ),
]

# ── Unified Slot Lookup ───────────────────────────────────────────────────────

ALL_TEMPLATES: dict[str, SlotTemplate] = {
    t.slot_id: t for t in SOCRATES_TEMPLATES + AYUSH_TEMPLATES
}


def get_template(slot_id: str) -> SlotTemplate | None:
    return ALL_TEMPLATES.get(slot_id)


def get_touch_cards(slot_id: str, language: str) -> list[dict]:
    """Return touch card dicts for a given slot and language."""
    tmpl = get_template(slot_id)
    if not tmpl:
        return []
    lang = language if language in tmpl.touch_cards else "en"
    return [
        {"label": c.label, "value": c.value, "icon_key": c.icon_key}
        for c in tmpl.touch_cards[lang]
    ]


def get_question_text(slot_id: str, language: str) -> str:
    """Return fallback question text for a given slot and language."""
    tmpl = get_template(slot_id)
    if not tmpl:
        return "Please tell me more."
    lang = language if language in tmpl.question_templates else "en"
    return tmpl.question_templates[lang]
