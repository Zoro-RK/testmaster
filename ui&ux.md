# UI & UX Design Specification

## 1. Product design direction

**Product:** Private collaborative TNPSC study application\
**Working brand name:** `[APP NAME]` --- final name to be decided\
**Primary users:** Friends preparing for TNPSC examinations together\
**Core experience:** Track syllabus portions, discover friends'
published tests, attend tests, and review personal progress.

### Design goals

1.  Feel like a focused study space, not a social-media feed or
    competitive exam leaderboard.
2.  Make the syllabus easy to explore from exam part → unit → topic →
    subtopic.
3.  Make it obvious which portions each member has covered, without
    exposing private notes or test results.
4.  Make uploading and publishing a test simple and
    confidence-inspiring.
5.  Work smoothly on mobile, tablet, laptop, and large desktop screens.
6.  Use a recognisable visual identity rather than a generic
    admin-dashboard template.

### Experience principles

-   **Progress without pressure:** Show personal progress and shared
    study activity, never rankings or top scorers.
-   **Clarity before decoration:** Keep question text, syllabus labels,
    and actions easy to scan.
-   **Warm but disciplined:** Use a calm academic palette with a few
    energetic accents.
-   **Consistent patterns:** Reuse the same status colours, buttons,
    cards, and navigation behaviours.
-   **Mobile-first functionality:** Every important action must work on
    a phone, not just fit on the screen.

------------------------------------------------------------------------

## 2. Brand identity

### 2.1 Logo concept

Create an original vector logo; do not use a stock graduation-cap icon.

**Concept: "The Learning Path"**

-   Main symbol: an open book formed from two simple page shapes.
-   The inner negative space creates a subtle upward path or route.
-   A small check-shaped endpoint represents completed learning.
-   The mark should remain recognisable at 24 × 24 px.
-   Use a standalone symbol for the favicon, app icon, loading screen,
    and compact mobile header.
-   Use the symbol plus `[APP NAME]` wordmark in the desktop sidebar and
    login screen.

**Logo variants**

  Variant              Use
  -------------------- --------------------------------------
  Primary horizontal   Login, desktop header, welcome email
  Stacked              Splash screen, promotional page
  Symbol only          Favicon, mobile header, app icon
  Monochrome light     Dark backgrounds
  Monochrome dark      Light backgrounds

**Logo rules**

-   Keep clear space around the logo equal to at least the height of the
    symbol.
-   Do not stretch, rotate, add shadows, or place it on a visually noisy
    background.
-   Do not use the logo as a substitute for ordinary navigation icons.
-   Export SVG for the web and PNG app-icon sizes when needed.

### 2.2 Colour system

Use a warm paper-like background, deep ink text, and peacock teal as the
primary action colour. Saffron is an accent, not a second primary
colour.

  Token           Hex         Purpose
  --------------- ----------- -------------------------------------
  `ink-900`       `#172633`   Main text, dark navigation
  `ink-700`       `#344957`   Secondary headings
  `teal-700`      `#176B67`   Primary buttons, active navigation
  `teal-100`      `#DCEFEB`   Selected states, soft highlights
  `saffron-500`   `#E7A33E`   Small highlights, progress emphasis
  `coral-500`     `#D97768`   Important secondary accent
  `paper-50`      `#FAF8F2`   Main page background
  `paper-100`     `#F0EEE6`   Panels and subtle surfaces
  `white`         `#FFFFFF`   Cards and input backgrounds
  `line`          `#E3E4DE`   Borders and dividers
  `success`       `#287A58`   Completed / success
  `warning`       `#A86B16`   Needs attention
  `danger`        `#B74747`   Errors / destructive actions
  `muted`         `#71808A`   Supporting text

**Colour usage**

-   Main page: `paper-50`.
-   Cards and forms: `white`.
-   Primary action: `teal-700`, with white text.
-   Active navigation: pale teal background with teal text and a slim
    leading indicator.
-   Saffron: use sparingly for a small progress marker, a featured
    label, or a loading detail.
