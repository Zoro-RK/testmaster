# TNPSC Study Circle — Implementation Plan

This implementation plan is derived directly from [plan.md](file:///Users/ruuban/Desktop/testmaster/plan.md) and [ui&ux.md](file:///Users/ruuban/Desktop/testmaster/ui&ux.md).

## Executive Architecture Summary

### Stack
- **Frontend:** React 18, Vite, React Router v6, CSS Modules & Design Tokens (`ui&ux.md`)
- **Backend:** Node.js, Express, REST API, JWT auth, bcrypt password hashing
- **Database:** MongoDB Atlas / Local MongoDB via Mongoose with automatic embedded JSON datastore fallback for instant offline/sandbox execution
- **Typography:** Inter (body), Manrope (headings), Noto Sans Tamil (Tamil script)
- **Visual Identity:** Warm paper-50 background (`#FAF8F2`), Peacock Teal primary (`#176B67`), Deep Ink (`#172633`), Saffron accents (`#E7A33E`), Original "Learning Path" SVG branding.

---

## Roadmap

### Phase 1: Architecture, Authentication & Group System
- Express server initialization with modular structure (`routes`, `controllers`, `models`, `middleware`).
- User registration, login, JWT issuance, profile retrieval.
- Private Study Group initialization with Invitation Code system & approval mode.
- Frontend Auth Layout (distinctive 2-column desktop / stacked mobile), Login & Register forms with inline validation.

### Phase 2: Syllabus Catalogue & Portion Tracking
- Complete TNPSC Group IV canonical syllabus data seed (General Studies Units I-VI, Aptitude Units I-II, Tamil Units I-VII, General English Units I-VII).
- Syllabus Explorer with hierarchical search and expandable units/topics.
- Signature **Portion Path** component with status chips (`Not started`, `In progress`, `Completed`, `Revision needed`) and visual route connector.
- Friends Directory & Friend Portion Card showing shared syllabus completion without revealing private notes or exam scores.

### Phase 3: Test Import & Test Library
- Test JSON Schema v1.0 specification and validator (unique IDs, 4 options A/B/C/D, valid answer key, topic IDs).
- Guided 5-step Test Upload Stepper: Choose File $\rightarrow$ Validate $\rightarrow$ Preview $\rightarrow$ Save Draft $\rightarrow$ Publish.
- Test Library with search and filters (exam part, unit, topic, creator, attempt state).
- Sample test papers seeded in the library.

### Phase 4: Examination Engine
- Test Instructions & Start Exam gate.
- Timed examination interface: one-question-at-a-time, question palette (Answered, Unanswered, Marked for Review, Answered + Review), autosave answers, countdown timer.
- Secure server-side evaluation: correct answers stripped from active attempt payloads; scored securely on submission or automated timeout.

### Phase 5: Personal Progress, Revision & Bookmarks
- Private Result view: score summary, question-by-question review with explanations and option breakdown.
- Personal Bookmarking system: save challenging questions for later review.
- Revision Queue: questions answered incorrectly for focused practice.
- My Progress dashboard: topic-wise completion analysis and attempt history.

### Phase 6: Study Materials, Activity Feed & Final Polish
- Study Materials sharing: upload notes/documents linked to syllabus topics.
- Shared Activity feed: non-competitive group updates (tests published, materials shared, portions updated).
- Responsive UI/UX check (mobile bottom navigation, drawer, responsive tables, empty & loading states).
- System verification & sample data seeding.

