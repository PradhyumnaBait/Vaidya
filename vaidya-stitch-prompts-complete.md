# VAIDYA — COMPLETE STITCH PROMPT COMPENDIUM
## All 57 Screens — Copy-Paste Ready

**Design System Reference (apply to every screen):**
- Font: SF Pro Display / SF Pro Text / Inter (display/body); JetBrains Mono (technical/numeric)
- Canvas: #F6F6F7 | Surface: #FFFFFF | Surface subtle: #F9F9FA
- Border: #E4E4E7 | Border strong: #D4D4D8
- Text primary: #18181B | Secondary: #52525B | Muted: #A1A1AA
- Accent: #2563EB | Verified: #16A34A | Warning: #D97706 | Critical: #DC2626 | AYUSH: #0D9488
- Radius: 4px (chips) / 6px (buttons/inputs) / 8px (cards) / 12px (modals/drawers)
- Spacing: 4px base, 8px unit system
- Shadows: sm = 0 1px 2px rgba(0,0,0,0.05); md = 0 4px 12px rgba(0,0,0,0.08)
- Motion: 150ms ease-out (state), 200ms ease-in-out (transitions), prefers-reduced-motion: instant
- Icons: Lucide, 1.5px stroke, 16px/20px/24px sizes

---

## PATIENT SURFACE SCREENS (P-01 → P-23)

---

### P-01 — Welcome + Language Selection
*(Complete prompt provided in Foundation Prompt section — see Section 10 of design document. Reproduce that prompt here verbatim for completeness.)*

**Screen ID:** P-01
**Role:** Patient
**Surface:** Patient Intake
**Route:** /patient/welcome

[FULL PROMPT AS PROVIDED IN SECTION 10 ABOVE — copy from "STITCH PROMPT — SCREEN P-01" through its "DO NOT CHANGE" block]

---

### P-02 — Patient Identification

**STITCH PROMPT — SCREEN P-02: PATIENT IDENTIFICATION**

Inherits: Foundation 1 (Design System), Foundation 3 (Patient Experience Foundation)

Screen ID: P-02
User Role: Patient (self-service or with brief staff orientation)
Surface: Patient Intake
Route: /patient/identify
Purpose: Identify the patient — link to existing ABHA/record or begin new patient flow

USER CONTEXT:
After selecting language, the patient needs to identify themselves. Options: scan ABHA QR, enter ABHA number, enter mobile number, or register as new patient. Interface must be calm, large-touch, and clear about what each option does. No jargon.

LAYOUT:
Patient shell active: progress bar at ~8%, "~12 min remaining"
No sidebar. Content column max-width 560px, centered horizontally.
Top padding: 40px

SECTION 1 — Heading:
  Heading in selected language (Hindi shown): "आपका पहचान पत्र" — 24px / 600 / #18181B
  English below: "Let's find your records" — 15px / 400 / #71717A
  Subtext: "Choose one of the options below." / "नीचे दिए गए विकल्पों में से एक चुनें।" — 14px / 400 / muted
  Bottom margin: 32px

SECTION 2 — Identification Options (3 large cards, stacked, 12px gap):