-   Coral: use for a secondary visual accent, not for error states.
-   Do not communicate status by colour alone; always include a label or
    icon.

### 2.3 Background and graphic language

Build a recognisable pattern from the logo's page/path geometry:

-   Use faint, oversized page-line curves or route-line motifs in empty
    areas.
-   Keep pattern opacity very low (approximately 4--7%).
-   Use small geometric page-corner details in empty states and section
    headers.
-   Avoid busy textbook illustrations, random blobs, excessive
    gradients, and repeated emoji.
-   Use a subtle paper texture only if it does not reduce text contrast
    or increase loading time.

### 2.4 Typography

Recommended web-safe font pairing:

-   **Headings:** `Manrope` or `Plus Jakarta Sans`.
-   **Body and UI:** `Inter`.
-   **Tamil content:** use a font with dependable Tamil glyph coverage,
    such as `Noto Sans Tamil`, with a suitable fallback.

Typography scale:

  Style                 Desktop   Mobile   Weight
  ------------------- --------- -------- --------
  Display / welcome       40 px    30 px      700
  Page title              30 px    25 px      700
  Section title           21 px    19 px      650
  Card title              17 px    16 px      600
  Body                    15 px    15 px      400
  Supporting              13 px    13 px      400
  Small label             12 px    12 px      600

Use comfortable line height: 1.45--1.6 for body text. Do not use tiny
text for syllabus names or exam questions.

------------------------------------------------------------------------

## 3. Unique interface elements

### 3.1 Portion Path

The signature component of the app.

-   Display the syllabus as a clear hierarchy: Exam → Part → Unit →
    Topic → Subtopic.
-   Show each topic's status using both a small symbol and a text label.
-   Statuses: `Not started`, `In progress`, `Completed`,
    `Revision needed`.
-   A thin path line can visually connect topics within a unit.
-   Completed topics can show a filled check node; in-progress topics
    show a half-filled node; not-started topics show an outline node.
-   Do not use a red/green-only system.
-   Allow list view as an alternative to the visual path for
    accessibility and compact mobile use.

### 3.2 Friend Portion Card

Each card should show:

-   Avatar or initials.
-   Member name.
-   Overall portion summary (for example, `12 of 30 topics completed`).
-   A compact progress bar.
-   Recently updated topic.
-   Link to view the member's shared syllabus progress.

Never show that member's marks, answers, private notes, or personal
attempt history on this card.

### 3.3 Test Card

Each published test card should show:

-   Test title.
-   Creator name.
-   Exam / part / unit / topic tags.
-   Number of questions.
-   Duration.
-   Publication date.
-   Attempt state for the current user: `Not attempted`, `In progress`,
    or `Attempted`.

Do not display another member's score or rank.

### 3.4 Question Navigator

During an exam:

-   Use numbered question tiles.
-   Distinguish `Answered`, `Not answered`, `Marked for review`, and
    `Answered + review`.
-   Include a text legend; colour alone is insufficient.
-   Keep the current question clearly outlined.
-   On mobile, use a collapsible question palette or bottom sheet.

### 3.5 Progress Ring and Summary

Use progress rings only for a small number of meaningful personal
summaries. Prefer a simple bar when comparing several syllabus units. Do
not fill the dashboard with decorative charts.

------------------------------------------------------------------------

## 4. Loading screen and app startup

### 4.1 Splash / loading screen concept

Create a distinctive loading experience using the original Learning Path
logo.

**Composition**

1.  Full-screen `paper-50` background.
2.  Centre the symbol and `[APP NAME]` wordmark.
3.  Animate a thin teal line travelling through the book/path mark.
4.  Show a small message below, such as `Preparing your study space…`.
5.  Use a restrained saffron dot as a secondary motion detail.

**Motion**

-   Duration: approximately 700--1,200 ms when a short branded
    transition is needed.
-   The animation must not force users to wait if the app is already
    ready.
-   For longer network waits, switch to a real loading state with a
    helpful message.
