# TNPSC Study Circle — Collaborative Preparation Space

**TNPSC Study Circle** is a private, collaborative learning web application designed for friends preparing together for the **TNPSC Combined Civil Services Examination – IV (Group IV Services)**.

Derived from [`plan.md`](file:///Users/ruuban/Desktop/testmaster/plan.md) and designed in accordance with [`ui&ux.md`](file:///Users/ruuban/Desktop/testmaster/ui&ux.md).

---

## 🎯 Core Principles

1. **Collaboration, Not Competition:** Absolutely no leaderboards, rankings, top performer comparisons, or competitive badges.
2. **Privacy First:** Detailed test answers, scores, and personal study notes are strictly private. Friends only see syllabus portion coverage status and tests published to the common library.
3. **Syllabus-Anchored Portion Tracking:** Official exam hierarchy (`Exam → Part → Unit → Topic → Subtopic`) eliminates inconsistent topic names.
4. **External MCQ Preparation:** Test questions are authored outside the application (e.g. with ChatGPT) following the strict `schemaVersion: "1.0"` format and imported by members.
5. **Immutable Version Snapshots:** Tests snapshot question data upon publication, ensuring reproducible and secure server-side evaluation.

---

## 🛠 Tech Stack & Architecture

- **Frontend:** React 18, Vite, React Router v6, CSS Modules & Design Tokens
- **Backend:** Node.js, Express, REST API, JWT Authentication, bcrypt password hashing
- **Database:** MongoDB Atlas / Local MongoDB via Mongoose, with automatic zero-configuration fallback to an embedded JSON datastore in `./server/data/`
- **Design System:** Calm academic palette matching `ui&ux.md` (`#FAF8F2` warm paper, `#176B67` peacock teal, `#172633` deep ink, `#E7A33E` saffron accent).
- **Typography:** `Inter` (body), `Manrope` (headings), `Noto Sans Tamil` (authentic Tamil script).

---

## 📚 Canonical TNPSC Group IV Syllabus Structure

The application is pre-seeded with the official Group IV curriculum:

- **Part A: General Studies (75 Questions)**
  - *Unit I: General Science* (17 topics)
  - *Unit II: Geography* (13 topics)
  - *Unit III: History, Culture of India & National Movement* (11 topics)
  - *Unit IV: Indian Polity* (22 topics)
  - *Unit V: Indian Economy & Development Administration in Tamil Nadu* (13 topics)
  - *Unit VI: History, Culture, Heritage & Socio-Political Movements of Tamil Nadu* (7 topics)
- **Part B: Aptitude & Mental Ability (25 Questions)**
  - *Unit I: Aptitude* (Simplification, Percentage, HCF & LCM, Ratio, Simple & Compound Interest, Area & Volume, Time & Work)
  - *Unit II: Reasoning* (Logical Reasoning, Puzzles, Dice, Visual, Number Series)
- **Part C: Tamil Eligibility-cum-Scoring Test / பொதுத் தமிழ் (100 Questions)**
  - *அலகு I: இலக்கணம்* (13 topics)
  - *அலகு II: சொல்லகராதி* (10 topics)
  - *அலகு III: எழுதும் திறன்* (6 topics)
  - *அலகு IV: கலைச் சொற்கள்* (4 topics)
  - *அலகு V: வாசித்தல் – புரிந்து கொள்ளும் திறன்* (3 topics)
  - *அலகு VI: எளிய மொழி பெயர்ப்பு* (2 topics)
  - *அலகு VII: இலக்கியம், தமிழ் அறிஞர்களும் தமிழ்த்தொண்டும்* (திருக்குறள் 20 அதிகாரங்கள், அறநூல்கள், தமிழ் அறிஞர்கள்)
- **Part C (Optional): General English (100 Questions)**
  - Grammar, Vocabulary, Writing Skills, Reading Comprehension & Literary Appreciation (for differently-abled candidates).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Backend dependencies
cd server && npm install

# Frontend dependencies
cd ../client && npm install
```

### 2. Seed Initial Database
```bash
npm run seed
```
This populates the canonical syllabus, default study group, sample friend profiles, and ready-to-attempt practice tests in Tamil and English!

### 3. Run the Verification Test Suite
```bash
npm test
```
Executes all 13 end-to-end automated tests verifying:
- Authentication & JWT issuance
- Syllabus hierarchy retrieval
- Portion updates & privacy boundaries
- Test JSON Schema v1.0 validation
- Active exam security (zero answer leakage)
- Server-side score evaluation
- Bookmarks & Revision list generation
- Non-competitive group activity feed

### 4. Start the Application
```bash
# Start backend server (Port 5001)
npm run server

# In another terminal, start client dev server (Port 3000)
npm run client
```
Or build the client and serve everything from Express on `http://localhost:5001`:
```bash
npm run build
npm start
```

---

## 👥 Demo Accounts (Seeded)

| Role | Display Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Group Admin** | Senthil Kumar (Admin) | `admin@studycircle.tnpsc` | `TNPSCAdmin#2025` |
| **Member** | Kavitha Rajan | `kavitha@studycircle.tnpsc` | `TNPSCUser#2025` |
| **Member** | Manojkumar S. | `manoj@studycircle.tnpsc` | `TNPSCUser#2025` |
| **Member** | Deepa Sundaram | `deepa@studycircle.tnpsc` | `TNPSCUser#2025` |

**Group Invitation Code:** `TNPSC2025`

---

## 📄 Test JSON Import Specification (Schema v1.0)

When preparing tests with ChatGPT or an external editor, use this exact JSON format:

```json
{
  "schemaVersion": "1.0",
  "title": "Indian Polity - Fundamental Rights",
  "exam": "TNPSC Group IV",
  "part": "A",
  "unit": "Indian Polity",
  "topics": ["fundamental-rights"],
  "questionCount": 2,
  "durationMinutes": 10,
  "language": "English",
  "questions": [
    {
      "id": "Q001",
      "question": "Under which Article of the Constitution is equality before law guaranteed?",
      "options": [
        { "key": "A", "text": "Article 14" },
        { "key": "B", "text": "Article 19" },
        { "key": "C", "text": "Article 21" },
        { "key": "D", "text": "Article 32" }
      ],
      "correctAnswer": "A",
      "explanation": "Article 14 guarantees equality before law and equal protection of laws.",
      "difficulty": "easy"
    }
  ]
}
```

---

## 🎨 UI/UX Features Implemented

- **Portion Path:** Signature visual connected route and list views with status indicators (`Not started`, `In progress`, `Completed`, `Revision needed`).
- **Friend Portion Cards:** Clean completion summaries without revealing scores or private notes.
- **Guided Test Upload Stepper:** 5-step wizard (`Select` $\rightarrow$ `Validate` $\rightarrow$ `Preview` $\rightarrow$ `Save Draft` $\rightarrow$ `Publish`).
- **Examination Engine:** Timed exam with visible countdown, autosaving, Previous/Next navigation, Question Palette with accessibility legend, and confirm dialog.
- **Learning Review:** Question-by-question explanations, chosen option vs. official key, and instant bookmarking.
- **Revision Queue:** Automatically curates questions answered incorrectly across past attempts for targeted revision.