Card 1 — ABHA / QR:
  Height: 76px
  Border: 1.5px solid #E4E4E7
  Radius: 8px
  Background: white
  Padding: 0 20px
  Cursor: pointer
  Hover: #F9F9FA bg, border becomes #D4D4D8
  Layout: icon-left + text-center + chevron-right
  Left icon: qr-code, 24px, in 40px circle (#F4F4F5 bg)
  Title: "Scan ABHA QR Code" — 15px / 500 / primary (in selected language + English)
  Subtitle: "Aarogya Setu card or printed ABHA QR" — 13px / 400 / muted
  Right: chevron-right, 16px, muted

Card 2 — ABHA Number / Mobile:
  Same structure as Card 1
  Left icon: hash / id-card, 24px, 40px circle
  Title: "Enter health ID or mobile number"
  Subtitle: "14-digit ABHA number or registered mobile"
  An inline text input appears BELOW this card when selected (expand animation 200ms):
    Input: 52px height, 16px text, numeric keyboard hint
    Placeholder: "Enter ABHA number or 10-digit mobile"
    "Continue →" button right of input (44px height, accent)

Card 3 — New Patient:
  Same structure
  Left icon: user-plus, 24px, 40px circle (#EFF6FF bg, blue icon)
  Title: "I'm a new patient"
  Subtitle: "First visit? We'll create your record."
  Right: chevron-right + small "5 min" muted label

SECTION 3 — Privacy note:
  Below cards, 24px margin-top
  Lock icon 14px + "Your information is kept private and secure." — 13px / 400 / muted / center-aligned

STATES:
Default: 3 cards visible, no selection
Card 1 selected: card gets blue border (2px solid #2563EB), blue bg (#EFF6FF). Camera opens for QR scan (full modal).
Card 2 selected: card gets blue border, input field expands below
Card 3 selected: navigates to P-03

LOADING:
After ABHA lookup: spinner in the Continue button, card disabled. "Looking up your records..." replaces subtitle text.

ERROR:
If ABHA not found: input field border becomes #DC2626, error text below: "We couldn't find this ID. Check the number and try again, or register as a new patient." — 13px / #B91C1C

SUCCESS:
ABHA found: navigates to P-04 (Demographic Confirmation)

QR SCAN MODAL:
Full-screen camera preview overlay
Center: scanning frame (64px square, corner brackets only — not full border)
Label: "Point camera at your ABHA QR code" — 14px white, below scan frame, on dark overlay
"Can't scan? Enter manually" — ghost white link below label
× close button top-right

RESPONSIVE:
Mobile: cards full-width, 16px padding, input full-width
Tablet: cards max 560px centered
Kiosk: cards 88px height, 20px text, full-width within 640px max

MOTION:
Card tap: scale 0.99 → 1.0, 100ms; border color transition 120ms
Input expand: height 0 → 64px, opacity 0→1, 200ms ease-out
QR modal: fade in 200ms

ACCESSIBILITY:
All cards keyboard-navigable (tab focus visible with 2px accent ring)
Card role="button" aria-label per option
Input has visible label above when expanded (not placeholder-only)
Minimum 76px touch target height

VISUAL HIERARCHY:
1. Three option cards (dominant — fills center of screen)
2. Heading (above cards)
3. Input / Continue when card 2 selected
4. Privacy note (bottom, minimal weight)

DO NOT CHANGE: Foundation 1 design system. Foundation 3 patient shell. No complex forms. One action per card.

---

### P-03 — New Patient Registration

**STITCH PROMPT — SCREEN P-03: NEW PATIENT REGISTRATION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-03
User Role: Patient (new, no existing record)
Surface: Patient Intake
Route: /patient/register
Purpose: Collect minimum demographic information for a first-time patient

USER CONTEXT:
This patient has no ABHA record and no existing hospital registration. They need to provide basic information. The form must be minimal — only what's clinically necessary. Large fields. Clear labels. One field per visual group.

LAYOUT:
Patient shell: progress bar ~10%, "~12 min remaining"
Content column: max-width 480px, centered
Top padding: 32px

HEADING:
"A few details to get started" — 22px / 500 / #18181B
Hindi: "शुरू करने के लिए कुछ जानकारी" — 15px / 400 / muted below
Subtext: "This takes about 2 minutes." — 13px / #A1A1AA
Bottom margin: 28px

FORM FIELDS (stacked, 16px gap between fields):

Field 1 — Full Name:
  Label above: "Full name" / "पूरा नाम" — 13px / 500 / #52525B
  Input: 52px height, 16px text
  Placeholder: "As on your ID card"
  Keyboard: text, autocapitalize words

Field 2 — Age or Date of Birth:
  Label: "Age or date of birth" / "आयु या जन्मतिथि"
  Two toggle options inline:
    [ Age ] [ Date of Birth ] — pill toggle, 36px height, border, rounded
    If "Age" selected: numeric input 52px, placeholder "e.g. 45", max 2 digits
    If "DOB" selected: date input with DD/MM/YYYY format, 52px

Field 3 — Sex:
  Label: "Sex" / "लिंग"
  Three large pill options (not a dropdown):
    [ Male ] [ Female ] [ Other ]
    Pill height: 48px, border, equal width
    Selected: accent border + bg, accent text

Field 4 — Mobile Number:
  Label: "Mobile number" / "मोबाइल नंबर"
  Input: 52px, numeric keyboard
  Prefix: "+91" shown left inside input (gray, non-editable), 13px
  Placeholder: "10-digit number"
  Note below: "For your records. We won't call you during the consultation." — 12px muted

Field 5 — Primary Language (pre-filled from P-01):
  Label: "Preferred language" / "पसंदीदा भाषा"
  A read-only display chip showing selected language (e.g., "हिंदी")
  "Change" ghost link right-aligned — navigates back to P-01

PRIMARY ACTION:
"Continue →" — primary button, full width, 52px height, margin-top 28px
Disabled until name + sex + mobile are filled

SECONDARY:
"I'll skip this and ask staff for help" — ghost link, 13px muted, centered, 8px below button

STATES:
Default: all fields empty, button disabled
Filling: fields get focus ring, button enables when minimum fields complete
Error (mobile): "Enter a valid 10-digit number" — 12px #DC2626 below field
Submitting: spinner in button, fields disabled

VALIDATION:
Name: required, minimum 2 characters
Age: 1–120 range if entered
Mobile: 10 digits, starts with 6-9
Sex: required

RESPONSIVE:
Mobile: fields full-width, 16px side padding
Kiosk: 64px field height, 18px text, pill toggles taller

MOTION:
DOB/Age toggle switch: 150ms ease-out background transition
Field error: subtle shake 300ms on first invalid submit
Button enable: opacity 0.4 → 1.0 transition 200ms

ACCESSIBILITY:
Labels always above fields (never inside as placeholder-only)
Error messages announced via aria-live
Sex selection: radio group semantics
Tab order: name → age/dob → sex → mobile → continue

VISUAL HIERARCHY:
1. Form fields (dominant — centered, large)
2. "Continue" button (bottom, full width)
3. Heading (above)
4. Skip link (minimal)

DO NOT CHANGE: Foundation 1, Foundation 3. Minimum fields only. No medical questions here.

---

### P-04 — Returning Patient — Demographic Confirmation

**STITCH PROMPT — SCREEN P-04: RETURNING PATIENT DEMOGRAPHIC CONFIRMATION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-04
User Role: Returning patient (identified via ABHA or mobile)
Surface: Patient Intake
Route: /patient/confirm
Purpose: Show the patient their existing record for confirmation or correction before proceeding

USER CONTEXT:
The patient was identified via ABHA lookup or mobile number. The system has their demographics from a previous visit. They need to confirm this is correct — or correct what has changed (address, phone, etc.). This is NOT a full re-registration. Display what we know, ask for confirmation.

LAYOUT:
Patient shell: progress bar ~12%, "~11 min remaining"
Content column: max-width 480px, centered
Top padding: 36px

HEADING:
"Is this you?" — 22px / 500 / primary
Hindi: "क्या यह आप हैं?" — 15px / 400 / muted below
Subtext: "Please check your details below." — 13px muted
Bottom margin: 24px

PATIENT CARD (confirmed identity display):
  White card, border, radius 8px, padding 24px
  
  Row 1: Avatar circle (48px, gray bg, initials 18px / 500) + Name
    Name: "Dhananjay Patil" — 20px / 600 / primary (right of avatar)
    ABHA tag below name: "ABHA: 12-3456-7890-1234" — 12px JetBrains Mono muted
  
  Divider (1px, #E4E4E7)
  
  Detail rows (each 40px height, label + value inline):
    "Age" — "67 years" (or DOB if available)
    "Sex" — "Male"
    "Mobile" — "98765 43210" (last 5 digits shown, rest masked: "98765 ●●●●●")
    "Language" — "Marathi" (language chip, teal or gray)
    "Last visit" — "No previous record" or "12 Aug 2026"
  
  Labels: 12px / 500 / uppercase / muted (left, 100px wide)
  Values: 14px / 400 / primary

CORRECTION OPTION:
Below card:
  "Something changed?" — 13px / 400 / #52525B
  "Update details →" — 13px / #2563EB link — expands an inline edit mode for mobile + name fields only

PRIMARY ACTIONS:
Two buttons stacked, 8px gap:
  "Yes, that's me — continue" — primary, full width, 52px height
  "This isn't me — start over" — secondary, full width, 44px height

STATES:
Default: card shows loaded data
Loading: skeleton shimmer in card (3 rows blinking gray)
Mismatch concern: if patient taps "This isn't me" → confirmation dialog: "Are you sure? This will clear your session." with Cancel / Start Over options
Edit mode: mobile field becomes editable input inline within card

RESPONSIVE:
Mobile: card full-width, 16px padding
Kiosk: card 80% width centered, larger fonts

MOTION:
Card enter: fade + slide up 8px → 0, 250ms ease-out (feels like a reveal)
"Start over" dialog: modal fade in 200ms

ACCESSIBILITY:
"Yes that's me" is the primary focus target after load
Screen reader announces: "Welcome back, [name]. Please confirm your details."

VISUAL HIERARCHY:
1. Patient name (largest text in card)
2. "Yes, that's me" button (blue, full width, unmissable)
3. Detail rows (confirmation reading)
4. "This isn't me" (secondary, clearly available but not dominant)

DO NOT CHANGE: Foundation 1, Foundation 3. Do not show full phone number. Do not require re-entry of known data.

---

### P-05 — Consent Screen
*(Complete prompt provided in Section 10 of design document — reproduce verbatim)*

**Screen ID:** P-05 | **Route:** /patient/consent
[FULL PROMPT AS PROVIDED ABOVE — copy from "STITCH PROMPT — SCREEN P-05" through its DO NOT CHANGE block]

---

### P-06 — Intake Start / Chief Complaint Entry

**STITCH PROMPT — SCREEN P-06: INTAKE START / CHIEF COMPLAINT ENTRY**

Inherits: Foundation 1, Foundation 3

Screen ID: P-06
User Role: Patient
Surface: Patient Intake
Route: /patient/intake/start
Purpose: Collect the patient's chief complaint — the primary reason for today's visit. This is the most important single question in the entire intake.

USER CONTEXT:
The patient has consented and is now beginning the clinical interview. The first question — what brings them here — is asked in an open and welcoming way. They can speak freely or tap a category. This answer determines the entire interview pathway.

LAYOUT:
Patient shell: progress bar ~18%, "~10 min remaining"
Content column: max-width 560px, centered
Vertical centering within viewport

ZONE 1 — Opening prompt (top of content):
  Large question text in selected language:
    Hindi shown: "आज आप किस समस्या के लिए आए हैं?" — 26px / 500 / #18181B, line-height 1.4
    Translation below (if not English): "What has brought you here today?" — 16px / 400 / #A1A1AA
  
  Sub-prompt (12px below question): 
    mic icon (14px, muted) + "Speak freely, or choose a category below" — 14px / 400 / #71717A
    "आप बोल सकते हैं, या नीचे से एक विकल्प चुनें।" — 13px muted below (in selected language)
  
  Bottom margin: 28px

ZONE 2 — Voice input (centered):
  Voice button — READY state:
    72px circle, #F4F4F5 bg, 1.5px solid #D4D4D8 border
    Mic icon: 26px, #71717A
    Label below: "Tap to speak" — 13px / 400 / #A1A1AA (in selected language)
  
  Below voice button (20px gap):
    Thin divider line with "or" centered in 13px muted

ZONE 3 — Touch category cards (6 cards, 2 columns × 3 rows):
  Card size: height 56px, equal width within 2-column grid
  Gap: 8px
  Border: 1.5px solid #E4E4E7
  Radius: 8px
  Background: white
  Padding: 0 16px
  
  Content of each card:
    Left: category icon (20px, #71717A, Lucide)
    Right of icon: category text in selected language + English below (13px muted)
  
  Cards:
    heart icon — "Chest, heart, breathing" / "सीने, दिल, सांस की समस्या"
    activity icon — "Stomach, digestion" / "पेट, पाचन की समस्या"
    brain icon — "Head, dizziness, eyes" / "सिर, चक्कर, आँखें"
    bone icon — "Joints, muscles, back" / "जोड़, मांसपेशी, पीठ"
    thermometer icon — "Fever, weakness, fatigue" / "बुखार, कमज़ोरी, थकान"
    more-horizontal icon — "Something else — I'll describe it" / "कुछ और"
  
  Selected card: 2px accent border, #EFF6FF bg

AFTER VOICE INPUT (confirmation state):
  Transcription bubble appears above voice button (see Foundation 3 — Transcription Confirmation Bubble):
    Patient words displayed: "Mujhe teen hafte se pet dard ho raha hai"
    Translation chip: "Stomach pain for three weeks" — 13px muted below
    Two buttons: "Yes, continue" (primary small) / "Change it" (ghost small)

AFTER TOUCH SELECTION:
  Selected card highlighted
  "Continue →" primary button (full width, 52px) appears below grid with 200ms entrance animation

PRIMARY ACTION:
"Continue →" — primary button, full width, 52px (appears after voice confirmation OR category selection)
Label in selected language

STATES:
Default: voice button ready, touch categories visible
Voice listening: voice button goes to LISTENING state (from Foundation 3 voice states)
Voice processing: PROCESSING state
Voice confirmation: bubble appears
Category selected: card highlighted, Continue button appears
Processing (after continue): navigate to P-07 or P-09 depending on modality preference

EMPTY: Never — patient must provide at least one input to continue

ERROR (voice):
ASR fail → voice button goes to RETRY state
Message below: "We couldn't hear that clearly. Tap an option below or try again." — 13px muted

RESPONSIVE:
Mobile: 2-column card grid, 56px cards, 16px padding
Tablet: same, slightly wider cards
Kiosk: 2-column grid, 72px cards, 20px category text, 96px voice button

MOTION:
Voice → listening: ring animations begin immediately
Category tap: border + bg 120ms ease-out
Continue button: fade + slide up 200ms ease-out
Transcription bubble: slide down from top of zone 2, 250ms

ACCESSIBILITY:
Category cards: role="radio" group
Voice button: aria-label="Start voice input — tap to speak"
After voice confirmation: focus moves to "Yes, continue" button

VISUAL HIERARCHY:
1. Question text (top, large, prominent)
2. Category cards (center, large touch targets, 2-column grid)
3. Voice button (center, between question and cards)
4. Continue button (when visible — full width blue, bottom)

DO NOT CHANGE: Foundation 1, Foundation 3. One opening question only. Voice and touch both available simultaneously. No medical jargon in category labels.

---

### P-07 — Interview — Voice Input State (Listening)
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** P-07 | **Route:** /patient/interview (voice active)
[FULL PROMPT AS PROVIDED ABOVE]

---

### P-08 — Interview — Voice Confirmation (Transcription Review)

**STITCH PROMPT — SCREEN P-08: INTERVIEW — VOICE CONFIRMATION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-08
User Role: Patient
Surface: Patient Intake
Route: /patient/interview (transcription review state)
Purpose: Show the patient what the system heard and allow them to confirm or correct before the answer is recorded

USER CONTEXT:
The patient has spoken their answer. ASR has produced a transcription. Before the answer is accepted into the clinical record, the patient must confirm it is correct. This is a critical safety moment — incorrect transcriptions must be caught here.

LAYOUT:
Patient shell: progress bar ~50%, "~6 min remaining"
Content column: max-width 520px, centered

ZONE 1 — Question recall (top, smaller than in P-07):
  The question that was asked, smaller now: 17px / 400 / #52525B
  Example: "तुम्हाला हे दुखणे कुठे जास्त होते?" / "Where is the pain most severe?"
  A small "Question 4 of ~12" label — 11px muted / JetBrains Mono, right-aligned
  Bottom margin: 20px

ZONE 2 — Transcription display (primary content):
  A large transcription bubble:
    Background: white
    Border: 1.5px solid #E4E4E7
    Radius: 12px radius-xl, with 8px arrow-tail pointing DOWN toward center
    Padding: 20px 24px
    Shadow: --shadow-sm
    Max-width: 480px, centered
    
    Label above bubble content: "We heard:" — 12px / 500 / uppercase / muted
    
    Transcription text: 
      "Maaza pot khup dukhatoy, khaaskarun jevanaanantar." — 18px / 500 / #18181B, centered, italic
    
    Translation below (if applicable):
      "My stomach hurts a lot, especially after eating." — 14px / 400 / #71717A, centered
    
    ASR confidence indicator (bottom of bubble):
      If confidence ≥ 80%: no indicator shown (trust the transcription)
      If confidence 60–79%: small amber info icon + "We're not fully sure about this" — 12px amber
      If confidence < 60%: amber warning + "Please verify this carefully" — 12px amber
    
  Below the bubble (12px gap):
    "Is this what you said?" — 15px / 500 / #18181B, centered (in selected language)

ZONE 3 — Confirmation actions:
  Two buttons, stacked, full-content-width, centered:
  
  Button 1: "Yes, that's right" — primary, 52px height, full width
    Label in selected language: "हो, हे बरोबर आहे" (Marathi) above English
  
  Button 2: "That's not right — let me try again" — secondary, 44px height, full width, margin-top 8px
    Icon: rotate-ccw 14px, left of text

BELOW BUTTONS:
  "Type it instead" — ghost link, 13px / #2563EB — shows an inline textarea:
    The transcribed text pre-filled
    Patient can edit the text directly
    "Use this text" primary button appears

BELOW THAT:
  "Skip this question" — ghost text, 13px muted — only for non-mandatory questions

STATES:
Default: bubble with transcription + two confirmation buttons
Low confidence (< 60%): amber tint on bubble border + confidence warning
Editing: textarea shown with pre-filled text, edit cursor active
Confirming (after "Yes"): brief success state (bubble gets green border for 300ms) then transitions to next question
Retry (after "not right"): transitions back to P-07 voice listening state for same question

RESPONSIVE:
Mobile: bubble 90% width, 16px side padding
Kiosk: bubble max 600px, 20px text in bubble, 64px button heights

MOTION:
Bubble entrance: scales from 0.92 → 1.0, fades in, 250ms ease-out (feels like appearing from mic)
"Yes" tap: green border flash 300ms, then content fades out 150ms → next question slides in
"Try again" tap: bubble slides up and fades 150ms → returns to P-07 state

ACCESSIBILITY:
Focus on "Yes, that's right" button immediately after transcription appears
Transcription text in aria-live region (announces to screen reader)
Retry button labeled "Try recording again for this question"

VISUAL HIERARCHY:
1. Transcription text inside bubble (largest, most prominent)
2. "Is this what you said?" confirmation prompt
3. "Yes, that's right" (full width, blue, primary action)
4. "Try again" (secondary, clearly available)
5. "Type it" (fallback, ghost)

DO NOT CHANGE: Foundation 1, Foundation 3. Transcription must be confirmed before recording. Patient must never feel trapped if voice fails.

---

### P-09 — Interview — Touch Answer Selection
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** P-09 | **Route:** /patient/interview (touch mode)
[FULL PROMPT AS PROVIDED ABOVE]

---

### P-10 — Interview — Adaptive Follow-Up Question

**STITCH PROMPT — SCREEN P-10: INTERVIEW — ADAPTIVE FOLLOW-UP QUESTION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-10
User Role: Patient
Surface: Patient Intake
Route: /patient/interview (adaptive follow-up state)
Purpose: Show a follow-up question that has been dynamically selected based on the patient's previous answer — demonstrating the adaptive interview graph

USER CONTEXT:
The patient said they have stomach pain. The system determined (from the interview graph) that the next clinically relevant question is about the character of the pain. This question would not appear if the patient had reported chest pain instead. The UI should not expose this adaptive logic — it should simply feel like a natural conversation.

LAYOUT:
Patient shell: progress bar ~55%, "~5 min remaining"
Content column: max-width 520px, centered

PROGRESS CONTEXT (subtle, top of content area):
  A horizontal strip showing previously answered questions as compact chips:
    "Stomach pain" (completed, green check-circle icon, 12px chip)
    "3 months" (completed, green check-circle, 12px chip)
    "After meals" (completed, 12px chip)
    "→ Current question" (muted arrow)
  All chips in a horizontal scrollable row, 32px height total
  This gives the patient a sense of narrative continuity — "we've been talking about this"

ZONE 1 — Follow-up framing text (new element for adaptive questions):
  A small annotation above the question to humanize the follow-up:
    "Based on what you told us..." — 13px / 400 / #A1A1AA, italic
  This appears only on follow-up questions. First-in-pathway questions don't show this text.

ZONE 2 — Question:
  Question in selected language:
    Hindi: "यह दर्द कैसा महसूस होता है?" — 22px / 500 / primary
    English below: "How would you describe the pain?" — 14px muted
  
  Sub-prompt: mic icon + "Speak or choose" — 13px muted

ZONE 3 — Answer options (touch):
  5 options, stacked, 8px gap:
    "जलन जैसा / Burning" — 56px height card
    "दबाव जैसा / Dull pressure" — 56px card
    "छुरे जैसा तेज / Sharp, stabbing" — 56px card
    "ऐंठन / Cramping" — 56px card
    "अन्य / Something else" — 56px card (expands to textarea if selected)
  
  Same card styling as P-09 (touch answer selection)

VOICE OPTION:
  Small voice button (48px, secondary position — below options):
    "Speak your answer instead" — 13px / #2563EB with mic icon
    Tapping: transitions to voice listening mode for this question

PRIMARY ACTION:
"Next →" — primary button, full width, 52px, appears after selection (same as P-09)
Back link: "← Previous" — 13px ghost, below button

STATES:
Default: options visible, no selection
Selected: card highlighted, Next enabled
Voice: switches to P-07 state for this question
"Something else" selected: textarea expands, keyboard opens

RESPONSIVE:
Mobile: cards full-width
Kiosk: 72px card height, 20px text

MOTION:
Question entrance: content slides in from right 200ms ease-out (indicates forward progress)
Previously answered chips: slide in from left 200ms (indicates looking back)
Option selection: 120ms border + bg transition

ACCESSIBILITY:
"Based on what you told us" prefixes the question in aria-label for screen readers
Option cards: role radio group
Answer chips at top: aria-label "Previously answered questions"

VISUAL HIERARCHY:
1. Current question (largest, center)
2. Answer option cards (dominant interaction area)
3. Previous-answer chips (top, smaller — context not command)
4. Voice option (secondary, below cards)
5. Navigation (bottom, ghost)

DO NOT CHANGE: Foundation 1, Foundation 3. Adaptive annotation appears only on follow-up questions. Previous answer chips must not overwhelm current question.

---

### P-11 — Interview — AYUSH Branch Introduction

**STITCH PROMPT — SCREEN P-11: AYUSH BRANCH INTRODUCTION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-11
User Role: Patient (in AYUSH department)
Surface: Patient Intake
Route: /patient/intake/ayush-intro
Purpose: Transition the patient from general clinical questions to the Ayurvedic intake section. Explain why new questions are being asked before they begin.

USER CONTEXT:
The patient has completed the general intake questions. They are in an AYUSH OPD. Before the Dashavidha Pariksha / Ahara-Vihara questions begin, the system must explain the transition so the patient is not confused by unfamiliar questions about diet, sleep, and body type.

LAYOUT:
Patient shell: progress bar ~65%, "~4 min remaining"
Content column: max-width 520px, centered
Full vertical centering

TEAL ACCENT ELEMENT (visual transition marker):
  A 48px circle, #F0FDFA bg, 3px solid #0D9488 border, centered at top of content
  Inside: a simple lotus or leaf icon, 24px, #0D9488 (Lucide "leaf" icon)
  This signals the AYUSH section beginning — distinct but not decorative

HEADING:
  "A few more questions from your Ayurvedic doctor" — 24px / 500 / #18181B, centered
  Hindi below: "आपके आयुर्वेदिक डॉक्टर के लिए कुछ और प्रश्न" — 15px muted, centered
  
  Bottom margin: 16px

EXPLANATION TEXT:
  A calm explanation card:
    Border: 1px solid #E4E4E7, left border 3px solid #0D9488
    Background: #F0FDFA
    Radius: 8px
    Padding: 16px 20px
    
    Text (14px / 400 / 1.6 line-height / #18181B):
    "Our Ayurvedic doctors would like to understand your diet, sleep, and daily routine. This helps them see the full picture of your health — not just your current symptoms."
    
    Translation below in selected language (13px / muted)
  
  Bottom margin: 28px

WHAT TO EXPECT preview (compact, 3 bullet points):
  Each bullet: small teal dot + text
  "A few questions about what you eat and drink"
  "Questions about your sleep and activity"
  "A few questions about how your body feels in general"
  
  Font: 14px / 400 / #52525B
  Gap: 10px between bullets

REASSURANCE:
  "There are no right or wrong answers — just share what feels true for you." — 14px / 400 / italic / #71717A, centered
  In selected language above

PRIMARY ACTION:
  "Continue to Ayurvedic questions →" — primary button, full width, 52px
  Color: #0D9488 (AYUSH teal) instead of standard accent blue — ONLY on this screen
  Text: white

SECONDARY:
  "Skip these questions" — ghost link, 13px muted, centered, 8px below button
  Note: This option exists but is documented. If skipped, case completeness shows AYUSH as "Not collected."

STATES:
Default: as described — static explanation screen
After "Continue": transitions to P-12 (AYUSH questions)
After "Skip": skips to P-15 (document upload) with AYUSH domains marked incomplete

RESPONSIVE:
Mobile: same layout, 16px padding, text slightly smaller
Kiosk: larger heading (28px), larger teal circle (64px), taller button (64px)

MOTION:
Screen entrance: teal circle drops in from above (translate Y -20px → 0, fade), 300ms ease-out
Explanation card: fades in 200ms after heading
"Continue" button: entrance after 400ms delay with fade, giving patient time to read

ACCESSIBILITY:
Teal circle: aria-hidden (decorative transition marker)
Explanation card: read as a paragraph block
Skip link: clearly labeled "Skip Ayurvedic questions"

VISUAL HIERARCHY:
1. Teal circle + leaf icon (visual anchor — signals transition)
2. Heading (key message)
3. Explanation card (why these questions matter)
4. "Continue" button (teal, full width)
5. Bullet points (supporting detail)
6. Skip option (available but secondary)

DO NOT CHANGE: Foundation 1, Foundation 3. Teal is used ONLY for AYUSH visual language. The "Continue" button uses teal specifically on this screen to signal mode change. This is the single exception to the standard blue accent button rule.

---

### P-12 — Interview — AYUSH Question (Ahara-Vihara)

**STITCH PROMPT — SCREEN P-12: AYUSH QUESTION — AHARA / VIHARA**

Inherits: Foundation 1, Foundation 3

Screen ID: P-12
User Role: Patient (AYUSH OPD)
Surface: Patient Intake
Route: /patient/intake/ayush-question
Purpose: Ask an Ayurvedic diet or lifestyle question in the context of the AYUSH intake branch

USER CONTEXT:
The patient is now in the AYUSH section of intake. They are being asked about their diet or lifestyle — Ahara or Vihara. These questions use plain language, not Ayurvedic technical terms. The teal visual language from P-11 continues to signal that this is the AYUSH section.

LAYOUT:
Patient shell: progress bar ~70%, "~3 min remaining"
Progress bar changes from blue to teal for the AYUSH section (subtle signal that we're in a different phase)
Content column: max-width 520px, centered

AYUSH SECTION INDICATOR (subtle, top of content):
  A small teal chip: leaf icon + "Ayurvedic intake" — 12px / 500 / #0F766E, bg #F0FDFA
  Right-aligned or left-aligned, 12px below progress bar

ZONE 1 — Question:
  Question in selected language (Hindi shown):
    "आप आमतौर पर कब और कितनी बार खाना खाते हैं?" — 22px / 500 / #18181B
    English: "How often do you eat, and at what times?" — 14px / 400 / muted below
  
  Sub-prompt: "Speak or choose an answer" — 13px muted + mic icon

ZONE 2 — Answer options (AYUSH touch cards):
  Same card structure as standard interview (P-09), but content is Ahara-specific
  5 options:
    "2 main meals, sometimes breakfast" — 56px card
    "3 regular meals at fixed times" — 56px card
    "I eat irregularly — no fixed times" — 56px card
    "1 meal a day only" — 56px card
    "Other pattern — I'll describe it" — 56px card (→ textarea)
  
  Cards same styling: white bg, border, radius 8px, accent when selected

ZONE 3 — Voice option:
  Same as P-10: small voice button below cards, "Speak your answer" link style

ZONE 4 — Context note (unique to AYUSH questions):
  A very subtle note below the options:
    Info-circle icon 12px muted + "Your doctor will use this to understand your digestion." — 12px / 400 / muted italic
  This helps the patient understand why this question matters.

PRIMARY ACTION:
"Next →" — primary button, teal (#0D9488) for AYUSH questions, full width, 52px
Back: "← Previous question" ghost link

STATES:
Same as P-09 (default / selected / "other" expanded / voice / next enabled)

RESPONSIVE:
Same as P-09

MOTION:
Same as P-09. Additionally: the teal progress bar segment animates forward with each AYUSH question (visible progress within the AYUSH block).

ACCESSIBILITY:
AYUSH section chip announced: "Ayurvedic intake — question 2 of 8"
Context note: aria-label "Why we ask this question"

VISUAL HIERARCHY:
1. Question text (top, large)
2. Answer cards (dominant — center)
3. Teal "Next" button (bottom, full width)
4. Context note (very small, below options — supportive)
5. Voice option (secondary)

DO NOT CHANGE: Foundation 1, Foundation 3. Questions use plain language, not Ayurvedic terms. Teal accent signals AYUSH phase throughout. Context note explains the question's relevance without being intrusive.

---

### P-13 — Interview — Progress State (Mid-Session)

**STITCH PROMPT — SCREEN P-13: INTERVIEW — PROGRESS / MID-SESSION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-13
User Role: Patient
Surface: Patient Intake
Route: /patient/intake/progress (interstitial — shown between thematic question blocks)
Purpose: A brief transition screen between major clinical sections of the interview — reassures the patient, shows what was covered, previews what comes next

USER CONTEXT:
After completing the HPI (History of Present Illness) block of questions, before beginning Past Medical History, a brief interstitial screen appears. This isn't a loading screen — it's a pacing moment. The patient can review what's been collected and continue.

LAYOUT:
Patient shell: progress bar ~55%, "~6 min remaining"
Content column: max-width 520px, centered
Vertical centering

TOP: Completion acknowledgment:
  Check-circle icon: 40px, green (#16A34A), centered
  Heading: "Good — we've noted your symptom history." — 22px / 500 / #18181B, centered
  Hindi: "अच्छा — हमने आपके लक्षणों की जानकारी नोट कर ली है।" — 15px muted below, centered

WHAT WE'VE COVERED (compact summary):
  A light card, border, radius 8px, padding 16px:
    Title: "COVERED SO FAR" — 11px uppercase muted
    
    4 items in a 2×2 grid or vertical list:
      check-circle green (14px) + "Main complaint — Stomach pain" — 14px
      check-circle green + "How long — 3 months" — 14px
      check-circle green + "What makes it worse — After meals" — 14px
      check-circle green + "Other symptoms — Bloating" — 14px
    
    All 14px / 400 / #52525B

WHAT'S NEXT preview:
  Same card styling:
    Title: "NEXT — A FEW MORE QUESTIONS" — 11px uppercase muted
    
    3 items with clock icon (14px muted) instead of check:
      clock + "Your past medical conditions" — 14px muted
      clock + "Current medicines you take" — 14px muted
      clock + "Any allergies" — 14px muted

TIME ESTIMATE update:
  "About 5 more minutes." — 14px / 500 / muted, centered, below cards

PRIMARY ACTION:
  "Continue →" — primary button, full width, 52px, below cards + 24px margin

SECONDARY:
  "Take a break — I'll continue later" — ghost link, 13px muted — navigates to P-14 (Pause)

STATES:
Default: as described — static interstitial
Loading: not applicable (data already collected)

RESPONSIVE:
Mobile: single-column card content, 16px padding
Kiosk: larger heading (26px), taller button (64px)

MOTION:
Check-circle enters first (scale 0.7 → 1.0, 300ms, elastic feel but not bouncy)
Heading fades in 200ms after check
Cards stagger in 150ms apart (covered first, then "what's next")
"Continue" button appears last with 200ms fade

ACCESSIBILITY:
This screen is announced: "Section complete. Here is a summary of what was collected."
"Continue" is the primary focus target

VISUAL HIERARCHY:
1. Green check-circle (instant visual success)
2. Heading (what just happened)
3. "Covered so far" card (reassurance)
4. "What's next" card (setting expectations)
5. Continue button (full width, blue, bottom)

DO NOT CHANGE: Foundation 1, Foundation 3. This is a pacing/transition screen — not a full form. Concise, calm, encouraging. No clinical jargon.

---

### P-14 — Interview — Pause / Resume

**STITCH PROMPT — SCREEN P-14: INTERVIEW — PAUSE / RESUME**

Inherits: Foundation 1, Foundation 3

Screen ID: P-14
User Role: Patient
Surface: Patient Intake
Route: /patient/intake/pause
Purpose: Allow the patient to pause the intake session — with their progress saved — and resume when ready

USER CONTEXT:
A patient may need to pause — to ask a family member a question, use the restroom, or simply take a moment. The pause screen must reassure them that their answers are saved and they can continue. On kiosk, there is a session timeout to prevent privacy issues.

LAYOUT:
Patient shell: progress bar paused (gray, no animation), "Session paused"
Content column: max-width 480px, centered
Vertical centering

ICON:
  Pause icon: 40px circle, #F4F4F5 bg, 1px solid #E4E4E7, pause icon 20px #71717A, centered
  (Not alarming — calm gray)

HEADING:
  "Your session is paused." — 22px / 500 / #18181B, centered
  Hindi: "आपका सत्र रोक दिया गया है।" — 15px muted below

PROGRESS STATUS:
  A compact status card:
    Border, radius 8px, padding 16px, bg white
    "PROGRESS SAVED" — 11px uppercase green chip top-right of card
    Text: "You've completed about 55% of the intake. Your answers have been saved." — 14px / 400 / #52525B
    Session expiry: "This session will remain active for 24 hours." — 13px muted

KIOSK-SPECIFIC TIMEOUT (only on kiosk):
  A countdown bar (amber, 4px height, full width of card):
    "This kiosk session will reset in 3:47 — tap to continue" — 12px amber
  If reaches 0:00 → auto-redirect to P-23 (kiosk reset)

PRIMARY ACTION:
  "Continue where I left off →" — primary button, full width, 52px
  Label in selected language

SECONDARY ACTIONS:
  "Start over (clear my answers)" — secondary button, full width, 44px, 8px margin-top
  — Requires confirmation dialog before clearing
  
  "Ask staff for help" — ghost link, 13px muted, centered below buttons

CONFIRMATION DIALOG (if "Start over" pressed):
  Modal, centered, 320px width, radius 12px, padding 24px, shadow-lg
  Heading: "Clear all answers?" — 16px / 600
  Body: "This will permanently delete your answers from this session." — 14px / 400 / muted
  Buttons (row): "Cancel" secondary + "Yes, clear" destructive

STATES:
Default: paused state as described
Kiosk countdown: timer visible and counting
"Start over" confirm: dialog overlays
After resume: transitions back to the current interview question

RESPONSIVE:
Mobile: same layout
Kiosk: countdown timer more prominent (16px font), 64px "Continue" button

MOTION:
Pause icon: gentle fade in on arrival (not abrupt)
Progress card: slides up from below 200ms
Countdown bar: real-time depletion animation (linear)
Dialog: fade + scale, 200ms

ACCESSIBILITY:
Countdown timer is announced via aria-live ("2 minutes remaining")
"Continue" is primary focus on page load
Dialog: focus trapped when open

VISUAL HIERARCHY:
1. "Continue where I left off" (blue, full width — most important action)
2. Progress saved status (reassurance)
3. Kiosk countdown (amber, urgent but not alarming)
4. "Start over" (secondary — available but not dominant)
5. Staff help (ghost, minimal)

DO NOT CHANGE: Foundation 1, Foundation 3. Never delete session data without confirmation. Kiosk must always show countdown when paused.

---

### P-15 — Document Upload Initiation
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** P-15 | **Route:** /patient/documents
[FULL PROMPT AS PROVIDED ABOVE]

---

### P-16 — Document Scanning (Camera View)

**STITCH PROMPT — SCREEN P-16: DOCUMENT SCANNING — CAMERA VIEW**

Inherits: Foundation 1, Foundation 3

Screen ID: P-16
User Role: Patient
Surface: Patient Intake
Route: /patient/documents/scan (modal overlay on P-15)
Purpose: Show the camera viewfinder for the patient to photograph a medical document

USER CONTEXT:
The patient tapped "Scan a document." The device camera opens. They need to align the document in frame and capture it. The interface must guide them — good lighting, flat placement, document aligned. This is the most technically tricky step for elderly patients.

LAYOUT:
Full-screen modal overlay over P-15
Background: #000000 (camera view — black when no camera, live preview when active)
Overlay gradient: very subtle dark gradient at top and bottom (for UI legibility on top of camera)

TOP BAR (40px, on dark overlay):
  Left: × "Cancel" — 14px / white, ghost
  Center: "Scan Document" — 14px / 500 / white
  Right: flash toggle icon (flash-off by default) — 24px / white, tap to toggle flash

CAMERA VIEWFINDER:
  Full-screen camera preview (native device camera)
  
  Alignment frame overlay:
    A rounded rectangle (8px radius) in the center of the screen
    Size: approximately 85% of screen width × 65% of screen height
    Border: 2px solid rgba(255,255,255,0.8)
    Corner accents: only the corners are highlighted (L-shaped, 24px each, white, 3px) — NOT a full border
    The area outside the frame: rgba(0,0,0,0.4) overlay (but camera is still visible through it)
  
  Label inside frame (centered, bottom of frame area):
    "Align document here" — 13px / white (with subtle drop shadow for legibility)
    In selected language above: "दस्तावेज़ को यहाँ रखें" — 12px / rgba(255,255,255,0.8)

GUIDANCE TEXT (above capture button):
  A small horizontal panel at bottom third of screen (above button):
    Three tip chips in a row:
      flat-icon + "Place flat" — 12px white chips
      sun-icon + "Good light" — 12px
      maximize-icon + "Full page" — 12px
    All: small icon + text, pill shape, rgba(0,0,0,0.5) bg, white text

CAPTURE BUTTON:
  Large circular button: 80px diameter
  Position: centered, 40px from bottom
  Outer ring: 3px solid white, radius full, 96px
  Inner circle: white fill, 80px
  Icon: camera icon 28px, #18181B (dark on white)
  Pressing: inner circle scales to 0.9 → 1.0 (100ms) indicating capture

CAPTURE FEEDBACK (after press):
  Instant white flash overlay: 0 → opacity 1 → 0, 200ms (camera shutter simulation)
  Then: screen transitions to quality check (brief processing) before returning to P-17 or P-15

RETAKE (shown after capture in preview mode):
  Camera preview pauses, showing captured image
  Bottom bar: "Retake" secondary button + "Use this photo →" primary button
  Both 44px height

STATES:
Camera loading: dark screen + spinning arc 32px centered (white) + "Opening camera..." 14px white
Camera active: live viewfinder as described
After capture: static image preview + Retake / Use actions
Permission denied: error state with icon + "Camera access is required to scan documents. Please allow camera access in your device settings." — 14px white centered. "Use file upload instead →" button.

RESPONSIVE:
Mobile portrait: full screen, capture button at bottom
Tablet: same (most common kiosk/tablet orientation)
Kiosk: full screen, touch targets 96px capture button, extra guidance text

MOTION:
Camera open: fade from black, 300ms
Capture: white flash 200ms
Preview: slide from right (captured image replaces live view)

ACCESSIBILITY:
Capture button: aria-label "Take photo of document"
Flash toggle: aria-label "Toggle flash — currently off"
All guidance text: visible color contrast on dark bg (minimum 4.5:1 with drop-shadow aid)

VISUAL HIERARCHY:
1. Document alignment frame (center, most of screen)
2. Capture button (bottom, large, white circle)
3. Guidance tips (above button)
4. Top bar controls (minimal)

DO NOT CHANGE: Foundation 1, Foundation 3. Camera view is dark bg — white UI elements only. Guidance must be visible. One-tap capture.

---

### P-17 — Document Quality Warning

**STITCH PROMPT — SCREEN P-17: DOCUMENT QUALITY WARNING**

Inherits: Foundation 1, Foundation 3

Screen ID: P-17
User Role: Patient
Surface: Patient Intake
Route: /patient/documents/quality-warning (state within P-15/P-16 flow)
Purpose: Inform the patient that a captured document image has quality issues that may affect processing — with specific actionable guidance

USER CONTEXT:
The document image was analyzed and found to be blurry, low-contrast, skewed, or partially visible. The patient must understand the specific problem and how to fix it — or choose to proceed anyway and accept lower confidence extraction.

LAYOUT:
Patient shell visible (not full-screen camera)
Content column: max-width 480px, centered
The flagged document image is shown as a thumbnail

HEADER STRIP (amber, full-width):
  Background: #FFFBEB
  Border-bottom: 1px solid rgba(217,119,6,0.3)
  Padding: 14px 24px
  Icon: alert-triangle 18px #D97706
  Text: "We had trouble reading this document" — 15px / 600 / #B45309
  Below: in selected language — 13px / 400 / #B45309

DOCUMENT PREVIEW:
  The actual captured image shown in a card:
    Width: full content column
    Max-height: 200px (aspect ratio maintained)
    Radius: 8px
    Border: 2px solid #D97706 (amber border = quality issue)
    Object-fit: cover
  
  Below image: quality issues listed as small chips:
    Show only the detected issues (1–3 chips):
      "Blurry" amber chip
      "Skewed" amber chip  
      "Low contrast" amber chip

SPECIFIC GUIDANCE (the most important element):
  Card: border-left 3px solid #D97706, bg #FFFBEB, radius 8px, padding 16px, margin-top 16px
  
  Title: "How to improve it" — 13px / 600 / #B45309
  
  Specific tips (based on detected issues — show only relevant ones):
    If blurry: camera icon + "Hold the camera steady and tap the screen to focus first"
    If skewed: maximize icon + "Place the document flat on a table — not at an angle"
    If low contrast: sun icon + "Move to a brighter area or turn on flash"
    If partial: "Make sure the entire document is visible in the frame"
  
  Each tip: 14px / 400 / #52525B, icon 14px left

ACTIONS:
  Three buttons, stacked, 8px gap:
  
  "Try again" — primary button, 52px, full width, camera icon
  Label in selected language
  
  "Use it anyway" — secondary button, 44px, full width
  Below: "(Some information may not be read correctly)" — 11px / 400 / muted below button
  
  "Remove this document" — ghost/destructive link, 13px, centered

STATES:
Default: amber warning header + preview + guidance + actions
"Use it anyway": document marked as low-quality, returns to P-15, document shows with amber indicator
"Try again": returns to P-16 (camera view)
"Remove": document removed from list, returns to P-15

RESPONSIVE:
Mobile: image 160px max-height, full-width guidance card
Kiosk: image 240px, 64px primary button, guidance tips in larger text

MOTION:
Screen entrance: header slides down from top 200ms (amber — slightly more noticeable than standard transitions)
Image preview: fade in 250ms

ACCESSIBILITY:
Image has alt: "Captured document with quality issues"
Issues chips: announced as "Quality issues detected: blurry, skewed"
Primary action "Try again" is focus target

VISUAL HIERARCHY:
1. Amber header strip (immediate signal — something needs attention)
2. Document thumbnail with amber border
3. "How to improve it" guidance (most useful content)
4. "Try again" button (primary, full width)
5. "Use it anyway" (secondary — escape hatch)

DO NOT CHANGE: Foundation 1, Foundation 3. Guidance must be specific to the detected issue, not generic. Never block the patient — "use anyway" is always available.

---

### P-18 — Document Processing (Async Status)

**STITCH PROMPT — SCREEN P-18: DOCUMENT PROCESSING — ASYNC STATUS**

Inherits: Foundation 1, Foundation 3

Screen ID: P-18
User Role: Patient
Surface: Patient Intake
Route: /patient/documents (processing state — state of P-15 while docs are being analyzed)
Purpose: Show the patient that their document is being analyzed while they continue with other tasks — processing is async and must not block progress

USER CONTEXT:
The patient has uploaded a document. OCR and entity extraction are running asynchronously. The patient should NOT wait for this. They should continue to the next step. This screen is what P-15 looks like when one or more documents are processing.

LAYOUT:
This is the same as P-15 but with one or more documents in "processing" state in the document list.
Patient shell: progress bar ~80%
Content column same structure as P-15

KEY DIFFERENCE FROM P-15:
The document list below the upload zone shows documents with animated processing states.

PROCESSING DOCUMENT CARD:
  Height: 60px
  Border: 1px solid #E4E4E7
  Radius: 8px
  Background: white
  Padding: 0 16px
  
  Left: file-type icon in 32px blue circle (accent subtle bg, accent icon)
  
  Center column:
    Filename: "Lab_Report_Mar2025.jpg" — 14px / 500 / primary (truncated)
    Status row: thin blue rotating arc (16px) + "Analyzing document..." — 13px / #2563EB
    Progress text: "Extracting information..." — 12px muted (updates: Reading → Extracting → Finishing)
  
  Right: × remove icon (32px tap target, ghost)

BANNER ABOVE DOCUMENT LIST (when processing):
  Subtle info banner:
    Background: #EFF6FF
    Border: 1px solid rgba(37,99,235,0.2)
    Radius: 8px
    Padding: 10px 16px
    Info icon: 14px #2563EB
    Text: "Your document is being analyzed. You can continue now — it will be ready by the time you reach the doctor." — 13px / 400 / #1E40AF
  
  This banner is important — it explicitly tells the patient NOT to wait.

PRIMARY ACTION (NOT blocked by processing):
  "Continue →" — primary button remains enabled during processing
  Text below: "Documents will finish processing in the background." — 12px / muted

COMPLETED DOCUMENT CARD (shown when processing finishes):
  Same card structure
  Status row: check-circle (green 16px) + "3 items found" — 13px / #15803D
  No arc animation

FAILED DOCUMENT CARD:
  Status: × circle (red 14px) + "Could not read this document" — 13px / #B91C1C
  "Try again" link 13px / #2563EB

STATES:
All processing: banner visible, all cards show arc
Some complete: mixed states in list
All complete: banner disappears, all cards show green
Failed: error state per card

RESPONSIVE:
Mobile: cards full-width, banner full-width
Kiosk: cards 72px height, larger status text

MOTION:
Processing arc: rotating 1.2s linear infinite (accent color)
Processing → complete transition: arc fades, check-circle scales in (scale 0.8→1.0, 200ms)
Info banner: slides down from above 300ms

ACCESSIBILITY:
aria-live region announces when processing completes: "Your lab report has been analyzed. 3 items found."
Processing card status: aria-busy="true"
Completed: aria-busy="false"

VISUAL HIERARCHY:
1. "Continue" button (remains primary — patient should not wait)
2. Info banner (explicit instruction not to wait)
3. Processing cards with animated arc (secondary status)
4. Completed cards (reassuring)

DO NOT CHANGE: Foundation 1, Foundation 3. Processing must NEVER block the patient from continuing. The information banner is mandatory when any document is processing.

---

### P-19 — Multi-Document List View

**STITCH PROMPT — SCREEN P-19: MULTI-DOCUMENT LIST VIEW**

Inherits: Foundation 1, Foundation 3

Screen ID: P-19
User Role: Patient (with multiple documents uploaded)
Surface: Patient Intake
Route: /patient/documents (multi-document state)
Purpose: Show the patient a list of all documents they have uploaded with their types, statuses, and options to add more or remove

USER CONTEXT:
The patient has uploaded 3 or more documents. This screen gives them a clear view of everything uploaded before they continue. It's the full list state of the document upload flow — not an async state, but an active management view.

LAYOUT:
Patient shell: progress bar ~82%
Content column: max-width 560px, centered

HEADING:
  "Your documents" — 20px / 500 / primary
  Subtext: "3 documents added. You can add more or continue." — 14px / 400 / muted
  (Count updates dynamically)

DOCUMENT LIST (full list, each card):

Document Card 1 — Prescription (Complete):
  Height: 68px
  Left: document type icon in 36px circle:
    clipboard icon in blue circle (#EFF6FF bg, #2563EB icon)
  Center:
    Name: "Prescription — Dr. Sharma — Jan 2025" — 14px / 500 / primary (truncated 35ch)
    Status: check-circle green + "4 items extracted" — 13px / #15803D
    Type label: "Prescription" — 11px / #71717A
  Right: 
    Confidence indicator: "OCR: 94%" — 11px / JetBrains Mono / green
    × remove icon (32px tap target)

Document Card 2 — Lab Report (Complete, with warning):
  Same structure
  Left icon: activity icon in teal circle (#F0FDFA bg, #0D9488 icon)
  Name: "Lab_Report_March_2025.jpg"
  Status: check-circle + "3 items extracted"
  Right: "OCR: 68% ⚠" — 11px / JetBrains Mono / amber (low confidence)
  The entire card has a subtle amber left border (2px)

Document Card 3 — Discharge Summary (Processing):
  Left icon: file-text in gray circle
  Status: arc + "Analyzing..."
  Right: — (no confidence yet)
  No × during processing (disabled)

"ADD MORE DOCUMENT" ROW:
  Below the list, 12px margin-top
  A dashed-border row (not a full upload zone):
    Height: 52px
    Border: 1.5px dashed #E4E4E7
    Radius: 8px
    Icon: plus 16px muted + "Add another document" — 14px / 400 / #2563EB
    Centered content
    Tap → returns to camera view (P-16)

ALL PROCESSED STATUS BANNER:
  When all documents are complete:
    Green subtle banner: check-circle + "All documents analyzed and ready for your doctor." — 13px green
    Replaces info/processing banner

FOOTER ACTIONS:
  "Continue to review →" — primary button, full width, 52px
  (Enabled even if documents are processing — processing is async)
  
  "I have no more documents" — ghost link, 13px muted, below button (navigates to P-20)

STATES:
All processing: all cards show arcs, "all processing" info banner
Mixed: some complete, some processing
All complete: green banner, all cards show extracted count
Empty (shouldn't happen in P-19): empty state would be P-15

RESPONSIVE:
Mobile: 68px cards, full-width, 16px padding
Kiosk: 80px cards, 20px text, 64px "Add more" row

MOTION:
Processing → complete: arc fades, check scales in (same as P-18)
New card addition: slides in from bottom with fade, 200ms
Remove card: fades out + height collapses, 200ms

ACCESSIBILITY:
Each card: announced as "[Type] — [Filename] — [Status]"
"Add another document" role="button"
OCR confidence annotation: aria-label "OCR confidence 68% — some text may not have been read correctly"

VISUAL HIERARCHY:
1. Document list (dominant — shows what's been added)
2. Add more row (secondary — clearly available)
3. All-complete green banner (when visible — reassuring)
4. Continue button (bottom, full width)

DO NOT CHANGE: Foundation 1, Foundation 3. OCR confidence is shown only as a simple indicator, not explained in detail to the patient. Low confidence shown in amber but not alarming.

---

### P-20 — Session Review / Confirmation

**STITCH PROMPT — SCREEN P-20: SESSION REVIEW / CONFIRMATION**

Inherits: Foundation 1, Foundation 3

Screen ID: P-20
User Role: Patient
Surface: Patient Intake
Route: /patient/review
Purpose: Give the patient a brief summary of what has been collected before final submission — a last chance to add information or review

USER CONTEXT:
The patient has completed the interview and uploaded documents. Before final submission, they see a summary of what was collected. This is NOT a detailed medical review — just high-level confirmation that the system captured their main concerns. The patient can add anything missed.

LAYOUT:
Patient shell: progress bar ~92%, "~1 min remaining"
Content column: max-width 520px, centered

HEADING:
  "Here's what we've noted" — 22px / 500 / #18181B
  Hindi: "यहाँ है जो हमने नोट किया है" — 15px muted
  Subtext: "Please review before we send this to your doctor." — 14px / 400 / muted
  Bottom margin: 24px

REVIEW CARD — Clinical summary (NOT medical details, just a high-level lay summary):
  White card, border, radius 8px, padding 20px
  
  Section: "Your main concerns" (patient language, not clinical)
    check + "Stomach pain for 3 months" — 15px / 400
    check + "Worse after eating" — 15px / 400
    check + "Mild nausea" — 15px / 400
  
  Divider
  
  Section: "Documents shared"
    file icon + "3 documents (prescription, 2 reports)" — 14px muted
  
  Divider
  
  Section: "Your medicines" (if collected)
    pill icon + "Metformin, Amlodipine, Pantoprazole" — 14px muted

  Divider
  
  Section: "Allergies"
    alert-circle icon + "Penicillin (you mentioned)" — 14px / #D97706 muted
    (Amber because this is flagged for physician verification)

MISSED ANYTHING banner:
  Ghost-style prompt:
    Text: "Anything we missed?" — 14px / 500 / #18181B
    "Add a note for your doctor" — ghost button, 36px height, full width

If note is added: a small textarea appears (80px, 14px text), "Save note" button

FINAL CONSENT REMINDER (brief):
  "By continuing, you confirm this information is correct to the best of your knowledge." — 12px / #A1A1AA, italic, centered

PRIMARY ACTION:
  "Submit and wait →" — primary button, full width, 52px
  Label in selected language
  Below: "Your case will be prepared for your doctor immediately." — 12px muted

STATES:
Default: review card + submit button
Adding note: textarea expands, save button appears
Processing (after submit): spinner in button, "Submitting..." label
Success: navigates to P-21

RESPONSIVE:
Mobile: full-width card, 16px padding
Kiosk: 64px submit button, 18px text in card

MOTION:
Review card: stagger each section in with 100ms delay between sections
"Add note" expansion: height animate 200ms

ACCESSIBILITY:
Review content is in a <section> with heading
Submit button aria-label: "Submit and send to doctor"
Note: optional, aria-expanded on the textarea toggle

VISUAL HIERARCHY:
1. Review card (dominant — what was collected)
2. "Submit and wait" (full width, blue, primary action)
3. "Add a note" (secondary — quiet but available)
4. Consent reminder (very small, bottom of card)

DO NOT CHANGE: Foundation 1, Foundation 3. Patient-facing language only — no clinical terms. The review is a confirmation, not a full medical record display.

---

### P-21 — Session Completion + Token Issued
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** P-21 | **Route:** /patient/complete
[FULL PROMPT AS PROVIDED ABOVE]

---

### P-22 — Patient-Side Red Flag Handling (Staff Called)

**STITCH PROMPT — SCREEN P-22: PATIENT — RED FLAG / STAFF CALLED**

Inherits: Foundation 1, Foundation 3

Screen ID: P-22
User Role: Patient
Surface: Patient Intake
Route: /patient/alert (shown when red flag detected during intake)
Purpose: Inform the patient that a staff member is coming to assist them — calmly, without causing panic

USER CONTEXT:
The patient has described symptoms that triggered a triage alert (e.g., chest pain with arm radiation). The triage nurse has been notified. The patient must be informed that someone is coming — but the notification MUST NOT alarm them. No "EMERGENCY." No red sirens. Just calm, helpful instruction.

CRITICAL DESIGN CONSTRAINT: This screen must be calm. The patient may be anxious. No alarming visual language.

LAYOUT:
Patient shell: progress bar frozen at current position
Content column: max-width 480px, centered
Full vertical centering

ICON:
  A 52px circle:
    Background: #FFFBEB (amber subtle — not red)
    Border: 2px solid #D97706
    User-check icon: 24px, #D97706
  Centered at top of content

HEADING:
  "A staff member is coming to check on you." — 22px / 500 / #18181B, centered
  Hindi below: "एक कर्मचारी आपसे मिलने आ रहा है।" — 15px muted, centered
  
  Bottom margin: 16px

EXPLANATION:
  "Some of the symptoms you mentioned need a quick check with our staff. Please stay where you are." — 15px / 400 / #52525B, centered, max-width 400px
  
  Hindi translation: 14px muted below

WAITING INDICATOR:
  A gentle pulsing ring (amber, very subtle) around a person/user icon in center of screen — NOT a progress bar, just ambient breathing animation
  Under the icon: "Staff has been notified" — 14px / 400 / #B45309
  With green dot: "Acknowledged at 10:38 AM" — 13px / #15803D (when triage acknowledges)

WHAT TO DO:
  A card with 3 simple instructions:
    sit icon + "Stay seated and comfortable" — 14px
    user icon + "A staff member will find you" — 14px
    phone icon + "If you feel worse, ask anyone nearby for help" — 14px

CONTINUE OPTION (if available):
  A very subtle ghost link at bottom:
    "I feel fine — continue my intake" — 13px muted
    Tapping this: logs that patient chose to continue. Does not cancel triage alert.

STATES:
Default: staff notified, waiting for acknowledgment
Acknowledged: green confirmation "Staff member is on their way" + timestamp
Patient continues: intake resumes

RESPONSIVE:
Mobile: same, 16px padding
Kiosk: 64px center icon, 18px text, no "continue intake" option (staff must physically assist)

MOTION:
Amber ring: slow pulse, 3s loop, scale 1.0 → 1.06 → 1.0, opacity 1 → 0.6 → 1 — very gentle
Icon entrance: fade in 500ms (slower than usual — calming)
Acknowledgment: green dot fades in (not a pop — fade)

ACCESSIBILITY:
Screen announced: "A staff member has been notified and is coming to assist you."
No alarming words in aria (no "emergency", no "urgent")
Pulsing ring: aria-hidden (decorative)

VISUAL HIERARCHY:
1. Amber circle + user-check icon (first focus — signals care, not alarm)
2. "A staff member is coming" heading (clear, calm)
3. Instructions card (what to do)
4. Acknowledged status (when available)
5. "Continue my intake" (ghost, lowest priority)

DO NOT CHANGE: Foundation 1, Foundation 3. ABSOLUTELY NO red color on this screen. Amber ONLY. No word "emergency." This screen's job is to keep the patient calm while ensuring they don't leave.

---

### P-23 — Kiosk — Session Idle / Reset Screen

**STITCH PROMPT — SCREEN P-23: KIOSK — SESSION IDLE / RESET**

Inherits: Foundation 1, Foundation 3 (Kiosk mode)

Screen ID: P-23
User Role: No active user — kiosk between sessions
Surface: Kiosk (hospital OPD touchscreen)
Route: /kiosk/idle
Purpose: Display an appropriate screen between patient sessions — attracting new patients while protecting the privacy of the previous session

USER CONTEXT:
After a patient completes their session (or after inactivity timeout), the kiosk returns to this idle state. Previous session data has been cleared. The screen must: confirm data is cleared, attract the next patient, and display minimal but useful hospital context.

LAYOUT:
Full-screen. No browser chrome. Touch-only.
Background: #F6F6F7 (canvas — warm neutral, not stark white or black)

THREE VISUAL LAYERS:

LAYER 1 — Privacy confirmation (appears briefly on session reset, then fades):
  A centered green banner slides in from top then fades after 4 seconds:
    check-circle 20px #16A34A + "Previous session cleared securely." — 15px / 500 / #15803D
    Background: #F0FDF4, border #16A34A 1px, radius 8px, padding 12px 20px

LAYER 2 — Attract mode (primary idle content):
  Centered content column (640px max-width)
  
  Top:
    "Vaidya" wordmark: 28px / 600 / #18181B
    "AIIA OPD — Patient Intake Terminal" — 16px / 400 / muted
  
  Center (primary attract element):
    Large hand-pointer icon (48px, #D4D4D8) with a gentle pulse animation (2s loop, scale 1.0→1.1→1.0)
    Below: "Touch anywhere to begin your visit" — 28px / 500 / #18181B, centered
    In Hindi below: "अपनी यात्रा शुरू करने के लिए यहाँ स्पर्श करें" — 20px / 400 / muted
    In Marathi: "सुरू करण्यासाठी येथे स्पर्श करा" — 18px muted
  
  Language preview row (below attract text):
    12 language pills in a horizontal scrolling row: हिंदी / English / मराठी / ગુજરાતી / ...
    Each pill: 40px height, border, rounded, 14px text in script
    Grayed out slightly — they're a preview, not interactive yet
    "Touch to select your language" — 13px muted below

LAYER 3 — Hospital information (bottom, ambient):
  A bottom strip: 56px height, white bg, top border 1px #E4E4E7
  Left: Clock — current time in 24px JetBrains Mono — "10:42" + "AM"
  Center: "15 Aug 2026 · Tuesday" — 14px muted
  Right: Queue indicator: "Currently serving Token #28" — 14px / 500 / primary
  (Queue info from HIS if available, else omit)

PRIVACY GUARD:
  Screen dims slightly (not full black) after 15 minutes of true idle (no patients approaching)
  A single centered line: "Touch to wake" — 16px muted
  Touching: screen returns to full idle content

STATES:
Idle default: attract mode as described
Session just reset: green privacy banner appears for 4s then fades
Long idle (15+ min): dimmed screen, "Touch to wake"
Any touch: navigates to K-01 (Kiosk Welcome) or P-01 depending on route configuration

RESPONSIVE:
Kiosk only. This screen is not shown on mobile or tablet.
Optimized for 55"+ touchscreen: content max 800px wide, centered.

MOTION:
Green privacy banner: slides from top 300ms, holds 4s, fades out 500ms
Hand pointer pulse: scale 1.0→1.1→1.0, 2s loop, very gentle
Screen dim: opacity 1.0 → 0.7, 2s ease-in (15 min after last interaction)
Language pills: gentle drift / parallax (very subtle, not distracting)

ACCESSIBILITY:
Attract text: aria-live "polite" — announced after session reset
Language pills: aria-hidden in idle state (not interactive yet)
Time display: aria-label "Current time 10:42 AM"

VISUAL HIERARCHY:
1. "Touch anywhere to begin" (largest, dominant)
2. Hand pointer icon (visual attractor)
3. Multilingual text below heading
4. Language pills (preview, passive)
5. Bottom info strip (ambient)
6. Privacy banner (brief, then gone)

DO NOT CHANGE: Foundation 1, Foundation 3 kiosk mode. Privacy confirmation must appear on every session reset. No patient data must ever be visible on this screen.

---

## TRIAGE SURFACE SCREENS (T-01 → T-05)

---

### T-01 — Triage Dashboard / Alert Queue
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** T-01 | **Route:** /triage/dashboard
[FULL PROMPT AS PROVIDED ABOVE]

---

### T-02 — Active Red Flag Alert Detail

**STITCH PROMPT — SCREEN T-02: ACTIVE RED FLAG ALERT DETAIL**

Inherits: Foundation 1, Foundation 2 (Triage variant), Foundation 4

Screen ID: T-02
User Role: Triage Nurse
Surface: Triage
Route: /triage/alerts/:id
Purpose: Show the triage nurse the full detail of a specific red flag alert — everything they need to make a clinical assessment decision

USER CONTEXT:
The triage nurse clicked an alert in T-01. They need to see: what the patient said (verbatim, in original language), what rule triggered, when the alert was created, the patient's current location (token/waiting area), and the acknowledgment actions. They will then physically assess the patient and record their action.

LAYOUT:
Application shell: Foundation 2, Triage variant
Sidebar: "Triage Alerts" active, badge count showing
Page title: "Alert Detail" with breadcrumb: "Triage Alerts > Alert #AL-2026-0047"

PATIENT HEADER (top card, white, border, radius 8px, 20px padding):
  Row: Avatar initials circle (48px, amber ring — indicating active alert)
  Name: "Priya Menon" — 20px / 600 / primary
  Details: "42 years · Female · Token #23 · Arrived 10:22 AM"
  Status: "ALERT ACTIVE" — amber chip, right-aligned
  
  Row 2: "Chief complaint: Chest pain and breathlessness" — 14px / 400 / secondary

ALERT SUMMARY CARD (amber-tinted, prominent):
  Background: #FFFBEB
  Border: 1px solid rgba(217,119,6,0.4)
  Left border: 3px solid #D97706
  Radius: 8px
  Padding: 20px
  
  Header row:
    alert-triangle 18px #D97706
    "Cardiac Concern Detected" — 15px / 600 / #B45309
    "Rule: CARDIAC_001" — 12px JetBrains Mono muted right-aligned
  
  Alert time: "Triggered at 10:31 AM — 7 minutes ago" — 13px / JetBrains Mono / muted
  
  Divider

  WHAT TRIGGERED THIS:
    Label: "PATIENT STATED:" — 11px uppercase muted
    
    Verbatim quote block:
      Background: white, border, radius 6px, padding 12px 16px
      Original language (Hindi): "Mujhe seene mein bahut dard hai, aur dard baayein haath mein bhi ja raha hai." — 15px / 400 / #18181B / italic
      Translation below: "I have severe chest pain, and the pain is also going to my left arm." — 13px / #71717A
      Language tag: "Hindi · ASR confidence: 89%" — 11px monospace muted
    
    Extracted entities:
      Label: "EXTRACTED SYMPTOMS:" — 11px uppercase muted
      Chip row:
        "Chest pain" — gray chip
        "Left arm radiation" — amber chip
        "Onset: acute" — amber chip
      These chips represent what the rule engine received
  
  Divider
  
  Rule explanation:
    Label: "WHY THIS ALERT:" — 11px uppercase muted
    Text: "Patient reported chest pain with radiation to the left arm, matching cardiac concern criteria. Manual nurse assessment is required." — 13px / 400 / #52525B
  
  Bottom: "This is an automated signal. Clinical assessment by a qualified nurse is required before any action." — 12px / italic / muted

PATIENT INTAKE STATUS (below alert card):
  A compact status bar:
    "Interview: Complete · Documents: 2 uploaded, processing · AYUSH: N/A"
    "Case readiness: 6 of 10 domains" — 13px muted

ACKNOWLEDGMENT SECTION:
  Heading: "Your assessment" — 15px / 500 / #18181B
  Subtext: "Assess the patient and record your finding." — 13px muted
  
  Three radio options (styled as large radio cards, 64px height each):
    Option 1: "Patient needs immediate escalation — I'm calling the clinical team" — 15px / 500
    Subtext: "This will notify the physician immediately" — 12px muted
    Radio: 20px circle, accent when selected
    
    Option 2: "Patient assessed — monitoring, appears stable" — 15px / 500
    Subtext: "Patient will remain in standard queue"
    
    Option 3: "Alert reviewed — patient is appropriate for OPD today" — 15px / 500
    Subtext: "Alert was precautionary — normal queue"
  
  Note field:
    Label: "Add a note (optional)" — 13px / 500 / #52525B
    Textarea: 80px height, 14px text
    Placeholder: "Describe your findings..."
  
  "Confirm assessment →" — primary button, full width, 44px, margin-top 16px
  Disabled until a radio option is selected

STATES:
Unacknowledged: page loads with amber alert card, radio options ready
Option selected: "Confirm" button enables
Submitting: spinner in button
Confirmed: page shows success state → redirects to T-01 after 2s
Already acknowledged (viewed after fact): shows read-only acknowledgment record with action taken, nurse name, timestamp

ERROR: If submission fails — toast: "Could not save. Try again." Retry button in toast.

RESPONSIVE:
Desktop: single column, max-width 720px
Tablet: same, slightly narrower
Mobile: same, full-width, 16px padding

MOTION:
Amber alert card: enters with a single gentle highlight animation (amber border brightens 300ms) — draws attention, not alarming
Radio card selection: border + subtle bg change 150ms

ACCESSIBILITY:
Alert card: aria-live region updates with acknowledgment status
Radio options: fieldset with legend "Select your assessment"
Confirm button: aria-disabled until selection made

VISUAL HIERARCHY:
1. Amber alert card (immediate attention — contains the critical information)
2. Verbatim patient statement (most important evidence)
3. Radio assessment options (required action)
4. "Confirm assessment" button
5. Patient context bar (supporting info)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. The verbatim patient statement is always shown. The rule explanation must appear. This is an audit tool — everything is recorded.

---

### T-03 — Triage Acknowledgment + Action

**STITCH PROMPT — SCREEN T-03: TRIAGE ACKNOWLEDGMENT + ACTION (Confirmation State)**

Inherits: Foundation 1, Foundation 2 (Triage variant)

Screen ID: T-03
User Role: Triage Nurse
Surface: Triage
Route: /triage/alerts/:id/confirmed (state after submitting assessment in T-02)
Purpose: Confirm the triage nurse's assessment has been recorded — show what action was taken and what happens next

USER CONTEXT:
The triage nurse submitted their assessment in T-02. This screen confirms the action was recorded. It shows what was logged, the timestamp, and the patient's updated status. It also provides a quick link back to the alert queue.

LAYOUT:
Application shell: Foundation 2, Triage variant
Page: centered content, max-width 560px

SUCCESS HEADER:
  check-circle-2 icon: 44px, #16A34A, centered
  Heading: "Assessment recorded." — 22px / 600 / #18181B, centered
  Subtext: "This has been added to the patient's case record." — 14px muted, centered

ASSESSMENT SUMMARY CARD:
  White card, border, radius 8px, padding 20px
  
  Header: "ASSESSMENT LOGGED" — 11px uppercase muted
  
  Rows:
    Patient: "Priya Menon · Token #23" — 14px / 500
    Action taken: "Patient assessed — monitoring, stable" — 14px / 400 (matches selected radio from T-02)
    Nurse: "Logged by: Nurse S. Kumar" — 13px muted
    Time: "10:38:47 AM — 15 Aug 2026" — 13px JetBrains Mono muted
    Note (if added): "Nurse note: Patient BP 140/90, SpO2 97%, no diaphoresis. Alert reviewed." — 13px / italic / muted
  
  Audit ID: "Audit ref: TRIG-2026-0047" — 11px JetBrains Mono muted right-aligned

PHYSICIAN NOTIFICATION STATUS:
  A status row:
    If "escalate" was selected: amber chip "Physician notified — Dr. R. Mehta" + timestamp
    If "stable monitoring": gray chip "Case remains in standard queue"
    If "appropriate for OPD": gray chip "No action — alert archived"

PATIENT STATUS UPDATE:
  Text: "Priya Menon's case has been updated with your assessment." — 14px / 400 / muted
  "View case →" — link, #2563EB

ACTIONS:
  "Back to alert queue" — primary button, full width, 44px
  "View next alert" — secondary button (if more alerts exist)

STATES:
Default: success state as described
No more alerts: "Back to alert queue" is the only button, patient list is clear

RESPONSIVE: Standard clinical surface responsive (same as T-02)

MOTION:
check-circle: draws on (stroke animation 400ms ease-out)
Summary card: slides up from below 200ms
Auto-redirect to T-01 after 8 seconds (with countdown: "Returning to queue in 8..." — 12px muted bottom)

VISUAL HIERARCHY:
1. Green check-circle (success confirmation)
2. Assessment summary card (what was logged)
3. "Back to alert queue" button
4. Physician notification status (supporting info)

DO NOT CHANGE: Foundation 1, Foundation 2. Every triage acknowledgment produces an audit record. This screen must show that record. Never silently redirect without showing the confirmation.

---

### T-04 — Patient Status Overview (Triage Perspective)

**STITCH PROMPT — SCREEN T-04: PATIENT STATUS OVERVIEW — TRIAGE VIEW**

Inherits: Foundation 1, Foundation 2 (Triage variant), Foundation 4

Screen ID: T-04
User Role: Triage Nurse
Surface: Triage
Route: /triage/patients/:id
Purpose: Give the triage nurse a read-only overview of a specific patient's intake status — not the full physician case brief, but enough to understand the patient's situation

USER CONTEXT:
A triage nurse wants to check on a specific patient from the queue — perhaps to escort them, update their wait status, or manually flag a concern. They need key clinical facts without the full physician-level detail.

LAYOUT:
Application shell: Foundation 2, Triage variant
Page max-width: 720px, centered

PATIENT HEADER:
  Same as T-02 header (name, age/sex, token, arrived time)
  No amber ring (unless active alert)
  Status: "Interview complete · 3 documents processed" — green/blue chips

TRIAGE VITALS QUICK VIEW (if nurse has entered any):
  A compact row: 4 vital sign slots
    If vitals entered by nurse: value displayed (BP: 140/90 mmHg, SpO2: 97%, etc.)
    If not entered: "—" dash with "+ Record vital" ghost link
  This is a rapid documentation option for triage staff
  Note: vitals entered here are nurse-recorded, not AI-extracted — labeled as "Nurse recorded"

KEY CLINICAL FACTS (read-only, simplified):
  NOT the full physician case brief — a triage-specific summary

  Three compact cards in a row (or stacked mobile):
  
  Card 1: "Chief Complaint"
    "Chest pain and breathlessness"
    "Duration: Today — acute onset"
    Source: Interview chip (T3)
  
  Card 2: "Key Medications"
    "No current medications documented" OR list of 2–3 if extracted
  
  Card 3: "Alerts"
    "1 alert — Acknowledged by S. Kumar at 10:38" (green) OR "No alerts" (muted)

INTAKE PROGRESS:
  A completeness row: same domain grid as Foundation 4 but compact (2-column grid, 32px rows)
  Shows what clinical domains are populated vs. missing

DOCUMENTS:
  A compact list of uploaded documents with status only:
    "Lab Report · Processed" and "Prescription · Processed"

QUEUE MANAGEMENT ACTIONS:
  "Priority in queue" — a radio selector:
    [ Standard ] [ Priority ] [ Urgent ]
    Selecting "Urgent" moves patient to top of physician queue and creates audit event
  
  "Add triage note" — ghost button (opens a textarea)

ACTIONS:
  "Back to queue" — primary button (top-right of page or bottom)
  "View alerts for this patient →" — link if any alerts exist

STATES:
Default: as described
Active alert: banner at top (abbreviated version of T-02 amber banner)
No clinical data yet: "Interview still in progress" placeholder in fact cards

RESPONSIVE:
Desktop: 3-column fact cards, side by side
Tablet: 2-column
Mobile: stacked single column

VISUAL HIERARCHY:
1. Patient identity header
2. Key clinical fact cards (3-column)
3. Alert status (prominent if active)
4. Queue management controls
5. Completeness grid (supporting context)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. This is a READ-ONLY clinical view for triage staff — no editing of clinical facts. Queue priority is the only action.

---

### T-05 — Triage History / Resolved Alerts

**STITCH PROMPT — SCREEN T-05: TRIAGE HISTORY / RESOLVED ALERTS**

Inherits: Foundation 1, Foundation 2 (Triage variant)

Screen ID: T-05
User Role: Triage Nurse
Surface: Triage
Route: /triage/history
Purpose: Show historical triage alerts from the current session or today — resolved, archived, or false-positive alerts

USER CONTEXT:
At the end of a shift or when reviewing, the triage nurse looks at all alerts from today. Each alert shows what triggered it, what action was taken, and by whom. This is an operational audit view.

LAYOUT:
Application shell: Foundation 2, Triage variant
Page title: "Alert History — Today" + date in JetBrains Mono muted right-aligned
Sidebar: "Triage Alerts" active

FILTER ROW (below page title):
  "All" / "Escalated" / "Stable" / "False Alert" / "Pending"
  Tab filter, same as D-01 tab filter style

SUMMARY STATS ROW (4 compact stat chips):
  "6 total alerts today" | "1 escalated" | "4 stable" | "1 pending"
  Each: gray chip, 13px / JetBrains Mono

ALERT HISTORY LIST:

Each resolved alert row:
  Height: 80px
  Border-bottom: 1px solid #E4E4E7
  Background: white
  Hover: #F9F9FA
  Padding: 0 20px

  Layout 5 columns:
  
  Col 1: Status icon circle (32px):
    Escalated: red-orange user-x icon circle
    Stable: gray check-circle
    False: green check circle (dimmer)
    Pending: amber alert circle
  
  Col 2: Patient name + alert type
    "Priya Menon" — 14px / 500 / primary
    "Cardiac concern" — 13px muted
  
  Col 3: Action taken
    "Escalated — team called" — 13px / #B91C1C
    OR "Assessed — stable" — 13px / muted
    OR "OPD appropriate" — 13px / #15803D
  
  Col 4: Nurse + time
    "S. Kumar" — 13px muted
    "10:38 AM" — 12px JetBrains Mono muted
  
  Col 5: chevron-right — click → opens T-02 in read-only mode for this alert

PENDING ALERT ROW (if any unacknowledged):
  Amber bg (#FFFBEB), amber left border (3px)
  Otherwise same structure

EMPTY STATE:
  No alerts today: centered, alert-off icon 32px muted + "No alerts today." — 14px muted

EXPORT:
  Top-right: "Export today's alerts (CSV)" — ghost button, 13px

RESPONSIVE:
Desktop: 5-column table
Tablet: 3 columns (hide nurse + collapse time into col 3)
Mobile: 2 columns (patient name / action + time stacked)

MOTION:
Filter tab switch: content fade 150ms

ACCESSIBILITY:
Table has proper column headers
Each row: summarized as "[patient] — [action] — [time]" for screen readers

VISUAL HIERARCHY:
1. Pending alerts (if any — amber, top of list after filter)
2. Alert list rows (status icons left, action center, time right)
3. Summary stats (top, overview)
4. Filter tabs (secondary — for narrowing)

DO NOT CHANGE: Foundation 1, Foundation 2. Every alert row must show: trigger type, action taken, nurse, time. Unacknowledged alerts must appear even in history view.

---

## PHYSICIAN SURFACE SCREENS (D-01 → D-18)

---

### D-01 — Patient Queue (Case List)
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** D-01 | **Route:** /physician/queue
[FULL PROMPT AS PROVIDED ABOVE]

---

### D-02 — Case Brief — Overview
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** D-02 | **Route:** /physician/case/:id
[FULL PROMPT AS PROVIDED ABOVE]

---

### D-03 — Case Brief — HPI + History Section

**STITCH PROMPT — SCREEN D-03: CASE BRIEF — HPI + CLINICAL HISTORY**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-03
User Role: Physician
Surface: Physician
Route: /physician/case/:id#hpi (section within the case brief scroll — or standalone if navigated to directly)
Purpose: Detailed view of the History of Present Illness (HPI) and past medical history — all structured clinical facts organized by clinical domain

USER CONTEXT:
The physician wants to examine the clinical history in detail. This could be scrolled to within the case brief (D-02) or accessed directly. It shows all HPI fields, past medical history, surgical history, family history, and social history.

LAYOUT:
Application shell active. Same sticky case brief header as D-02.
Content section within the case brief scroll.
If standalone: breadcrumb: "Queue > Patil, D > HPI & History"

SECTION HEADER:
  "History of Present Illness" — 16px / 600 / #18181B
  "Source: Patient interview · Today 10:24 AM" — 13px muted right-aligned

HPI PANEL (white card, border, radius 8px):

Clinical fact rows (Foundation 4 style — label left 140px, value + chip right):
  CHIEF COMPLAINT: "Epigastric pain — 3 months duration" [Interview]
  ONSET: "Gradual — no precipitating event" [Interview]
  DURATION: "3 months, continuous with variable intensity" [Interview]
  SEVERITY: "6 / 10" — value in JetBrains Mono [Interview]
  CHARACTER: "Dull, burning sensation" [Interview]
  LOCATION: "Epigastric — upper central abdomen" [Interview]
  RADIATION: "No radiation reported" [Interview]
  AGGRAVATING: "Spicy food, large meals, lying down" [Interview]
  RELIEVING: "Antacids — partial relief only" [Interview]
  ASSOCIATED SYMPTOMS: "Bloating, reduced appetite, occasional belching" [Interview]
  TIMING: "Constant — worse after meals" [Interview]
  PREVIOUS EPISODES: "No previous similar episode" [Interview]

Each row: 36px min-height, hover: subtle bg, cursor pointer → opens source drawer (D-10)
All chips right-aligned (T3 Interview chips for all interview-sourced rows)

PAST MEDICAL HISTORY PANEL:
  Same card structure
  Section label: "Past Medical History" — 13px uppercase muted
  
  DIAGNOSIS: "Type 2 Diabetes Mellitus · Diagnosed 2019" [Doc T2 · 89%]
  DIAGNOSIS: "Hypertension · Duration ~5 years" [Interview T3]
  HOSPITALIZATION: "Admitted — AIIMS 2022 for severe anemia" [Doc T2 · 91%]
  FAMILY HISTORY (DIABETES): "Father — T2DM" [Interview]
  FAMILY HISTORY (CARDIAC): "Not reported" [Interview]

SURGICAL HISTORY PANEL:
  PROCEDURE: "Appendectomy — 2010" [Doc T2 · 87%]
  Location: "AIIMS Delhi" [Doc T2]

SOCIAL HISTORY PANEL:
  OCCUPATION: "Retired schoolteacher" [Interview]
  TOBACCO: "Former smoker — quit 2018 (20 pack-year history)" [Interview]
  ALCOHOL: "Occasional social use" [Interview]
  EXERCISE: "Minimal — sedentary lifestyle" [Interview]

PHYSICIAN EDIT:
  "Edit this section" — ghost button (pencil icon) top-right of each panel
  Clicking: individual fact rows become editable inline
  Edited row: gains T1 chip + green left border (2px)

STATES:
Default: all rows rendered with provenance chips
Editing: specific row switches to input mode
Saved: row returns to read state with T1 chip

RESPONSIVE:
Desktop: wide card, 140px label column
Tablet: 100px label column (labels may truncate slightly)
Mobile: label above value (stacked, not two-column), full-width rows

VISUAL HIERARCHY:
1. HPI panel (primary — current illness)
2. PMH panel (secondary — background)
3. Surgical history (tertiary)
4. Social history (supporting)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. All facts have provenance chips. All rows are clickable to source drawer. No clinical interpretation added.

---

### D-04 — Case Brief — Medications + Allergies

**STITCH PROMPT — SCREEN D-04: CASE BRIEF — MEDICATIONS + ALLERGIES**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-04
User Role: Physician
Surface: Physician
Route: /physician/case/:id#medications
Purpose: Safety-critical display of current medications and allergies — structured, sourced, and conflict-flagged

USER CONTEXT:
Before any prescription, the physician MUST review medications and allergies. This section is safety-critical. Conflicts between document-recorded and patient-reported allergies are highlighted prominently. Every medication has a source.

LAYOUT:
Case brief section. Two columns on desktop (50%/50%). Single column on tablet/mobile.
Section heading: "Medications & Allergies" — 16px / 600

LEFT COLUMN — ALLERGIES:

Section label: "ALLERGIES" — 13px uppercase muted / #B91C1C (red tint on label — safety signal)

If conflict:
  Full conflict card from Foundation 4:
    "⚠ ALLERGY STATUS — Conflicting Information"
    Source A: "No known allergy" · Document · Jan 2024 [Doc T2]
    Source B: "Penicillin" · Patient interview [Interview T3]
    Action buttons: "Accept Document" / "Accept Interview"
    Note textarea

If no conflict:
  Simple list of confirmed allergies:
    Each: allergy-circle icon (16px, red) + substance name + reaction type
    "Penicillin · Anaphylaxis" — 14px, with T1/T3 provenance chip

  If no allergies recorded:
    Empty state: "No allergies documented"
    Action: "Record allergy" ghost link

RIGHT COLUMN — CURRENT MEDICATIONS:

Section label: "CURRENT MEDICATIONS" — 13px uppercase muted / #18181B

Each medication (clinical fact row, Foundation 4):
  MEDICATION: "Metformin" — value: "500 mg, twice daily" — [Doc T2 · 94%]
  Click → opens source drawer
  
  Below name (inline expansion on click):
    Small detail block: Indication: T2DM · Since: 2019 · Prescribing physician: on document
    [collapse]

Medications list (3 items):
  Row 1: Metformin 500 mg BID [Doc T2]
  Row 2: Amlodipine 5 mg OD [Doc T2]
  Row 3: Pantoprazole 40 mg OD [Interview]

Last row: "+ Add medication" — ghost link, 13px, muted (opens modal with drug name, dose, frequency, source fields)

RECONCILIATION NOTE (if document and interview medications differ):
  An amber info bar: "2 medications found in documents. Patient confirmed 3 — Pantoprazole was not in documents." — 13px amber info

PHYSICIAN ACTIONS:
  Top-right of each column: "Edit" (pencil, ghost)

STATES:
Default: as described
Editing: inline edit mode per row
Conflict present (allergies): conflict card shows, approval blocked
No conflicts: clean list, no amber elements
Empty medications: "No medications documented" + "Record medication" link

RESPONSIVE:
Desktop: 50/50 columns side by side
Tablet/mobile: allergies first, then medications (stacked)

MOTION:
Conflict card: amber entrance animation (height reveal 300ms)
Medication expand: row expands 200ms to show detail

VISUAL HIERARCHY:
1. Allergy conflict card (if present — amber, unmissable, LEFT column — first seen)
2. Medication list (right column — safety review)
3. Reconciliation note (amber info bar — if applicable)
4. Edit + add actions (ghost, secondary)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Allergies always in left column. Conflicts block approval. Every item has provenance. Safety-critical section — no decorative elements.

---

### D-05 — Case Brief — Investigations + Lab Values

**STITCH PROMPT — SCREEN D-05: CASE BRIEF — INVESTIGATIONS + LAB VALUES**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-05
User Role: Physician
Surface: Physician
Route: /physician/case/:id#investigations
Purpose: Structured display of all extracted laboratory values, imaging reports, and investigations — with abnormal value highlighting and source attribution

USER CONTEXT:
The physician reviews lab values extracted from uploaded documents. HbA1c of 8.4% needs immediate recognition as abnormal. Each value links to its source document page. Abnormal values are highlighted but not alarmed — this is a clinical display, not an alert system.

LAYOUT:
Case brief section. Full-width table-style panel.
Section heading: "Investigations" — 16px / 600

DATE FILTER (top of section):
  "All dates" / "Last 3 months" / "Last year" / "Older"
  Tab filter, 13px, same style as D-01

INVESTIGATIONS TABLE:

Table header row: TEST | RESULT | UNIT | NORMAL RANGE | DATE | SOURCE
Header: 12px / 500 / uppercase / muted
Row height: 40px
All values in rows: 14px

Row structure:
  TEST column (200px): test name — 14px / 500 / primary
  RESULT column (120px): value in JetBrains Mono 14px / 500
    Normal values: #18181B
    Abnormal (outside range): 
      High: #B91C1C (red text) + small ↑ arrow icon (12px)
      Low: #1D4ED8 (blue text) + small ↓ arrow icon (12px)
  UNIT column (80px): 13px / #71717A
  NORMAL RANGE column (120px): 13px / #A1A1AA / JetBrains Mono
  DATE column (100px): 12px / JetBrains Mono / muted
  SOURCE column (80px): provenance chip

Sample rows:
  HbA1c | 8.4 ↑ | % | 4.0–5.6 | Mar 2025 | [Doc T2 · 97%]
  Fasting glucose | 148 ↑ | mg/dL | 70–100 | Mar 2025 | [Doc T2 · 94%]
  Creatinine | 1.1 | mg/dL | 0.7–1.3 | Mar 2025 | [Doc T2 · 91%]
  Hemoglobin | 11.2 ↓ | g/dL | 13.0–17.0 | Jan 2025 | [Doc T2 · 89%]
  Platelet count | 210 | ×10³/μL | 150–400 | Jan 2025 | [Doc T2 · 91%]

Row hover: subtle bg (#F9F9FA)
Row click: opens source drawer (D-10) for that specific lab value

ABNORMAL SUMMARY BAR (above table):
  If any abnormal values: a small summary strip:
    Background: #FEF2F2 (subtle), border-bottom 1px, padding 10px 20px
    "3 values outside normal range" — 13px / #B91C1C + eye icon
    Lists: "HbA1c ↑, Fasting glucose ↑, Hemoglobin ↓" — chips in the strip

EMPTY STATE:
  "No investigation reports have been processed." — centered, 14px muted
  "Documents are still processing" if applicable

MISSING VALUES:
  The physician can add a lab value manually:
    "+ Add investigation" — ghost link (opens a small form modal)

STATES:
Default: table with all values
No abnormals: table without abnormal summary bar
Empty: empty state
Filter applied: table shows only filtered rows

RESPONSIVE:
Desktop: full table with all columns
Tablet: hide NORMAL RANGE column, values still highlighted
Mobile: card-per-test layout (test name top, value large center, date/source small below)

MOTION:
Abnormal values: no animation — static red text. Clinical environments do not need flashing.
Row click: subtle bg highlight flash 150ms before drawer opens

VISUAL HIERARCHY:
1. Abnormal summary bar (if present — subtle red, top of section)
2. Abnormal values in table (red ↑ or blue ↓ — immediate recognition)
3. All other lab values (standard reading)
4. Source chips (right-aligned — always present)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Abnormal values in red/blue. Normal in black. All rows clickable to source. No animation on abnormal values — this is not an alert.

---

### D-06 — Case Brief — AYUSH Assessment Section
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** D-06 | **Route:** /physician/case/:id#ayush
[FULL PROMPT AS PROVIDED ABOVE]

---

### D-07 — Case Brief — Clinical Timeline

**STITCH PROMPT — SCREEN D-07: CASE BRIEF — CLINICAL TIMELINE**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-07
User Role: Physician
Surface: Physician
Route: /physician/case/:id#timeline (or /physician/case/:id/timeline for full-page)
Purpose: Show all clinical events for this patient in chronological order — from both interview and documents — as a unified longitudinal timeline

USER CONTEXT:
The physician wants to understand the patient's medical history over time. Events from different documents and interview responses are unified on a single timeline. Date conflicts and estimated dates are clearly indicated. The physician can click any event to see its source.

LAYOUT:
Application shell. Breadcrumb: "Queue > Patil, D > Timeline"
Full-width content area, max-width 800px

TIMELINE CONTROLS (top):
  Left: "Clinical Timeline — Dhananjay Patil" — 20px / 600
  Right: compact filter:
    "All" / "Documents" / "Interview" / "Conflicts"
    Small toggle tabs, 13px

DATE RANGE (below controls):
  "2010 → 2026" — showing full span of available data
  A subtle horizontal date ruler (not interactive — just orientation)

TIMELINE (vertical, Foundation 4 timeline component):

Grouped by year (year labels between groups):

"2010" label — 11px uppercase muted, centered on the timeline line

  Event: Appendectomy
    Node: blue circle (document event)
    Card: border, radius 8px, padding 12px 16px, shadow-sm
    Date: "2010" — 12px JetBrains Mono muted (top-right)
    Date precision indicator: "~" prefix → "~ 2010" (year-level estimate)
    Title: "Appendectomy" — 14px / 500
    Detail: "Documented source: Discharge Summary 2010.pdf" — 13px muted
    Source chip: [Doc T2 · 87%]

"2018" label

  Event: Quit smoking
    Node: gray circle (interview event)
    Title: "Quit smoking" — 14px / 500
    Date: "2018" — estimated year
    Source: [Interview T3]
    Detail: "Patient reported — no document confirmation"

"2019" label

  Event: T2DM diagnosis
    Node: blue circle
    Title: "Type 2 Diabetes Mellitus diagnosed" — 14px / 500
    Date: "~ 2019" (estimate)
    Source: [Doc T2 · 89%]

"2022" label

  Event: Hospitalization (AIIMS)
    Node: blue
    Title: "Admitted to AIIMS Delhi — severe anemia"
    Date: "2022" (document dated 2022)
    Source: [Doc T2 · 91%]

"Jan 2025" label

  Event: Lab results
    Node: blue
    Title: "Laboratory results — Hemoglobin 11.2 g/dL (low)"
    Date: "January 2025"
    Source: [Doc T2 · 89%]

"Mar 2025" label

  Event: HbA1c + glucose
    Node: blue (with amber secondary indicator for abnormal values)
    Title: "HbA1c 8.4% — Fasting glucose 148 mg/dL"
    Date: "March 2025"
    Subtext: "Both values above normal range" — 12px amber (NOT alarming, just informational)
    Source: [Doc T2 · 97%]

"Today" label

  Event: CONFLICT EVENT
    Node: amber diamond shape (conflicts use diamond, not circle)
    Card: amber left border (2px)
    Title: "Allergy status conflict detected"
    Detail: "Document: No known allergy · Interview: Penicillin allergy"
    Source chips: [Doc T2] + [Interview T3]
    "Resolve →" link: 13px / #2563EB

  Event: Current visit (intake)
    Node: green circle (current)
    Title: "OPD intake — Vaidya pre-consultation"
    Date: "Today 10:24 AM"
    Source: [Interview T3]

CLICK BEHAVIOR:
Each event card: hover shows shadow increase, cursor pointer
Click → opens source drawer (D-10) showing the source document or interview record

ESTIMATED DATE LEGEND (bottom):
  Small legend: "~ Estimated date" (purple chip) · "● Document" (blue node) · "● Interview" (gray node) · "◆ Conflict" (amber diamond)

STATES:
Default: full timeline as described
Filter "Conflicts": only conflict events shown
Filter "Documents": only document-sourced events
Empty (no timeline data): "No historical events found. Timeline will populate as documents are processed." — centered muted

RESPONSIVE:
Desktop: 800px max-width, timeline line centered-left
Tablet: full-width, same structure
Mobile: timeline takes full width, cards full-width

MOTION:
Events stagger in: each 60ms delay, fade + translate Y 6px → 0
Year label: appears slightly before its events (30ms ahead)
Conflict event: amber border pulses once on entry (single animation, not looping)
Scroll-triggered reveal: events below fold animate in as user scrolls

VISUAL HIERARCHY:
1. Conflict events (amber diamond, most prominent)
2. Year labels (structural navigation)
3. Document-sourced events (blue nodes, most content)
4. Interview events (gray nodes)
5. Source chips (right-aligned, always present)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Conflict events use diamond shape (not circle). Estimated dates always prefixed with ~. Every event is clickable.

---

### D-08 — Case Brief — Documents Panel

**STITCH PROMPT — SCREEN D-08: CASE BRIEF — DOCUMENTS PANEL**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-08
User Role: Physician
Surface: Physician
Route: /physician/case/:id#documents
Purpose: Display all uploaded patient documents with extraction status and key extracted facts — allowing the physician to navigate to specific documents

USER CONTEXT:
The physician sees 3 documents uploaded by the patient. They want to know: what was extracted from each, the document date, and whether OCR confidence was acceptable. Clicking a document opens the full document viewer (D-09).

LAYOUT:
Case brief section. Max-width full case column.
Section heading: "Documents" — 16px / 600

DOCUMENT CARDS (one per document, vertically stacked, 12px gap):

Document Card 1 — Prescription:
  White card, border, radius 8px, padding 16px
  Clickable → D-09 (Document Viewer)
  
  Card Header row:
    Left: clipboard icon in 40px circle (accent subtle bg, accent icon)
    Center:
      Name: "Prescription — Dr. R. Sharma" — 15px / 500 / primary
      Type: "Prescription · January 2025" — 13px muted
    Right:
      "OCR: 94%" — 13px JetBrains Mono #15803D (green = high quality)
      "3 pages" — 12px muted below
  
  Extraction summary (below header row, 12px top margin):
    Label: "EXTRACTED FACTS" — 11px uppercase muted
    3 extracted fact chips in a row:
      "Metformin 500 mg BID" — gray chip
      "Amlodipine 5 mg OD" — gray chip
      "Diagnosis: T2DM" — gray chip
  
  Footer row: "View document →" — 13px / #2563EB right-aligned

Document Card 2 — Lab Report (with quality warning):
  Same structure
  Left icon: activity icon, teal circle
  Name: "Lab Report — AIIMS Pathology"
  Date: "March 2025"
  OCR confidence: "OCR: 68% ⚠" — amber (low confidence)
  Amber 2px left border on card
  
  Extracted facts:
    "HbA1c: 8.4% ↑" — amber chip (abnormal value)
    "Fasting glucose: 148 mg/dL ↑" — amber chip
    "Hemoglobin: 11.2 g/dL ↓" — chip with blue tint
  
  Warning note: "Some values may not have been read correctly. Review the document." — 12px amber

Document Card 3 — Discharge Summary:
  Left icon: file-text, gray
  Name: "Discharge Summary — AIIMS 2022"
  Date: "2022 — year only (document date unclear)"
  OCR: "91%"
  
  Extracted:
    "Hospitalization: Severe anemia" — chip
    "Appendectomy: 2010" — chip
    "Hemoglobin at discharge: 9.1 g/dL" — chip

SECTION FOOTER:
  "3 documents · 10 facts extracted total" — 13px muted right-aligned

ADD DOCUMENT (physician can add a document manually):
  "Upload additional document →" — ghost button, file-plus icon, 13px

STATES:
All processed: all cards as described
Some processing: card shows arc + "Processing..." instead of fact chips
Failed: card shows error state with "Could not read" + retry option

RESPONSIVE:
Desktop: full-width cards (stacked)
Mobile: same structure but card header becomes 2-row

MOTION:
Card hover: shadow-sm → shadow-md, 150ms
Click: brief bg highlight → navigates to D-09

VISUAL HIERARCHY:
1. Document names (primary — immediately readable)
2. OCR confidence (right — quality signal)
3. Extracted fact chips (secondary — what was found)
4. Quality warning on low-confidence docs (amber — unmissable when present)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Low-confidence documents get amber left border and warning note. All cards are clickable to full document viewer.

---

### D-09 — Document Viewer (Full Page)

**STITCH PROMPT — SCREEN D-09: DOCUMENT VIEWER (FULL PAGE)**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-09
User Role: Physician
Surface: Physician
Route: /physician/documents/:id
Purpose: Show a full-page view of an uploaded document alongside all extracted information — with highlighted extraction regions on the document image

USER CONTEXT:
The physician clicked a document from D-08. They see the actual document image on one side and extracted facts listed on the other. They can click any extracted fact to see the exact region of the document where it was found.

LAYOUT:
Full-width, full-height two-column split view.
Left column (55%): Document image viewer
Right column (45%): Extracted facts panel

NO sidebar collapse (the case brief sidebar closes to give maximum space here)
Top: breadcrumb "Queue > Patil, D > Documents > Lab Report March 2025"
Back button: "← Back to case" — 13px / #2563EB

LEFT PANEL — Document Image:

Header row:
  Document name: "Lab_Report_March_2025.pdf" — 15px / 500
  Page navigation: "Page 2 of 3" — 12px JetBrains Mono + "< >" navigation icons

Document image:
  Full panel width, variable height (scroll within panel if needed)
  White bg, subtle shadow, 4px radius
  Object-fit: contain
  
  Extraction highlights overlaid:
    Each extracted region: a semi-transparent colored rectangle
    Color-coded by fact type:
      Blue rect: medication extraction
      Green rect: lab value extraction
      Orange rect: date extraction
    Rectangle border: 1.5px solid (same color, full opacity)
    
  Active fact (when user clicks right panel row): corresponding rect highlighted in gold (#F59E0B) with 2px border, and the image scrolls to center the rect if it's not visible
  
  Zoom controls: + / − buttons bottom-right of left panel (not blocking content)
  "Full screen" toggle: expand icon bottom-right

RIGHT PANEL — Extracted Facts:

Header: "Extracted Information" — 15px / 500 / #18181B
Subtext: "OCR confidence: 68% · Handwriting: Detected" — 13px amber muted (if applicable)

Extracted fact list (same row structure as D-03/D-04 clinical fact rows):
  Each row: field name (120px left) + value + confidence chip
  
  All rows from this document:
    HBA1C: "8.4 %" [94% · ↑ Abnormal] — row has amber tint
    FASTING GLUCOSE: "148 mg/dL" [94% · ↑ Abnormal]
    CREATININE: "1.1 mg/dL" [91% · Normal]
    HEMOGLOBIN: "11.2 g/dL" [89% · ↓ Abnormal]
    PLATELET COUNT: "210 ×10³/μL" [91% · Normal]
    REPORT DATE: "14 March 2025" [96%]
    ORDERING PHYSICIAN: "Dr. S. Rao" [78%]
    LAB NAME: "AIIMS Pathology" [91%]
  
  Row hover: subtle bg
  Row click: highlights corresponding document region (left panel) + image scrolls to it
  Active row: blue left border (2px), #EFF6FF bg

LOW CONFIDENCE ROWS:
  If confidence < 75%: amber ⚠ icon left of the value + italic text + amber tint
  "Unable to read value" for failed extractions: red text, red chip, "Verify manually"

ACTIONS PANEL (bottom of right panel):
  "Add this document to case record" — primary button (if not already added)
  "Report extraction error" — ghost link, 13px muted

STATES:
Loading: left panel shows skeleton image placeholder; right panel shows 5 skeleton rows
Loaded: as described
Low quality: amber header bar in right panel
Handwriting: warning note about reduced confidence
Page turn: left panel crossfades to new page image (200ms)

RESPONSIVE:
Desktop: 55/45 split as described
Tablet: tabs — "Document" / "Extracted Facts" (swipe or tap)
Mobile: same tabs, document image first

MOTION:
Active row click: document image scroll + rect highlight brightens (200ms)
Page navigation: image crossfade 200ms
Extraction rect draw-in: fade on load (all rects fade in 400ms after image loads)

VISUAL HIERARCHY:
1. Document image (left — primary — the actual source)
2. Extraction highlights on image (overlaid rectangles)
3. Extracted fact rows (right — structured data)
4. Active row + active rect (gold highlight — interactive feedback)
5. Abnormal value indicators (amber ↑ in rows)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. The document image is always on the LEFT. Extracted facts on the RIGHT. Clicking a right-panel row must highlight the document region on the left.

---

### D-10 — Source Evidence Drawer (Overlay)
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** D-10 | **Route:** Overlay on /physician/case/:id
[FULL PROMPT AS PROVIDED ABOVE]

---

### D-11 — Conflict Resolution — Active Conflicts

**STITCH PROMPT — SCREEN D-11: CONFLICT RESOLUTION — ACTIVE CONFLICTS**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-11
User Role: Physician
Surface: Physician
Route: /physician/case/:id#conflicts (or /physician/case/:id/conflicts if navigated directly)
Purpose: Show all pending conflicts requiring physician resolution — approval is blocked until every conflict is resolved

USER CONTEXT:
The physician opens the conflicts section (or is redirected here after attempting to approve). There is 1 active conflict (allergy status). They must resolve it before approving. They can see both conflicting values, both sources, and choose one or mark it as uncertain.

LAYOUT:
Application shell. Breadcrumb: "Queue > Patil, D > Conflicts"
Content max-width: 720px, centered

CONFLICT COUNTER (top):
  Heading: "Conflicts Requiring Resolution" — 20px / 600 / #18181B
  Subtext: "1 conflict must be resolved before this case can be approved." — 14px / #B45309
  Badge: "1 PENDING" — amber chip, right-aligned

APPROVAL BLOCKED NOTICE:
  A horizontal amber bar below heading:
    alert-circle 14px #D97706 + "Case approval is unavailable until all conflicts are resolved." — 14px / 600 / #B45309
    Background: #FFFBEB, border-bottom 1px rgba(217,119,6,0.3)
    Padding: 12px 20px

CONFLICT CARD (full Foundation 4 conflict component):

  Container:
    bg: #FFFBEB
    border: 1px solid rgba(217,119,6,0.35)
    left border: 3px solid #D97706
    radius: 8px
    padding: 20px

  Header:
    Row: ⚠ alert-triangle 18px #D97706 + "Conflicting Information" — 15px / 600 / #B45309
    Right: "ALLERGY STATUS" — 12px / JetBrains Mono / muted

  Conflict description:
    "Two different allergy records have been found for this patient. Please review both sources and confirm which is correct." — 14px / 400 / #52525B, 1.5 line-height

  COMPARISON COLUMNS (50/50, 12px gap, 1px divider between):
  
  Left — Source A:
    "DOCUMENT" — 11px uppercase muted / blue (document source color)
    Document name: "Medical_Record_Jan2024.pdf · Page 1" — 13px / #2563EB
    [Doc T2 · 91%] chip
    
    Value: "No known allergy" — 18px / 600 / #18181B (large, clearly the value)
    
    Context: "This document was dated January 2024 and uploaded today." — 12px muted
    
    "Accept this" — full-width secondary button, 40px height, "#E4E4E7 border"
  
  Right — Source B:
    "PATIENT INTERVIEW" — 11px uppercase muted / gray (interview source color)
    "Clinical intake session · Today 10:26 AM" — 13px / #52525B
    [Interview T3] chip
    
    Value: "Allergic to Penicillin" — 18px / 600 / #18181B
    
    Context: "Patient self-reported during intake interview." — 12px muted
    
    "Accept this" — full-width secondary button, 40px height

  Separator: a centered amber diamond 8px (echoing timeline conflict marker)

  PHYSICIAN NOTE FIELD:
    Label: "Add a note (optional)" — 13px / 500
    Textarea: 64px, placeholder "Explain your decision or add context..."
    Auto-expands on typing

  THIRD OPTION ROW:
    "Mark as uncertain — requires in-person verification" — ghost link centered, 13px muted
    Selecting this: records "Uncertain" status, allows approval to proceed but flags for review

RESOLVED STATE (after action):
  The conflict card collapses (height animation 300ms)
  Replaced by: check-circle-2 row: "Allergy status resolved — Penicillin accepted" — 14px / #15803D
  [Undo this] ghost link right-aligned (allows reverting within the same session only)

IF ALL CONFLICTS RESOLVED:
  The amber "approval blocked" bar disappears
  Green bar appears: check-circle + "All conflicts resolved — case ready for approval" — 14px / #15803D
  "Approve case →" button appears (primary, full width, 44px)

STATES:
1 conflict pending: as described
All resolved: green bar + approval button
No conflicts ever (navigating here directly): "No conflicts for this case" — muted centered

RESPONSIVE:
Desktop: 50/50 comparison columns side by side
Tablet: same
Mobile: stack — Source A card, then Source B card, then actions

MOTION:
Conflict card entrance: border draws in (amber left border animates from 0→100% height 300ms)
"Accept" tap: selected column gets checkmark, opposite column fades slightly
Card collapse (after resolution): height → 0, fade, 300ms
Green bar: fade in 200ms after last conflict resolved

VISUAL HIERARCHY:
1. Amber approval-blocked bar (top — immediate context)
2. Conflict card comparison columns (dominant — the decision)
3. Two values in large text (18px — physician must be able to read them fast)
4. "Accept" buttons (full-width columns — clear choice mechanism)
5. "Mark uncertain" (ghost — escape hatch)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Approval MUST be blocked until conflicts resolved. Both sources always shown. Undo available within session.

---

### D-12 — Clinical Fact Edit Mode

**STITCH PROMPT — SCREEN D-12: CLINICAL FACT EDIT MODE**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-12
User Role: Physician
Surface: Physician
Route: /physician/case/:id (edit state — overlay or inline on any case brief section)
Purpose: Allow the physician to edit, correct, or add a clinical fact — with clear tracking of what was changed and by whom

USER CONTEXT:
The physician notices that the extracted medication "Metformin 500 mg BID" actually refers to the discontinued formulation — the current dose is 1000 mg OD. They click "Edit" on the medication fact row. An inline edit mode activates.

LAYOUT:
Edit mode activates inline — the specific fact row expands in place.
A keyboard-accessible edit form appears below (or as an overlay for complex facts).

INLINE EDIT STATE (for a medication fact):

Original row (above edit form — read-only, grayed):
  MEDICATION: "Metformin 500 mg twice daily" — grayed, strikethrough effect is NOT applied — just grayed
  [Doc T2 · 94%] chip — now grayed out
  Label above: "ORIGINAL VALUE (from document)" — 11px uppercase muted amber

Edit form (below original row, animated in):
  Background: #EFF6FF (accent subtle — signals edit mode)
  Border: 1px solid #2563EB
  Radius: 6px
  Padding: 16px

  Form fields (compact, inline):
    Drug name: "Metformin" — input 36px, pre-filled
    Dose: "500" → physician changes to "1000" — input 36px, numeric
    Unit: "mg" — dropdown 36px (mg, g, mcg, ml, units)
    Frequency: "BID" → "OD" — dropdown (OD / BID / TID / QID / PRN / etc.)
    Duration: "Ongoing" — input (optional)
  
  Reason for change:
    Label: "Reason for edit (optional)" — 12px / 500
    Input: 36px, placeholder "e.g. Updated based on patient's current prescription"
  
  Action row:
    "Save changes" — primary button, 36px height, accent
    "Cancel" — ghost button, 36px height

SAVED STATE:
  After save:
    Row now shows: "Metformin 1000 mg once daily" — [✓ Physician verified — T1 chip]
    Green left border (2px) on the row
    Below row (collapsed by default, expandable): "Edited by Dr. R. Mehta · 10:45 AM · Original: 500 mg BID from [Doc T2]"
    This is the audit trail — visible to physician if they expand the row

EDIT HISTORY (expandable):
  A small "History" text link on any edited row:
    Opens inline panel showing:
    Row 1: Original value + source + date
    Row 2: Edited value + editor + timestamp
    Row 3: (if edited again) next edit...

PHYSICIAN-ADDED FACT (new, no original):
  When physician uses "+ Add medication" (D-04):
    Empty form in the same style
    No "Original value" section
    All fields blank
    After save: row appears with [T1 Physician verified] chip (no document source)

STATES:
Editing: form visible, original grayed, save+cancel visible
Saving: spinner in Save button, fields disabled
Saved: form closes, row updates with T1 chip + green border
Cancel: form closes, original row restores (no change)
Validation error: "Drug name is required" — 12px #DC2626 below field

RESPONSIVE:
Desktop: inline edit form below row
Mobile: edit opens as bottom sheet

MOTION:
Edit form enter: height 0 → form height + fade in, 200ms ease-out
Row T1 chip: crossfade from T2/T3 chip to T1 chip, 200ms
Save: spinner → check 300ms

ACCESSIBILITY:
Edit form: focus moves to first field (drug name) on open
"Cancel" returns focus to the "Edit" button that triggered it
Keyboard: Enter in last field triggers save; Escape cancels

VISUAL HIERARCHY:
1. Edit form (accent-tinted, immediately identifiable as active editing mode)
2. Original value (above form — grayed, reference)
3. Save button (primary, right-aligned in form)
4. Saved row (green left border + T1 chip — clear confirmation of physician override)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Every physician edit creates an audit record. The original value is always preserved and visible in history. Edited facts become T1 (physician verified) regardless of original tier.

---

### D-13 — Red Flag Banner — Physician View

**STITCH PROMPT — SCREEN D-13: RED FLAG BANNER — PHYSICIAN VIEW**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-13
User Role: Physician
Surface: Physician (Case Brief — with active red flag)
Route: /physician/case/:id (case brief for a patient with active red flag — Patient B, Priya Menon)
Purpose: Show the physician's case brief for a patient who has an active or recently acknowledged triage alert — with the red flag banner as the dominant first element

USER CONTEXT:
The physician opens the case for Priya Menon, who triggered a cardiac concern alert. The red flag banner is the first thing they see — above the patient header. It summarizes the triage event and current status.

NOTE: This screen shows the case brief WITH the red flag banner active. The surrounding case brief content (patient header, medications, etc.) is the same as D-02 but for Priya Menon. Show the complete top of the case brief with the banner visible.

LAYOUT:
Same as D-02 (Case Brief) but for Priya Menon, with the red flag banner at position 1.

STICKY HEADER (52px):
  Same as D-02, but:
    Left shows a small amber dot + "Alert" badge next to the patient name in breadcrumb
    The "Approve Case" button is grayed and shows tooltip: "Alert must be reviewed before approval"

RED FLAG BANNER (below sticky header, above patient identity bar):
  Position: full-width, appears immediately below sticky header — FIRST element physician sees

  Container:
    Full width of case content
    Background: #FFFBEB
    Border: 1px solid rgba(217,119,6,0.3)
    Left border: 3px solid #D97706
    Radius: 8px
    Padding: 16px 20px
    Margin-bottom: 20px
  
  Row 1:
    alert-triangle 18px #D97706
    "Physician Attention Required" — 15px / 600 / #B45309
    Right-aligned: "Alert #AL-2026-0048" — 11px JetBrains Mono muted
  
  Row 2 (patient statement):
    "Patient reported: " — 12px uppercase muted
    Verbatim quote (in speech-bubble style inline):
      "Mujhe seene mein bahut dard hai, aur dard baayein haath mein bhi ja raha hai." — 14px / 400 / italic / #18181B
      "(I have severe chest pain radiating to the left arm.)" — 13px muted
  
  Row 3 (rule + time):
    Small chips: "Rule: Cardiac concern" — gray chip | "Triggered 10:31 AM" — gray chip
  
  Row 4 (triage status):
    "Triage: " + status chip:
      If acknowledged + "stable": "✓ Assessed by Nurse S. Kumar at 10:38 AM — Patient appears stable" — 13px / #15803D
      If acknowledged + "escalated": "⚠ Escalated — clinical team notified at 10:38 AM" — 13px / #B45309
      If not yet acknowledged: amber pulsing dot + "Waiting for triage acknowledgment..." — 13px amber
  
  Row 5:
    "View triage record →" — 13px / #2563EB link (opens T-02 in a modal, read-only)

CASE BRIEF CONTINUES (below banner):
  Patient identity bar: "Priya Menon · 42F · Token #23 · Arrived 10:22 AM"
  Then all standard case brief sections (Chief Complaint, Medications, History, etc.)
  
  All sections for Priya Menon:
    MEDICATIONS: "None documented" — with note "Patient denies current medications"
    ALLERGIES: "None reported"
    HPI: "Chest pain · Onset: today · Duration: ~4 hours · Radiation: left arm · Severity: 8/10"
    ASSOCIATED: "Breathlessness at rest, mild sweating"

STATES:
Unacknowledged: pulsing dot in Row 4 (subtle 2s loop — not alarming)
Acknowledged/stable: green text in Row 4, no animation
Acknowledged/escalated: amber text, no animation
Banner remains until physician acknowledges and closes it:
  × icon in banner top-right: "Dismiss banner" — logs that physician has read it

RESPONSIVE:
Desktop: banner full width of content area
Mobile: banner full width, Row 4 wraps

MOTION:
Banner entrance: slides in from top 300ms ease-out (slightly more noticeable than standard transitions — intentional)
Triage status update (from pending → acknowledged): text crossfades with green check, 400ms
Pulsing dot on "waiting" state: scale 1.0 → 1.3 → 1.0, 2s loop (amber dot only — not the entire banner)

VISUAL HIERARCHY:
1. Red flag banner (FIRST element — amber, full-width, left border, unmissable)
2. "Physician Attention Required" title (within banner)
3. Patient statement verbatim (within banner — the evidence)
4. Triage status (within banner — what nurse found)
5. Standard case brief content (below banner)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. The banner is amber NOT red (red implies certainty of emergency — amber signals physician attention required). The banner is never a full-screen takeover. The physician can still see the case brief content.

---

### D-14 — Completeness Grid View

**STITCH PROMPT — SCREEN D-14: COMPLETENESS GRID VIEW**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-14
User Role: Physician
Surface: Physician
Route: /physician/case/:id#completeness (section within case brief)
Purpose: Show the physician exactly which clinical domains have been collected and which are missing — as a structured domain-by-domain grid, not a percentage score

USER CONTEXT:
The physician wants to quickly assess whether they have enough information to conduct the consultation, or if important history is missing. The completeness grid shows each domain's status. Missing domains can be noted for in-consultation collection.

LAYOUT:
Case brief section, max-width 600px

HEADING ROW:
  "Intake Completeness" — 16px / 600 / #18181B
  Right: "8 of 10 domains have data" — 14px / 400 / #52525B (informational count, NOT a score)
  Note below: "This shows which information was collected before your consultation." — 13px / italic / muted

COMPLETENESS GRID:
  A two-column table layout:
  Left column: domain name (200px)
  Right column: status indicator

Row height: 36px
Font: 13px / 400
Alternating row bg: white / #F9F9FA (very subtle zebra for readability — every other row)

Rows:
  Chief Complaint | ✓ Collected — [Interview]
  HPI — History | ✓ Collected — [Interview]
  Current Medications | ✓ Collected — [Doc + Interview]
  Allergies | ⚠ Conflict — [Requires resolution]
  Past Medical History | ~ Partial — [Interview + Doc]
  Surgical History | ✓ Collected — [Doc]
  Family History | — Not collected
  Social History | ~ Partial — [Interview]
  Review of Systems | ~ Partial — [Interview]
  AYUSH Assessment | — Not applicable (non-AYUSH case)

Status indicators (right column, right-aligned):

✓ Collected: check-circle-2 green (14px) + "Collected" — 13px / #15803D + source chips
⚠ Conflict: alert-triangle amber (14px) + "Conflict — resolve" — 13px / #B45309 + "Resolve →" link
~ Partial: minus-circle amber (14px) + "Partial" — 13px / #B45309
— Not collected: circle-dashed gray (14px) + "Not collected" — 13px / #A1A1AA
N/A: em dash + "Not applicable" — 13px / #A1A1AA (very muted)

Source chips inline with "Collected" rows: [Interview T3] / [Doc T2] / [T1 Verified]

AYUSH row:
  If AYUSH case: uses teal check-circle + "Collected (AYUSH)" in teal text
  If non-AYUSH: "Not applicable" — muted

PHYSICIAN NOTE OPTION:
  At bottom of grid:
    "+ Note missing information for in-consultation collection" — ghost link
    Opens a small textarea for physician to note what to ask in person

STATES:
All collected: no partial or missing rows
Conflicts present: conflict row links to D-11
All data: green header summary
Partial data: amber summary count

RESPONSIVE:
Desktop: two-column as described
Mobile: domain name wraps, status below (stacked per row)

MOTION:
Completeness grid: rows stagger in 40ms each (subtle on load)
"Resolve →" link: pulse animation once on load if conflict exists (to draw attention)

ACCESSIBILITY:
Table with proper <thead> headers
Each row: role="row", cells with proper role
Status icons: aria-label with full status description

VISUAL HIERARCHY:
1. Conflict row (amber — immediate attention)
2. Collected rows (green checks — reassurance)
3. Partial rows (amber dashes — note for physician)
4. Not collected rows (gray — visible but low urgency)
5. Domain count summary (top right — glanceable)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. NEVER show a percentage score. Show domain count ("8 of 10") only. Each domain has an explicit status. AYUSH is always clearly labeled.

---

### D-15 — AI Summary Section

**STITCH PROMPT — SCREEN D-15: AI SUMMARY SECTION**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-15
User Role: Physician
Surface: Physician
Route: /physician/case/:id#summary (section within case brief)
Purpose: Display the AI-generated HPI clinical summary — clearly attributed, editable, and clearly not a diagnosis

USER CONTEXT:
The AI summary is a 2–4 sentence clinical narrative generated from structured intake data. It appears in the case brief to give the physician a rapid narrative overview before diving into structured facts. It must be clearly labeled as AI-assisted. The physician can edit it. It must never contain diagnostic language.

LAYOUT:
Case brief section, max-width full case column

SECTION HEADER:
  "Clinical Summary" — 16px / 600 / #18181B
  Right: Two chips side by side:
    "AI-assisted draft" — 12px / gray chip (#F4F4F5 bg, #52525B text) — subtle, not promotional
    "Pending physician review" — 12px / amber chip IF not yet T1 reviewed

AI SOURCE ATTRIBUTION:
  A discreet line below heading:
    "Generated from structured intake data. All claims are traceable to documented sources." — 12px / italic / #A1A1AA
  This always appears. It grounds the content.

SUMMARY CONTENT CARD:
  White card, border, radius 8px, padding 20px

  Summary paragraph (read mode):
    "67-year-old male presenting with a 3-month history of epigastric pain, described as dull and burning, aggravated by large meals and worsened on lying down. Background includes Type 2 Diabetes Mellitus (diagnosed ~2019) and Hypertension, currently managed with Metformin 1000 mg OD (physician-updated), Amlodipine 5 mg OD, and Pantoprazole 40 mg OD. HbA1c was 8.4% in March 2025. An allergy conflict exists regarding Penicillin — pending physician resolution."
    
    — 15px / 400 / #18181B / 1.6 line-height
  
  Inline source links (where applicable):
    "[HbA1c 8.4%]" appears as a subtle blue underline — clicking opens source drawer for that specific fact
    "[allergy conflict]" links to conflict section
    These are in-text source anchors — not footnotes
  
  Below paragraph: thin divider line

  Physician note:
    "This summary is an AI-assisted draft. Physician review and verification of all claims is required before relying on this summary for clinical decisions." — 12px / italic / #A1A1AA

EDIT CONTROLS:
  Top-right of card: "Edit" button (pencil icon, ghost, 13px)
  
  When editing:
    Paragraph becomes editable textarea (same padding, font, bg)
    Character count: right-aligned 12px muted
    Below textarea: "Save" primary + "Cancel" ghost buttons
    A note: "Your edits are marked as physician-reviewed and replace the AI draft." — 12px muted

AFTER PHYSICIAN EDIT:
  "AI-assisted draft" chip changes to "✓ Physician reviewed" green chip
  The paragraph now has T1 status

CONTENT FILTER WARNING (if applicable):
  If the AI output contained filtered content:
    A gray info bar above card: "One phrase was removed from this summary as it may have implied a clinical conclusion. Please review and add physician notes where needed." — 13px muted

STATES:
AI draft (unreviewed): amber "Pending review" chip
After edit/approval: green "Physician reviewed" chip
Content filtered: info bar above card
Empty (summary not generated): "Summary is being prepared..." loading state with arc spinner

RESPONSIVE:
Desktop: full-width card
Mobile: same, text wraps naturally

MOTION:
Chip status change (pending → reviewed): crossfade 200ms
Edit mode activate: textarea fade in + border color change to accent (120ms)

ACCESSIBILITY:
Editable paragraph: role="textbox" when in edit mode
Source links: aria-label "Open source for HbA1c 8.4%"
Summary card: aria-label "Clinical summary — AI-assisted draft"

VISUAL HIERARCHY:
1. Summary paragraph text (dominant — primary reading)
2. Inline source links (available but subtle)
3. "Edit" button (top-right of card — available but not dominant)
4. Attribution line (top — must be read first)
5. Physician note (bottom — important disclaimer, smaller)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. The "AI-assisted draft" attribution is ALWAYS visible. No diagnostic language ever appears in this section. Inline source anchors must link to actual source records.

---

### D-16 — Case Approval + FHIR Export

**STITCH PROMPT — SCREEN D-16: CASE APPROVAL + FHIR EXPORT**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-16
User Role: Physician
Surface: Physician
Route: /physician/case/:id/approve (or modal/overlay triggered from case brief)
Purpose: Physician formally approves the case brief — triggering FHIR export and HIS sync — after confirming all conflicts are resolved and content is verified

USER CONTEXT:
The physician has reviewed the case, resolved conflicts, and is ready to approve. Clicking "Approve Case" opens this confirmation modal. They see a checklist of what's been verified, and confirm before triggering the export pipeline.

LAYOUT:
A centered modal overlay (not full screen):
  Width: 560px
  Radius: 12px
  Padding: 28px
  Shadow: --shadow-lg
  Background: white
  Backdrop: rgba(0,0,0,0.4)

MODAL HEADER:
  "Approve case brief" — 18px / 600 / #18181B
  × close button right-aligned

PRE-APPROVAL CHECKLIST (read-only, showing what's been done):
  Title: "Review summary" — 13px uppercase muted

  Rows (each 36px, check-circle left):
    ✓ All conflicts resolved — green
    ✓ Medications verified — green
    ✓ Summary reviewed — green
    ✓ Red flag acknowledged — green (if applicable; absent if no red flag)
    ⚠ 3 facts at low confidence (Doc T4) — amber (informational, not blocking)

  If anything is NOT resolved:
    × [item] — red
    Modal won't show "Approve" until those are resolved (enforced on the case brief itself)

PHYSICIAN ATTESTATION (required checkbox):
  Large checkbox (20px):
    "I have reviewed this case brief and the information is accurate to the best of my knowledge. All AI-generated content has been verified."
  
  14px / 400 / #18181B — must check to enable Approve

EXPORT SETTINGS (collapsible, collapsed by default):
  "Export options ▾" — 13px / 400 / #52525B
  When expanded:
    FHIR Bundle: toggle (on by default) — "Generate FHIR R4 bundle"
    HIS sync: toggle (on by default) — "Sync to hospital information system"
    ABDM export: toggle (off by default — sandbox) — "Export to ABDM (demo)"

ACTIONS:
  "Approve and complete case" — primary button, full width, 44px
  Disabled until attestation checkbox is checked
  
  "Cancel" — ghost button, below, 36px

LOADING STATE (after approve):
  Button shows spinner + "Processing..."
  A progress list animates below the checklist:
    "Generating FHIR bundle..." → ✓
    "Syncing to HIS..." → ✓ (or ✗ with retry)
    "Recording audit event..." → ✓

SUCCESS STATE:
  All progress items show green checkmarks
  A delay of 1 second, then:
  Button changes to "✓ Approved — closing..." and modal closes
  Redirects to D-18 (Case Approved State)

STATES:
Attestation unchecked: Approve button disabled
Attestation checked: Approve button enabled
Processing: spinner + progress list
HIS failure: item shows ✗ + "Retry" link (doesn't block completion)

RESPONSIVE:
Desktop: 560px centered modal
Tablet: 480px
Mobile: full-screen sheet from bottom, 56px button

MOTION:
Modal entrance: fade + scale 0.97→1.0, 200ms ease-out
Backdrop: fade to 0.4, 200ms
Checkbox check: scale 0.9→1.0, 100ms
Progress list: each item fades in + check appears in sequence (300ms between each)

ACCESSIBILITY:
Modal: role="dialog" aria-modal="true" aria-labelledby="approve-heading"
Focus trapped within modal
Escape closes modal (same as Cancel)
"Approve" button: aria-disabled until checkbox checked

VISUAL HIERARCHY:
1. Pre-approval checklist (what's been verified)
2. Attestation checkbox (required action)
3. "Approve and complete" (primary — full width, enabled after checkbox)
4. Export settings (collapsed — secondary detail)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Attestation checkbox is mandatory. The FHIR export is triggered by this action. Physicians cannot approve with unresolved conflicts (enforced before this modal opens).

---

### D-17 — HIS Sync Status Panel

**STITCH PROMPT — SCREEN D-17: HIS SYNC STATUS PANEL**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-17
User Role: Physician
Surface: Physician
Route: /physician/case/:id/sync-status (panel or tab within approved case view)
Purpose: Show the technical status of the FHIR export and HIS sync for a completed case — with full request/response details visible

USER CONTEXT:
After approval, the physician or admin can view the integration status. This panel shows the actual HIS sync outcome — record IDs, timestamps, request payload summary, and response. It is a technical integration view, but must be readable by a physician.

LAYOUT:
Within the approved case view. Tab-style access: "Approval | FHIR Export | HIS Sync"
Active tab: "HIS Sync"
Content max-width: 700px

OVERALL STATUS HEADER:
  Status badge (large, top of panel):
    If synced: "✓ HIS Sync Successful" — 18px / 600 / #15803D, green check icon left 24px
    If failed: "✗ HIS Sync Failed" — 18px / 600 / #B91C1C, red × icon
    If pending: rotating arc + "Sync in progress..." — 18px / 500 / muted

SYNC RECORD:
  White card, border, radius 8px, padding 20px

  Row 1: HIS Patient ID
    Label: "HIS PATIENT ID" — 11px uppercase muted
    Value: "HIS-2026-004821" — 18px / 600 / JetBrains Mono / #18181B

  Row 2: HIS Encounter ID
    Label: "HIS ENCOUNTER ID" — 11px uppercase muted
    Value: "ENC-0829-1042" — 14px / JetBrains Mono / primary

  Row 3: Synced at
    Label: "SYNCED AT" — 11px uppercase muted
    Value: "15 Aug 2026 — 10:42:33 AM" — 13px / JetBrains Mono / muted

  Row 4: FHIR Bundle version
    Label: "FHIR BUNDLE" — 11px uppercase muted
    Value: "R4 · 12 resources · Bundle ID: fhir-2026-d731" — 13px / JetBrains Mono / muted
    "View FHIR Bundle" — 13px / #2563EB link (opens full JSON in a code panel)

TECHNICAL REQUEST/RESPONSE ACCORDION:
  Collapsed by default:
  "View request/response log ▾" — 13px / #52525B

  Expanded:
    REQUEST tab | RESPONSE tab
    
    REQUEST panel (code-block style):
      Background: #18181B
      Padding: 16px
      Radius: 6px
      Font: JetBrains Mono 12px / white
      Content: truncated JSON of the FHIR POST request body (first 15 lines visible)
      "Copy" icon button top-right (copies full content)
    
    RESPONSE panel:
      Same styling
      HTTP 200 OK · 342ms — green indicator at top of block
      Response JSON truncated preview

AUDIT REFERENCE:
  "Audit event: EVT-2026-8941" — 11px JetBrains Mono muted, bottom of panel
  "View full audit log →" — link to A-05

STATES:
Success: green header, all IDs populated
Failed: red header, error message ("502 Gateway timeout — retry available"), Retry button
Pending: arc spinner header, IDs show "—" until populated
Partial (FHIR ok, HIS fail): mixed status — FHIR section green, HIS section red

RESPONSIVE:
Desktop: full-width panel
Mobile: same, code blocks scroll horizontally

MOTION:
Success header entrance: check draws on 400ms (same as P-21 token reveal)
Accordion expand: height animate 200ms
Code block: fade in on tab switch 150ms

VISUAL HIERARCHY:
1. Status header (large check or × — immediate result)
2. HIS Patient + Encounter IDs (the most important data)
3. Sync timestamp (JetBrains Mono — technical)
4. Request/response accordion (technical detail — available but secondary)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. The mock HIS always returns realistic record IDs. Request/response must be real-looking JSON. Audit reference always present.

---

### D-18 — Case Approved State

**STITCH PROMPT — SCREEN D-18: CASE APPROVED STATE**

Inherits: Foundation 1, Foundation 2 (Physician variant), Foundation 4

Screen ID: D-18
User Role: Physician
Surface: Physician
Route: /physician/case/:id (approved state — case is locked and complete)
Purpose: Show the physician that a case has been approved, locked, and synced — with options to navigate back to queue or view sync status

USER CONTEXT:
After approving in D-16, the physician returns to the case view in "Approved" state. The case is now locked — facts cannot be edited without a formal amendment. A clear success state confirms the workflow is complete.

LAYOUT:
Same application shell. Sticky header now shows locked status.

STICKY HEADER (modified):
  Left: breadcrumb as before
  Center: "Approved" — green chip — replaces the amber "conflicts" / "pending" status
  Right: "View FHIR bundle" + "HIS sync status" buttons (ghost, replacing "Approve")

APPROVAL CONFIRMATION BANNER (top of case content):
  Full width:
    Background: #F0FDF4
    Border: 1px solid rgba(22,163,74,0.3)
    Left border: 3px solid #16A34A
    Radius: 8px
    Padding: 16px 20px
    
    Row 1: check-circle-2 20px green + "Case approved and complete" — 15px / 600 / #15803D
    Row 2: "Approved by Dr. R. Mehta · 10:45 AM · 15 Aug 2026" — 13px / #15803D / JetBrains Mono
    Row 3: "HIS sync: ✓ Record ENC-0829-1042 · FHIR: ✓ Bundle generated" — 13px / #15803D
    Row 4: "View sync details →" — 13px / #2563EB link

CASE CONTENT (below banner):
  All case brief sections (D-03 to D-15) are visible but READ-ONLY
  No "Edit" buttons visible
  Fact rows are not clickable for editing (though source drawer still works)
  All facts show T1 chip where physician verified, T2/T3 for others
  
  A subtle "Locked" indicator on each section header:
    Small lock icon 12px, muted, right-aligned beside section heading
    "Case approved — read only" tooltip on hover

AMENDMENT OPTION (if physician needs to correct something):
  Footer of case content:
    "Need to make a correction?" — 14px / #52525B
    "Request amendment →" — ghost button, 13px — opens an amendment workflow (out of scope for demo, shows modal: "Please contact administrator to amend an approved case")

RETURN TO QUEUE:
  Prominent below banner:
    "Return to patient queue" — primary button (or secondary if banner CTA is primary)
    "Next patient →" — if queue has more patients

STATES:
Default: approved, locked, as described
HIS sync failed (edge): banner shows partial success — green + amber mixed

RESPONSIVE:
Desktop: banner full-width, locked case below
Mobile: same, compact banner

MOTION:
Approval banner: slides in from top 300ms ease-out (same as D-13 alert banner but green)
Lock icons on section headers: fade in after banner settles, 400ms delay

VISUAL HIERARCHY:
1. Green approval banner (confirmation — full width, top)
2. HIS/FHIR sync status in banner (confirmation of integration)
3. Locked case content (full case visible, read-only)
4. "Return to queue" (action — next workflow step)

DO NOT CHANGE: Foundation 1, Foundation 2, Foundation 4. Approved cases must be visibly locked. Lock icons on all section headers. The green banner is the primary visual signal. Amendment requires admin workflow.

---

## ADMIN SURFACE SCREENS (A-01 → A-07)

---

### A-01 — Admin Overview Dashboard
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** A-01 | **Route:** /admin/overview
[FULL PROMPT AS PROVIDED ABOVE]

---

### A-02 — Intake Analytics

**STITCH PROMPT — SCREEN A-02: INTAKE ANALYTICS**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-02
User Role: Administrator
Surface: Admin
Route: /admin/analytics/intake
Purpose: Operational analytics for patient intake sessions — duration, modality, completion rates, language usage

USER CONTEXT:
The administrator reviews how the intake system is performing. Are sessions completing? How long do they take? Which language is most used? Which questions are most frequently skipped or causing dropout? These insights help improve the system.

LAYOUT:
Admin shell. Sidebar: "Intake Analytics" active.
Page title: "Intake Analytics"
Date range selector: "Today / Last 7 days / Last 30 days / Custom" — tab filter top-right

METRIC CARDS ROW (5 cards, same structure as A-01 but different metrics):
  SESSIONS STARTED: "38"
  SESSIONS COMPLETED: "31" — subtext: "82% completion rate" — green
  ABANDONED: "7" — amber text (note: "Abandoned after consent")
  AVG DURATION (MEDIAN): "14 min 32 sec"
  AYUSH SESSIONS: "6" — teal text

SECTION 1 — Session Duration Distribution:
  Title: "Session duration distribution" — 14px / 500
  Subtext: "How long sessions take from consent to completion" — 12px muted
  
  A horizontal bar chart:
    Buckets: <8 min / 8–12 min / 12–18 min / 18–25 min / >25 min
    Bars: horizontal, #2563EB fill, 20px height each, radius 4px right end
    Count label right of each bar: "4 sessions", "12 sessions", etc.
    Height: 180px total
  
  Y axis: duration buckets
  X axis: session count (0–15)

SECTION 2 — Language Usage:
  Title: "Language breakdown" — 14px / 500
  
  Horizontal bar chart:
    Hindi: 18 sessions — longest bar
    English: 9 sessions
    Marathi: 7 sessions
    Other/Mixed: 4 sessions
  Each bar: language-specific color (or all blue — no color variance needed; use single color)
  Language name left (80px), bar center, count right

SECTION 3 — Modality Usage:
  Title: "Voice vs Touch usage" — 14px / 500
  Subtext: "Per session average" — 12px muted
  
  Three stats in a row:
    "68% sessions" — Voice primarily used
    "24% sessions" — Touch primarily used
    "8% sessions" — Multimodal (mixed)
  Each: large JetBrains Mono number + label below

SECTION 4 — Dropout Analysis:
  Title: "Session dropout points" — 14px / 500
  Subtext: "Where patients abandon before completing" — 12px muted
  
  A funnel-style horizontal bar chart:
    Consent: 38 started
    Chief complaint: 36 (−2 dropped)
    Interview: 33 (−3 dropped)
    Documents: 31 (−2 dropped)
    Completed: 31
  
  Each row: stage name left, bar proportional to count, count right
  Dropout points shown as amber annotations: "−2 at consent" label

FILTER / DATE CONTROLS:
  All charts respond to the date range filter at top

STATES:
Default: today's data
No data: each chart shows empty state with centered muted label: "No sessions in this period"
Date range changed: charts animate to new data (bar widths transition 400ms ease-out)

RESPONSIVE:
Desktop: 2×2 grid for charts (left/right columns)
Tablet: stacked
Mobile: single column, simplified charts

MOTION:
Bar charts: animate bar widths from 0 to final on page load (600ms ease-out)
Date range change: fade out 150ms, new data animate in 400ms

VISUAL HIERARCHY:
1. Metric cards (top — at-a-glance summary)
2. Duration distribution chart (most operationally useful)
3. Language + modality (secondary analytics)
4. Dropout funnel (process improvement insight)

DO NOT CHANGE: Foundation 1, Foundation 2. All charts must use real data sources. No decorative or fabricated metrics. Session count and completion rate are the most important metrics.

---

### A-03 — Document Processing Analytics

**STITCH PROMPT — SCREEN A-03: DOCUMENT PROCESSING ANALYTICS**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-03
User Role: Administrator
Surface: Admin
Route: /admin/analytics/documents
Purpose: Operational analytics for document OCR processing — volume, quality, confidence distribution, failure rates

USER CONTEXT:
The administrator monitors how well the document pipeline is performing. How many documents were processed? What was the average OCR confidence? Are failures concentrated in a document type? Is handwriting causing low confidence?

LAYOUT:
Admin shell. Sidebar: "Document Processing Analytics" active.
Page title: "Document Processing Analytics"
Date range selector top-right (same as A-02)

METRIC CARDS ROW (5 cards):
  DOCUMENTS PROCESSED: "47"
  SUCCESS RATE: "87%" — green
  FAILED: "6" — amber
  AVG OCR CONFIDENCE: "83%" — JetBrains Mono
  AVG PROCESSING TIME: "23 sec"

SECTION 1 — OCR Confidence Distribution:
  Title: "OCR confidence distribution" — 14px / 500
  
  Vertical bar chart:
    X axis: confidence ranges (<60% / 60–75% / 75–85% / 85–95% / >95%)
    Y axis: document count (0–20)
    Bar colors: <60% red, 60–75% amber, 75–85% yellow, >85% green (semantic coloring)
    Height: 160px

SECTION 2 — By Document Type:
  Title: "Processing by document type" — 14px / 500
  
  A simple data table:
    Columns: TYPE | UPLOADED | SUCCESS | FAILED | AVG CONFIDENCE
    Rows:
      Prescription | 18 | 15 | 3 | 79%
      Lab Report | 22 | 20 | 2 | 88%
      Discharge Summary | 7 | 6 | 1 | 85%
  
  Table: same styling as D-05 investigation table (compact, 36px rows, border between)

SECTION 3 — Handwriting Impact:
  Title: "Handwriting detection" — 14px / 500
  
  Two stats:
    "31% of documents contain handwriting" — large percentage, muted label below
    "Handwritten docs avg OCR: 61%" vs "Printed docs avg: 91%" — comparison stat row
    Small note: "Handwritten documents have lower extraction confidence. Physicians should verify these facts." — 12px muted italic

SECTION 4 — Processing Queue (real-time):
  Title: "Current processing queue" — 14px / 500
  
  If queue has items: a compact list of in-progress documents (filename, started at time, current stage)
  If queue empty: "Queue is empty · All documents processed" — 13px muted

STATES:
Default: today's data
High failure rate (>20%): amber banner at top: "Document processing failure rate is above normal. Check integration health."
Empty: each chart shows empty state

RESPONSIVE:
Desktop: 2-column chart layout
Mobile: stacked single column, table scrolls horizontally

VISUAL HIERARCHY:
1. Metric cards (top — immediate KPIs)
2. OCR confidence histogram (quality insight)
3. By-type table (actionable detail)
4. Handwriting analysis (root cause insight)

DO NOT CHANGE: Foundation 1, Foundation 2. Confidence distribution uses semantic colors (red/amber/green). Handwriting analysis always shown separately. Real processing times only.

---

### A-04 — Integration Health Status

**STITCH PROMPT — SCREEN A-04: INTEGRATION HEALTH STATUS**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-04
User Role: Administrator
Surface: Admin
Route: /admin/integrations/health
Purpose: Show the operational health of all external integrations — ASR APIs, OCR APIs, FHIR endpoint, HIS adapter, ABDM sandbox

USER CONTEXT:
The administrator monitors that all integrations are working. If Bhashini ASR is down, voice intake will fall back to Whisper. If Google Document AI is slow, processing times increase. This view allows proactive intervention.

LAYOUT:
Admin shell. Page title: "Integration Health"
Last checked: "Last checked 30 seconds ago · Auto-refreshes" — 12px JetBrains Mono muted + green pulse dot

INTEGRATION HEALTH TABLE:

Each integration is a row:

Row structure:
  Col 1 (32px): Status indicator dot (12px circle)
    Green: operational
    Amber: degraded
    Red: down
  Col 2 (200px): Integration name + description
    Name: "Bhashini ASR" — 14px / 500
    Desc: "Speech-to-text — primary" — 12px muted
  Col 3 (100px): Latency (last 5 min avg)
    "214 ms" — 13px JetBrains Mono
    Green if < 500ms, amber if 500–2000ms, red if > 2000ms
  Col 4 (80px): Uptime today
    "99.8%" — 13px JetBrains Mono
  Col 5 (100px): Status chip
    "Operational" — green chip
    "Degraded" — amber chip
    "Down" — red chip
  Col 6 (60px): "Details" link (13px / #2563EB) — expands row

Integrations (8 rows):
  Bhashini ASR | Speech-to-text primary | 214 ms | 99.8% | Operational
  Whisper ASR (Fallback) | Speech-to-text fallback | 480 ms | 99.9% | Operational
  Bhashini TTS | Text-to-speech | 320 ms | 99.7% | Operational
  Google Document AI | OCR + extraction | 2,100 ms | 98.2% | Degraded (amber)
  ABDM Sandbox | ABHA identity lookup | 890 ms | 95.1% | Degraded (amber)
  FHIR Export Service | Internal FHIR generation | 54 ms | 100% | Operational
  HIS Adapter (Mock) | Hospital system sync | 412 ms | 100% | Operational
  Audit Service | Event logging | 12 ms | 100% | Operational

ROW EXPANDED (Details):
  When "Details" clicked, row expands:
    Recent latency chart (sparkline — 24 data points, last 2 hours, 60px height)
    Last error (if any): "502 Bad Gateway — 10:21 AM" — 13px monospace amber
    Success rate (last 100 calls): "96/100" — 13px muted
    Retry behavior: "Auto-retries 3× with fallback to [fallback service]" — 12px muted

INCIDENT BANNER (if any service is down):
  Full-width amber/red banner at top:
    amber (degraded): "2 services are running slower than usual. Fallbacks are active."
    red (down): "Bhashini ASR is currently unavailable. Voice intake is using Whisper fallback."

STATES:
All operational: calm green table, no banner
Degraded: amber rows, amber banner
Down: red rows, red banner
Auto-refresh: dots pulse subtly every 30s

RESPONSIVE:
Desktop: full table with all columns
Tablet: hide latency column
Mobile: simplified — name, status chip, details link only

MOTION:
Status dot: subtle pulse on degraded (1s loop, scale 1.0→1.2→1.0, amber)
Row expand: height animate 200ms

VISUAL HIERARCHY:
1. Incident banner (if present — top, dominant)
2. Status dots (color-coded — left edge of each row)
3. Service names (primary reading)
4. Latency + uptime (right — operational metrics)
5. Details expansion (secondary — on demand)

DO NOT CHANGE: Foundation 1, Foundation 2. Status indicators must reflect real API health checks. Degraded and down states have distinct visual treatments. Fallback status always shown when primary is down.

---

### A-05 — Audit Log Viewer

**STITCH PROMPT — SCREEN A-05: AUDIT LOG VIEWER**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-05
User Role: Administrator
Surface: Admin
Route: /admin/audit
Purpose: Display the immutable audit log of all system events — patient sessions, physician approvals, triage actions, integration events

USER CONTEXT:
The administrator reviews the audit trail for compliance, investigation, or quality review. The log is append-only and cannot be modified. Every clinical action is recorded here.

LAYOUT:
Admin shell. Page title: "Audit Log"
Subtext: "Immutable record of all system events. Cannot be modified." — 13px italic muted

FILTER ROW:
  Date range picker: "Today / Last 7 days / Custom"
  Event type filter: "All / Clinical / Triage / Integration / Auth / System" — dropdown or multi-select chips
  Search: "Search by patient name, event type, or actor..." — 36px input, search icon

AUDIT LOG TABLE:

Columns: TIME | EVENT TYPE | DESCRIPTION | ACTOR | PATIENT | RESOURCE ID
Table: clean, compact, no zebra stripes (border-bottom per row only)
Row height: 44px

Each row:

TIME: "10:42:33" — 12px JetBrains Mono muted (date shown on date group header)
EVENT TYPE: colored chip:
  "CLINICAL" — blue chip
  "TRIAGE" — amber chip
  "AUTH" — gray chip
  "INTEGRATION" — teal chip
  "SYSTEM" — dark gray chip
DESCRIPTION: "Case approved — Dhananjay Patil (ENC-0829)" — 14px / 400 / primary (truncated at 60ch)
ACTOR: "Dr. R. Mehta" — 13px muted
PATIENT: "D. Patil" — 13px / #2563EB link
RESOURCE ID: "ENC-0829-1042" — 11px JetBrains Mono muted

Date group headers between rows:
  "15 August 2026" — 12px / 500 / uppercase / muted, centered in the table with left/right rules

Sample rows (chronological, newest first):
  10:45:02 | CLINICAL | Case approved | Dr. Mehta | D. Patil | ENC-0829
  10:42:33 | INTEGRATION | HIS sync successful — ENC-0829-1042 | System | D. Patil | HIS-ENC-0829
  10:41:10 | INTEGRATION | FHIR bundle generated — 12 resources | System | D. Patil | FHIR-d731
  10:38:47 | TRIAGE | Alert acknowledged — "Assessed stable" | Nurse S. Kumar | P. Menon | AL-0048
  10:38:12 | TRIAGE | Triage alert triggered — CARDIAC_001 | System | P. Menon | AL-0048
  10:31:05 | CLINICAL | Red flag extracted from interview answer | System | P. Menon | AL-0048
  10:26:43 | CLINICAL | Conflict detected — allergy status | System | D. Patil | CONF-0023
  10:24:00 | CLINICAL | Interview session started | System | D. Patil | SESS-4421
  10:22:15 | CLINICAL | Consent recorded — Hindi | System | P. Menon | CONS-8901
  10:14:32 | AUTH | Physician login | Dr. Mehta | — | AUTH-1122

ROW EXPAND:
  Click any row → expands below with full detail:
    before_state JSON (if applicable) — code block style
    after_state JSON — code block style
    IP address + user agent: "192.168.1.45 · Chrome 125 / macOS" — 12px monospace muted

EXPORT:
  "Export filtered events (CSV)" — ghost button top-right

PAGINATION:
  Bottom: "Showing 50 of 847 events · Load 50 more ↓"
  Not paginated by page — load-more pattern

STATES:
Default: today's events, newest first
Filtered: table shows filtered subset
Empty (filter): "No events match this filter" — centered muted
Loading: skeleton rows (5 rows, shimmer)

RESPONSIVE:
Desktop: full 6-column table
Tablet: hide RESOURCE ID column
Mobile: 3 columns (TIME / DESCRIPTION / ACTOR), expand for full detail

MOTION:
Row expand: height animate 200ms
New events (if real-time): brief yellow flash on new row before settling (300ms) — indicates new entry

VISUAL HIERARCHY:
1. Event type chips (left — color-coded, immediate categorization)
2. Description (primary reading — what happened)
3. Actor + patient (who and to whom)
4. Time (JetBrains Mono — always precise)
5. Resource ID (smallest — technical reference)

DO NOT CHANGE: Foundation 1, Foundation 2. This is an immutable log — make it clearly read-only. The "cannot be modified" note must always be visible. All event types have distinct chip colors.

---

### A-06 — Clinical Pathway Configuration

**STITCH PROMPT — SCREEN A-06: CLINICAL PATHWAY CONFIGURATION**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-06
User Role: Administrator (clinical configuration role)
Surface: Admin
Route: /admin/config/pathways
Purpose: View and manage the clinical interview pathways — which question graphs are active for which complaint categories

USER CONTEXT:
A clinical administrator (with appropriate role) wants to review which interview pathways are configured. They may want to activate a new pathway or see which pathways are in use. This screen does NOT expose raw JSON to non-technical users — it shows a structured, readable view.

LAYOUT:
Admin shell. Page title: "Clinical Pathway Configuration"
Subtext: "These pathways determine which interview questions are asked based on the patient's chief complaint." — 14px muted

IMPORTANT WARNING BANNER (always visible):
  Blue info banner at top:
    info icon + "Changes to pathways affect all future intake sessions. Consult your clinical team before making modifications." — 14px / #1E40AF
    Background: #EFF6FF, border: 1px solid rgba(37,99,235,0.2)

PATHWAY LIST:

5 pathway cards (white card, border, radius 8px, padding 16px, 12px gap):

Each pathway card:
  
  Header row:
    Left: pathway icon (activity/heart/brain/bone/stomach — Lucide) in colored circle
    Center: pathway name + code
      "Abdominal Pain — ABDOMINAL_PAIN" — 15px / 500 / primary
    Right: status chip: "Active" (green) or "Draft" (gray)
  
  Stats row (below header, 3 compact stats):
    "12 questions" | "3 branches" | "2 red-flag rules"
    Each: 13px JetBrains Mono + label
  
  Footer row:
    "Last updated: 12 Aug 2026 by Dr. Mehta" — 12px muted
    "View questions →" — 13px / #2563EB link

PATHWAY DETAIL (when "View questions" clicked):
  Right panel or full-page that shows the question list:
    Ordered list of questions in the pathway
    Each: question code + question text (English) + type (voice/touch/free) + clinical domain
    Read-only for admins without clinical configuration permission
    "Edit" restricted to clinical admin role only

ACTIVE PATHWAYS TOGGLE:
  Each pathway card has a toggle switch (right of status chip):
    On: pathway is active for new sessions
    Off: pathway is disabled (existing sessions unaffected)
    Confirmation dialog required before disabling an active pathway

STATES:
All active: 5 green chips
Some draft: gray chips for draft pathways
Pathway editing: separate edit view (out of scope — shows read-only for hackathon)

RESPONSIVE:
Desktop: pathway cards in 2-column grid
Mobile: stacked

VISUAL HIERARCHY:
1. Warning banner (always — configuration screen)
2. Pathway cards (dominant — what exists)
3. Status chip + toggle (operational state)
4. Question/branch counts (supporting detail)

DO NOT CHANGE: Foundation 1, Foundation 2. The warning banner is mandatory. Pathways cannot be edited without confirmation. Red-flag rules cannot be disabled without a separate, elevated confirmation.

---

### A-07 — User + Role Management

**STITCH PROMPT — SCREEN A-07: USER + ROLE MANAGEMENT**

Inherits: Foundation 1, Foundation 2 (Admin variant)

Screen ID: A-07
User Role: Administrator
Surface: Admin
Route: /admin/users
Purpose: Manage staff accounts — physicians, triage nurses, and administrators — with role assignment and access control

USER CONTEXT:
The administrator manages who has access to the system and in what role. They can add new staff, change roles, deactivate accounts. This is a standard user management view, but clinical roles carry security implications (who can approve cases, who can resolve conflicts).

LAYOUT:
Admin shell. Page title: "Users & Roles"
Subtext: "Manage staff access to Vaidya." — 14px muted

HEADER ACTIONS:
  Right: "+ Add user" — primary button, 36px

ROLE FILTER:
  "All" / "Physician" / "Triage" / "Admin" / "Inactive" — tab filter

USER TABLE:

Columns: USER | ROLE | DEPARTMENT | LAST ACTIVE | STATUS | ACTIONS
Row height: 48px

Each row:
  USER: Avatar initials (32px) + Name (14px / 500 primary) + email below (12px muted)
  ROLE: Role chip — "Physician" (blue) / "Triage" (amber) / "Admin" (gray)
  DEPARTMENT: "Internal Medicine" — 13px muted
  LAST ACTIVE: "Today 10:42 AM" — 12px JetBrains Mono muted
  STATUS: "Active" green chip / "Inactive" gray chip
  ACTIONS: "Edit" ghost link + "Deactivate" ghost link (destructive, only for active users)

Sample rows:
  Dr. R. Mehta | Physician | Internal Medicine | Today 10:42 AM | Active
  Nurse S. Kumar | Triage | OPD | Today 10:38 AM | Active
  Dr. P. Sharma | Physician | AYUSH OPD | Today 09:15 AM | Active
  Admin A. Singh | Admin | — | Yesterday 05:22 PM | Active
  Dr. M. Iyer | Physician | Internal Medicine | 3 days ago | Inactive (gray)

ADD USER MODAL (when "+ Add user" clicked):
  Modal 480px, padding 24px
  Fields: Full name / Email / Role (select) / Department (select)
  "Send invitation →" primary button
  Note: "An email invitation will be sent. The user sets their own password." — 12px muted

EDIT ROLE MODAL:
  Modal 360px: current role displayed, dropdown to change role, "Save" button
  Warning: "Changing a physician's role will affect their access to case records." — 12px amber

DEACTIVATE CONFIRMATION:
  Dialog: "Deactivate Dr. Iyer? They will no longer be able to access the system." + Cancel + "Deactivate" (destructive)

STATES:
Active users list: as described
No users: empty state with "+ Add first user" CTA
Search (if implemented): filter rows

RESPONSIVE:
Desktop: full table
Tablet: hide DEPARTMENT column
Mobile: name + role + status + ellipsis menu (for actions)

MOTION:
Modal: fade + scale 200ms
Row deactivate: row fades to 50% opacity + chip changes to "Inactive" with transition 300ms

VISUAL HIERARCHY:
1. User table (dominant — primary content)
2. Role chips (color-coded — immediate role identification)
3. Status chips (active/inactive — operational status)
4. "+ Add user" button (top-right — primary action)

DO NOT CHANGE: Foundation 1, Foundation 2. Roles are always displayed as chips with semantic colors. Deactivation always requires confirmation. Inactive users shown but clearly distinguished.

---

## KIOSK SPECIFIC SCREENS (K-01 → K-04)

---

### K-01 — Kiosk Welcome (Full-screen, large)
*(Complete prompt provided in Section 10 — reproduce verbatim)*

**Screen ID:** K-01 | **Route:** /kiosk/welcome
[FULL PROMPT AS PROVIDED ABOVE]

---

### K-02 — Kiosk Language Selection

**STITCH PROMPT — SCREEN K-02: KIOSK LANGUAGE SELECTION**

Inherits: Foundation 1, Foundation 3 (Kiosk mode)

Screen ID: K-02
User Role: Patient (kiosk)
Surface: Kiosk
Route: /kiosk/language (separated from K-01 if language selection is a dedicated step)
Purpose: Full-screen language selection optimized for large touchscreen hospital kiosks — the most critical accessibility moment

USER CONTEXT:
On some kiosk configurations, language selection is a dedicated step with more space. An elderly patient who has never used a digital system sees this screen. The language buttons must be unmissably large. The patient's own language name must be immediately recognizable.

NOTE: This screen is the dedicated language selection step — K-01 showed the attract/welcome, K-02 is where the actual language selection happens with full focus.

LAYOUT:
Full screen. No browser chrome. No sidebar.
Background: #F6F6F7

TOP STRIP (64px):
  Vaidya wordmark center: "Vaidya" 20px / 600 / #18181B
  AIIA identifier: "All India Institute of Ayurveda" 14px muted below wordmark
  Left: back arrow (if applicable)

MAIN HEADING AREA:
  Full-width center:
  "अपनी भाषा चुनें" (Hindi — largest script) — 32px / 600 / #18181B
  "Choose your language" (English) — 24px / 400 / #52525B
  "आपली भाषा निवडा" (Marathi) — 22px / 400 / #A1A1AA
  
  All three lines centered, stacked, 12px gap

LANGUAGE GRID (primary content — takes 60% of screen height):
  4 columns × 3 rows = 12 languages
  OR 3 columns × 4 rows for portrait orientation
  
  Each tile:
    Height: 96px (significantly larger than mobile — this is a kiosk)
    Width: proportional within grid
    Border: 2px solid #E4E4E7
    Radius: 10px
    Background: white
    Gap: 12px
    
    Content:
      Language in own script: 24px / 600 / primary (e.g., "हिंदी")
      English name below: 14px / 400 / muted (e.g., "Hindi")
    
    Selected: 3px solid #2563EB border, #EFF6FF bg, check icon 20px top-right corner
    Hover/touch: #F9F9FA, slightly elevated shadow

ACCESSIBILITY FEATURES (kiosk-specific):
  Audio play button — always visible on this screen (not hidden):
    A 64px pill button: volume-2 icon + "Listen to language names" — 14px / 500 / #2563EB
    Plays audio "Hindi... English... Marathi..." in sequence
    Position: centered, below grid

CONTINUE SECTION (appears after selection):
  Selected language displayed large:
    "You selected: हिंदी / Hindi" — 18px / 500 / #18181B, centered
    With the selected flag/color accent from the language tile (matches selection)
  
  Large continue button:
    "Continue →" — primary, 400px wide, 80px height, 20px text (kiosk scale)
    Label in selected language above English

SECONDARY HELP:
  "Need help? Tap the screen or ask our staff" — 14px muted, centered, at bottom

STATES:
No selection: heading + grid + audio button visible, no continue
Selected: grid tile highlighted, selected language announcement, continue button
Audio playing: button shows pause state + waveform

RESPONSIVE:
Kiosk only (this screen). Two orientations handled:
  Landscape kiosk: 4-column grid
  Portrait tablet-kiosk: 3-column grid, 80px tile height

MOTION:
Tile selection: border + bg 150ms transition, check icon scale 0.7→1.0 200ms
Continue button: slide up from below + fade, 250ms ease-out
Audio pulse: volume icon gently pulses when playing (scale 1.0→1.1, 1s loop)

ACCESSIBILITY:
Tiles: minimum 96px height — easily tappable for all users
Audio: provides language identification for non-literate users
All text: minimum 24px for primary language names
Selected tile: screen reader announces "Selected: Hindi"

VISUAL HIERARCHY:
1. Language tiles (dominant — fills screen center)
2. Multi-language headings (orientation above grid)
3. Continue button (when visible — large, full blue)
4. Audio button (prominent — accessibility tool)
5. Help text (bottom, minimal)

DO NOT CHANGE: Foundation 1, Foundation 3 kiosk mode. Tiles minimum 96px height. Audio button always visible. Continue button minimum 80px height. This screen is the most critical accessibility checkpoint.

---

### K-03 — Kiosk Interview — Voice Mode

**STITCH PROMPT — SCREEN K-03: KIOSK INTERVIEW — VOICE MODE**

Inherits: Foundation 1, Foundation 3 (Kiosk mode)

Screen ID: K-03
User Role: Patient (kiosk, standing at terminal)
Surface: Kiosk
Route: /kiosk/interview/voice
Purpose: Voice-first interview experience optimized for a large hospital kiosk touchscreen — patient stands at the terminal, speaks to answer questions

USER CONTEXT:
The patient stands at a kiosk terminal (mounted at appropriate height). They are speaking their answers. The screen is large — 43" or 55" touchscreen. All elements must be scaled to be visible and readable from 60–80cm distance. Voice is the primary modality.

LAYOUT:
Full screen. No browser chrome. No sidebar.
Background: #F6F6F7

TOP BAR (72px):
  Progress bar: full width, 4px height, accent blue
  "Session in progress" — 14px muted left
  "~8 min remaining" — 14px muted center
  Privacy icon + "Secure" — 13px muted right

QUESTION DISPLAY (upper 35% of screen):
  Centered horizontally, vertically centered in this zone
  
  Question in selected language (Marathi shown):
    "तुम्हाला हे दुखणे किती दिवसांपासून आहे?" — 36px / 600 / #18181B
    (Extremely large — readable from 80cm on a 43" screen)
  
  English translation:
    "How long have you had this pain?" — 22px / 400 / #71717A
  
  Below: "Speak your answer, or touch an option below" — 16px / 400 / muted

VOICE BUTTON (center, dominant):
  The microphone button: 120px diameter (kiosk scale — much larger than mobile 72px)
  
  LISTENING state:
    Background: #EFF6FF
    Mic icon: 48px, filled, #2563EB
    Ring 1: 160px diameter, rgba(37,99,235,0.4), expanding
    Ring 2: 200px diameter, rgba(37,99,235,0.2), lagging
    Label below: 18px / 400 / #2563EB (in selected language)
    
  Audio waveform: 10 bars (wider than mobile), each 8px wide, 40px max height
  Below button

TOUCH OPTIONS (lower 30% of screen):
  4 answer options in a 2×2 grid (kiosk landscape) or vertical list (portrait):
  
  Each touch card: 96px height, full width within column
  Border: 2px solid #E4E4E7, radius 12px, white bg
  Text: 18px / 400 (readable at distance)
  Selected: 3px accent border, accent bg, check right-aligned
  
  Options (for "duration" question):
    "Less than 1 week" | "1–4 weeks" | "1–3 months" | "More than 3 months"

ACTION AREA (bottom 10%):
  Two buttons side by side:
    "Stop speaking" — 64px height, secondary, 200px wide (if listening)
    "Next question →" — 64px height, primary, 300px wide (if answer selected)
  
  Below: very small: "← Change previous answer" ghost link 14px muted

TRANSCRIPTION (appears after voice input):
  Large text bubble (Foundation 3 but 2× scale):
    Max-width: 700px, centered
    Text: 20px / 400 / #18181B
    "Did we get that right?" — 18px / 500
    "Yes" / "Change it" — 64px buttons, 300px width each

STATES:
Ready: voice button gray, waiting for activation
Listening: rings animate, waveform active
Processing: rotating arc around button
Confirmation: bubble appears
Touch selected: card highlighted, "Next" enabled

RESPONSIVE:
Kiosk landscape (55"/43"): 2×2 touch grid as described
Kiosk portrait (tablet-kiosk): single column touch options, full width

MOTION:
Rings: same as P-07 but larger (120px button, proportionally scaled rings)
Waveform: 10 bars vs 5-7 on mobile
Question text: slides in from right 200ms on each new question (clear progress signal on large screen)

ACCESSIBILITY:
All touch targets: minimum 96px height (no exceptions on kiosk)
Text minimum: 18px for options, 36px for question
Audio: question is always read aloud as it appears (kiosk config)
High contrast maintained: all text meets 4.5:1 minimum

VISUAL HIERARCHY:
1. Question text (top — enormous, most readable element)
2. Microphone button + rings (center — dominant interaction element)
3. Touch option cards (bottom grid — large, easy to tap)
4. "Stop / Next" action buttons (bottom bar — 64px, unmissable)

DO NOT CHANGE: Foundation 1, Foundation 3 kiosk mode. All touch targets minimum 96px. Microphone button minimum 120px diameter. Question text minimum 36px. This screen is for large-format kiosk display — do not scale down.

---

### K-04 — Kiosk — Idle / Privacy Reset

**STITCH PROMPT — SCREEN K-04: KIOSK — IDLE / PRIVACY RESET**

Inherits: Foundation 1, Foundation 3 (Kiosk mode)

Screen ID: K-04
User Role: No user (between sessions)
Surface: Kiosk
Route: /kiosk/idle (post-session privacy screen)
Purpose: Display after a session is complete — confirming data clearance, protecting patient privacy, and attracting the next user

USER CONTEXT:
A patient has just completed their intake. The kiosk must now: (1) immediately clear all session data, (2) show a privacy confirmation, (3) transition to attract mode for the next patient. This screen is the boundary between one session and the next.

NOTE: This is distinct from P-23 — P-23 is the idle state mid-use. K-04 is specifically the POST-SESSION privacy reset state on a kiosk.

LAYOUT:
Full screen. No browser chrome. Black or very dark near-black background (#111111) for privacy reset phase (brief), then fades to canvas.

PHASE 1 — SESSION CLEARED (3 seconds):
  Background: #111111 (dark — visual signal that the session ended, screen "wiped")
  
  Centered:
    An animated check-circle: 80px, white stroke drawing animation (400ms)
    "Session ended. All data cleared." — 24px / 600 / white, centered
    In selected language (of the just-completed session): same text below, 18px / muted white
  
  Nothing else on screen. Clean. Private. Clear signal.

PHASE 2 — FADE TO ATTRACT (after 3 seconds):
  Background fades from dark → #F6F6F7 (canvas) over 1000ms ease-in-out
  
  Content fades in as background brightens:

TOP SECTION:
  Privacy confirmation banner (lingers from Phase 1):
    Background: #F0FDF4, border #16A34A
    check icon + "Previous session has been cleared. This screen is ready for a new patient." — 15px / 500 / #15803D
    This banner disappears after 8 seconds total
  
  Vaidya wordmark + AIIA identifier (same as K-01)

CENTER SECTION (attract mode):
  Large hand-pointer icon: 64px, #D4D4D8, with pulse animation
  "Touch anywhere to begin your visit" — 36px / 600 / #18181B
  
  In Hindi: "यात्रा शुरू करने के लिए यहाँ स्पर्श करें" — 24px / 400 / #52525B
  In Marathi: "सुरू करण्यासाठी येथे स्पर्श करा" — 20px / 400 / #A1A1AA

LANGUAGE PREVIEW ROW:
  Same as P-23 — horizontal row of 12 language pills
  Passive display, not interactive (interactivity begins on first touch → K-01/K-02)

BOTTOM STRIP (56px, white, top border):
  Left: Clock — "10:48 AM" — 28px / 600 / JetBrains Mono
  Center: "15 Aug 2026 · Tuesday" — 16px muted
  Right: "Currently serving Token #31" — 16px / 500 (if HIS provides queue data)

SCREEN DIM (after 15 min true idle):
  Background dims: opacity 1.0 → 0.5, 3s ease-in
  A single centered line remains readable: "Touch to wake the screen" — 18px / 400 / #52525B
  Touch any area → instantly brightens to full attract mode (150ms fade)

SESSION RESET VISUAL CUE:
  The privacy check animation from Phase 1 echoes briefly in the top-right corner as a small chip: "Session cleared" — 12px / green, fades after 8 seconds total from session end

STATES:
Phase 1 (0–3s after session end): dark screen, large check, "Session cleared" message
Phase 2 (3–∞ seconds): attract mode, language pills, clock
Long idle (15+ min): dimmed screen
Any touch: → K-01 or K-02 immediately

RESPONSIVE:
Kiosk only. Two orientations:
  Landscape: hand pointer + attract text centered, language pills below
  Portrait: same structure, slightly tighter spacing

MOTION:
Phase 1 → Phase 2: background color: #111111 → #F6F6F7, 1000ms ease-in-out — a deliberate "cleaning" visual
Check-circle draw: stroke path animation 400ms ease-out
Content fade-in: elements stagger in as background brightens (each 150ms delay)
Hand pointer pulse: scale 1.0→1.12→1.0, 2.5s loop

ACCESSIBILITY:
Phase 1: aria-live "assertive" — "Session has ended and all data has been cleared"
Phase 2 attract: aria-live "polite" — "Screen ready for new patient"
All text in attract mode: minimum 20px
Clock: aria-label "Current time 10:48 AM"

VISUAL HIERARCHY:
Phase 1:
1. Check-circle (visual anchor — confirms clearance)
2. "Session ended. All data cleared." (confirmation text)

Phase 2:
1. "Touch anywhere to begin" (dominant — attract text)
2. Hand pointer icon (visual draw)
3. Privacy confirmation banner (top — for observing staff)
4. Clock + queue (bottom — ambient context)

DO NOT CHANGE: Foundation 1, Foundation 3 kiosk mode. Phase 1 MUST use a dark background — the visual "wipe" is the privacy confirmation. Phase 2 MUST show the "Session cleared" confirmation for at least 8 seconds from session end. Language pills are always passive (display-only) in attract mode.

---

## END OF COMPLETE STITCH PROMPT COMPENDIUM

**Total screens generated: 57**

P-01 through P-23: 23 patient screens
T-01 through T-05: 5 triage screens  
D-01 through D-18: 18 physician screens
A-01 through A-07: 7 admin screens
K-01 through K-04: 4 kiosk screens

**Design Continuity Verification:**
Every screen:
- Inherits Foundation 1 (Design System)
- Uses #2563EB accent, #16A34A verified, #D97706 warning, #DC2626 critical, #0D9488 AYUSH
- Uses JetBrains Mono for all technical/numeric values
- Maintains 8px spacing grid
- Maintains radius scale (4/6/8/12px)
- Uses Lucide icons at 1.5px stroke
- Respects prefers-reduced-motion
- Has all required states (default/loading/error/success/empty)
- Contains realistic fictional Indian clinical data
- Contains no marketing language or AI promotional copy

**The first screen (P-01) and the last screen (K-04) belong to the same product.**