-   Respect `prefers-reduced-motion`; show a static logo and progress
    indicator instead.
-   Never display a fake percentage if actual loading progress is
    unknown.

### 4.2 Loading states inside the app

-   Use skeleton cards for dashboard content.
-   Use a small inline spinner for button actions.
-   Keep the existing page shell visible while data loads.
-   Show a retry action when a request fails.
-   Avoid blank white screens and indefinite spinners.

------------------------------------------------------------------------

## 5. Login and registration experience

### 5.1 Login screen --- distinctive layout

Avoid a plain centred form on a blank background.

**Desktop layout**

-   Two-column composition.
-   Left panel: deep ink background with the logo, a short product
    statement, and a custom abstract illustration of the Portion Path.
-   Right panel: warm paper background with a compact white login card.
-   Keep the form visually dominant and easy to reach.
-   Use a restrained teal/saffron accent; avoid a large decorative
    gradient.

**Suggested left-panel copy**

> Study together. Track every portion. Learn at your own pace.

Supporting line:

> A private TNPSC study space for your group.

**Login card**

-   Logo symbol and `Welcome back`.
-   Short helper text: `Sign in to continue your preparation.`
-   User ID field.
-   Password field with show/hide control.
-   `Sign in` primary button.
-   Link to registration or group joining, according to the selected
    group access policy.
-   Clear inline validation and server error messages.

Do not add remember-me, OTP, or forgot-password flows unless they are
deliberately included in the product requirements later. Do not expose
whether a particular user ID exists in error messages.

### 5.2 Mobile login

-   Single-column layout.
-   Use the logo at the top, then the form card.
-   Convert the decorative left panel into a compact branded header or
    remove it.
-   Inputs and buttons should be full width.
-   Keep the primary action visible without excessive scrolling.
-   Do not shrink the desktop two-column layout until it becomes
    cramped.

### 5.3 Registration screen

-   Match the login visual system.
-   Ask only for the information required to create an account.
-   Use clear password requirements and inline validation.
-   Explain how the user joins the private study group.
-   Do not imply that public registration automatically grants access to
    the private group.
-   Keep invitation code or admin approval behaviour configurable until
    the group-joining decision is final.

### 5.4 Form behaviour

-   Labels remain visible above fields; do not rely on placeholders
    alone.
-   Show validation near the relevant field.
-   Preserve safe form input after recoverable errors.
-   Disable the submit button only while the request is being processed.
-   Provide keyboard focus indicators and correct autocomplete
    attributes.

------------------------------------------------------------------------

## 6. Application layout and navigation

### 6.1 Desktop shell

Use a fixed-width left sidebar and a flexible content area.

**Sidebar navigation**

1.  Dashboard
2.  Friends
3.  Syllabus
4.  My Portions
5.  Test Library
6.  Upload Test
7.  My Progress
8.  Study Materials

Bottom area: - Profile and settings. - Group information. - Sign out.

Use a compact logo at the top. Active navigation should use a pale teal
surface, teal icon/text, and a slim accent line.

### 6.2 Mobile navigation

-   Use a compact top bar with logo and profile action.
-   Use a bottom navigation bar for the 4--5 most-used destinations.
-   Place less frequent actions such as settings and materials in a
    `More` menu.
-   Ensure the bottom navigation does not cover page content or test
    controls.
-   Use a drawer or full-screen menu for the complete navigation list.

### 6.3 Page header

Each main page should have:

-   Clear page title.
-   One-line description when useful.
-   Primary action aligned to the right on desktop.
-   Primary action placed below the title on narrow screens.
-   Breadcrumbs for deep syllabus pages.

------------------------------------------------------------------------

## 7. Screen-by-screen UX requirements

### 7.1 Dashboard

**Purpose:** Give each member a quick view of their own preparation and
the group's shared study activity.

Suggested sections:

-   Welcome message and current group name.
-   Personal syllabus progress.
-   Continue studying: recently opened topic.
-   Recently published tests.
-   Friends' recently updated portions.
-   Recent group activity, without marks or rankings.
-   Quick actions: `Explore syllabus`, `Upload a test`, `Browse tests`.

Do not include leaderboard, top scorers, rank, friend score comparison,
or competitive badges.

### 7.2 Friends directory

-   Search by member name.
-   Display friend cards with shared portion progress.
-   Filter by recently active or portion status if useful.
-   Opening a profile shows shared syllabus progress and tests published
    by that member.
-   Clearly separate public-to-group information from private personal
    information.

### 7.3 Syllabus explorer

-   Start with the selected TNPSC exam.
-   Show Parts A, B, and C according to the imported official syllabus
    catalogue.
-   Expand units to reveal topics and subtopics.
-   Provide search by topic name.
-   Show question counts or syllabus metadata only where verified from
    the source syllabus.
-   On mobile, use nested expandable lists rather than a wide tree.

### 7.4 My Portions

-   Show the member's own topic statuses.
-   Allow status changes with a clear save confirmation.
-   Support private notes visible only to the owner.
-   Provide filters for all statuses.
-   Allow a topic to be marked completed without requiring a test
    attempt.
-   Uploading a test must not automatically mark a topic completed.

### 7.5 Friend's Portions

-   Show only the portion status and fields intended to be shared with
    the group.
-   Hide private notes and personal test performance.
-   Provide a clear member selector or profile entry point.
-   Keep the same status labels and symbols as `My Portions`.

### 7.6 Test Library

-   Search by title, topic, creator, or unit.
-   Filters: exam, part, unit, topic, creator, publication date, and own
    attempt state.
-   Use responsive test cards.
-   Make duration and question count easy to find.
-   Clearly distinguish draft tests (owner only) from published group
    tests.

### 7.7 Upload Test

Use a guided stepper:

1.  **Choose file** --- select the app-supported JSON file.
2.  **Validate** --- check structure, required fields, question count,
    unique IDs, four options, valid answer key, and topic references.
3.  **Preview** --- inspect questions and answers before saving.
4.  **Save draft** --- allow the creator to return later.
5.  **Publish** --- make the test available to the group.

UX details:

-   Explain the expected JSON format before upload.
-   Show errors with question numbers and field names.
-   Separate blocking errors from warnings.
-   Do not publish automatically after upload.
-   Provide a final confirmation showing title, question count,
    duration, and linked topics.

### 7.8 Test instructions and examination

Before starting, show:

-   Test title and creator.
-   Number of questions.
-   Duration.
-   Instructions.
-   `Start test` action.

During the test:

-   Keep timer visible but not visually alarming.
-   Display one question at a time.
-   Provide Previous, Next, Mark for Review, and Clear Response actions.
-   Autosave answers and show a small save state.
-   Provide a question palette.
-   Confirm before final submission.
-   Automatically submit when time expires.
-   On refresh or reconnection, restore the attempt where supported.
-   Never send correct answers to the browser before submission.

Mobile test screen:

-   Keep question text large and readable.
-   Stack answer options vertically.
-   Use a sticky bottom action area for Previous/Next.
-   Put the question palette in a drawer or bottom sheet.
-   Ensure the timer and submit action do not overlap.

### 7.9 Result and review

Show only the current user's own result:

-   Score and total questions.
-   Correct, incorrect, and unanswered counts.
-   Question-by-question review.
-   Selected answer and correct answer.
-   Explanation, if provided.
-   Bookmark question action.
-   Retake action if allowed.

Never expose the result to friends by default.

### 7.10 My Progress

-   Personal progress by exam, part, unit, and topic.
-   Show revision-needed topics.
-   Show personal attempt history.
-   Show bookmarked and incorrect questions.
-   Use charts only when they improve understanding.
-   No group ranking or comparison charts.

### 7.11 Empty, error, and success states

Create designed states for:

-   No tests published yet.
-   No friends in the group yet.
-   No portions started.
-   No search results.
-   Upload validation failed.
-   Network unavailable.
-   Test saved successfully.
-   Test published successfully.

Each empty state should include a short explanation and one relevant
next action. Avoid generic `No data` messages.

------------------------------------------------------------------------

## 8. Responsive design system

Use a mobile-first CSS approach. These breakpoints are starting points;
layouts should respond to available space rather than device labels
alone.

  -----------------------------------------------------------------------
  Range                               Layout behaviour
  ----------------------------------- -----------------------------------
  Below 600 px                        Single column, mobile navigation,
                                      stacked cards

  600--899 px                         Compact sidebar/drawer, two-column
                                      cards where space allows

  900--1199 px                        Desktop sidebar, flexible content,
                                      reduced card columns

  1200 px and above                   Full desktop shell, wider content
                                      grid
  -----------------------------------------------------------------------

### Responsive rules

-   No horizontal page scrolling at 320 px viewport width.
-   Cards must shrink or stack; do not force fixed desktop widths.
-   Tables should become stacked cards or use a labelled horizontal
    scroll container.
-   Syllabus hierarchy should become expandable lists on mobile.
-   Use a minimum 44 × 44 px touch target for important controls.
-   Keep question text and answer options readable at all widths.
-   Use responsive spacing: tighter on mobile, more generous on desktop.
-   Images and illustrations must scale without distortion.
-   Test at 320, 375, 430, 768, 1024, and 1440 px widths.

### Responsive acceptance checks

-   Login and registration work on small phones.
-   Dashboard cards stack cleanly.
-   Syllabus topics remain navigable without horizontal scrolling.
-   Test upload can be completed on mobile.
-   Examination controls remain reachable with the on-screen keyboard
    open.
-   Result explanations wrap correctly.
-   Navigation does not cover content.

------------------------------------------------------------------------

## 9. Components and interaction rules

Build reusable components rather than designing each page independently.

  Component         Required states
  ----------------- ------------------------------------------------------
  Button            Default, hover, focus, pressed, disabled, loading
  Text input        Default, focus, error, disabled, filled
  Status chip       Not started, In progress, Completed, Revision needed
  Progress bar      Empty, partial, complete
  Test card         Draft, published, attempted, in progress
  Topic row         Collapsed, expanded, selected
  Modal             Open, closing, validation error
  Toast             Success, warning, error, neutral
  Skeleton          Card, list, page section
  Question option   Default, selected, disabled
  Question tile     Current, answered, unanswered, review

### Interaction standards

-   Every clickable item must have a clear hover and keyboard-focus
    state.
-   Use confirmation dialogs for destructive or irreversible actions.
-   Use toast messages for successful saves and publishing.
-   Do not use toast messages as the only way to communicate important
    errors.
-   Keep animations short and purposeful (typically 150--250 ms).
-   Respect reduced-motion preferences.
-   Avoid parallax, excessive page transitions, and distracting animated
    backgrounds.

------------------------------------------------------------------------

## 10. Accessibility

Target WCAG 2.2 AA as the design and implementation goal.

-   Maintain sufficient text/background contrast.
-   Use semantic headings and landmarks.
-   Make all functionality keyboard accessible.
-   Provide visible focus indicators.
-   Associate form labels and validation messages with inputs.
-   Add accessible names to icon-only buttons.
-   Do not rely on colour alone for status or question state.
-   Support browser zoom up to 200% without loss of core functionality.
-   Use appropriate Tamil and English language metadata when language
    switching is supported.
-   Ensure test timers and expiry warnings are communicated accessibly.

------------------------------------------------------------------------

## 11. Design tokens and CSS structure

Centralise design tokens rather than scattering colour and spacing
values through components.

Suggested CSS variables:

``` css
:root {
  --color-ink-900: #172633;
  --color-ink-700: #344957;
  --color-teal-700: #176B67;
  --color-teal-100: #DCEFEB;
  --color-saffron-500: #E7A33E;
  --color-coral-500: #D97768;
  --color-paper-50: #FAF8F2;
  --color-paper-100: #F0EEE6;
  --color-white: #FFFFFF;
  --color-line: #E3E4DE;
  --color-success: #287A58;
  --color-warning: #A86B16;
  --color-danger: #B74747;
  --color-muted: #71808A;

  --font-heading: "Manrope", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-tamil: "Noto Sans Tamil", sans-serif;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  --shadow-card: 0 8px 24px rgba(23, 38, 51, 0.06);
  --content-max-width: 1440px;
}
```

Suggested frontend organisation:

``` text
src/
  assets/
    brand/
    illustrations/
  components/
    common/
    navigation/
    forms/
    syllabus/
    tests/
    progress/
  layouts/
    AuthLayout.jsx
    AppLayout.jsx
  pages/
    auth/
    dashboard/
    friends/
    syllabus/
    portions/
    tests/
    progress/
    materials/
    settings/
  styles/
    tokens.css
    global.css
    responsive.css
```

Use CSS Modules or organised plain CSS. Keep brand tokens in one place.
Avoid introducing a styling framework unless the project explicitly
chooses one.

------------------------------------------------------------------------

## 12. Content and language

-   Use plain, direct language for instructions and errors.
-   Preserve official TNPSC syllabus terminology in the syllabus
    catalogue.
-   Do not invent or rename official syllabus topics for visual
    convenience.
-   If Tamil and English are both supported, provide a deliberate
    language switch and ensure the layout handles longer Tamil labels.
-   Keep dates, durations, and question counts consistent throughout the
    app.
-   Use `Completed` rather than vague labels such as `Done`.
-   Use `Published` only when a test is available to group members.

------------------------------------------------------------------------

## 13. Privacy reflected in the interface

The visual design must reinforce the app's privacy model:

**Visible to the group** - Member name and basic profile fields selected
for sharing. - Shared syllabus portion status. - Published tests. -
Group-level activity that does not reveal scores.

**Private to the member** - Test marks and answer history. - Selected
answers and personal review history. - Private topic notes. - Personal
bookmarks and revision lists.

Add small explanatory helper text where users change sharing settings.
Do not create UI that suggests administrators can casually inspect
private member scores.

------------------------------------------------------------------------

## 14. Implementation order

1.  Create brand logo, colour tokens, typography, and global styles.
2.  Build responsive authentication layout and loading screen.
3.  Build the app shell, sidebar, mobile navigation, buttons, fields,
    cards, and status chips.
4.  Build dashboard and friends directory.
5.  Build syllabus explorer and Portion Path component.
6.  Build test library and JSON upload/preview flow.
7.  Build examination interface and question navigator.
8.  Build private result and personal progress pages.
9.  Add empty states, error states, accessibility, and responsive
    refinements.
10. Test the complete experience on mobile, tablet, and desktop.

------------------------------------------------------------------------

## 15. Definition of done

The UI/UX implementation is ready for review when:

-   [ ] The app has an original SVG logo and usable logo variants.
-   [ ] The splash/loading screen uses the brand identity and does not
    fake loading progress.
-   [ ] Login and registration are visually distinctive and responsive.
-   [ ] The app uses the defined colour, typography, spacing, and
    component tokens consistently.
-   [ ] The Portion Path makes syllabus progress easy to understand.
-   [ ] Friends can see only the information intended to be shared.
-   [ ] There are no leaderboards, rankings, or friend score
    comparisons.
-   [ ] Test upload has validation, preview, draft, and publish states.
-   [ ] The examination screen is usable on mobile and desktop.
-   [ ] Loading, empty, error, success, and disabled states are
    designed.
-   [ ] Keyboard navigation, focus states, contrast, and reduced motion
    are supported.
-   [ ] No core page has horizontal overflow at supported viewport
    widths.
-   [ ] Tamil syllabus labels render correctly if Tamil content is
    enabled.

**Important:** The app name, final logo artwork, and final language
policy are still product decisions. The brand direction in this document
is a proposed starting point, not a claim that those decisions have
already been approved.
