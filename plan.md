# TNPSC Study Circle -- Project Plan

**Project type:** Private collaborative TNPSC preparation web
application\
**Initial syllabus:** TNPSC Combined Civil Services Examination--IV
(Group IV Services)\
**Syllabus source:** User-uploaded PDF, dated 12 December 2024\
**Document purpose:** Product requirements, syllabus/portion structure,
workflows, data model, technical architecture and development roadmap.

------------------------------------------------------------------------

## 1. Project vision

TNPSC Study Circle is a private learning platform where friends prepare
together by recording the portions they have studied, sharing study
materials, publishing mock tests and attempting tests created by other
members.

The application is a collaborative learning space, not a competition
platform.

### Core principles

1.  Every member has an individual account.
2.  Members can view the friends directory and the portions each friend
    has covered.
3.  The syllabus is organized into official examination parts, units and
    topics.
4.  Members record their progress against those syllabus topics.
5.  Test questions are prepared outside the application with ChatGPT and
    imported by the member.
6.  Members can review a readable DOCX question paper before uploading
    the matching JSON file.
7.  Published tests can be attempted by other members.
8.  Each member's marks, answers and personal progress are private by
    default.
9.  There are no leaderboards, rankings, friend score comparisons or
    competitive badges.

## 2. Project goals

-   Make it easy to see what the group has studied and what remains to
    be covered.
-   Avoid inconsistent topic names by using a syllabus-based topic
    catalogue.
-   Let every member contribute question papers to the common test
    library.
-   Provide a reliable test-taking and answer-review experience.
-   Help each member revise weak topics using their own attempt history
    and bookmarks.
-   Keep the first release small enough to build, test and deploy
    without unnecessary complexity.

## 3. Scope and syllabus foundation

The initial syllabus is based on the uploaded **Combined Civil Services
Examination--IV (Group IV Services)** document.

The PDF describes: - Part A: General Studies -- 75 questions. - Part B:
Aptitude and Mental Ability -- 25 questions. - Part C: Tamil
Eligibility-cum-Scoring Test -- 100 questions. - Part C: General English
-- 100 questions, for differently abled candidates only.

The General English track must be optional and kept separate from the
standard Tamil eligibility test. Do not combine Tamil and General
English into one test.

The question counts shown in the syllabus are examination weightages.
They are not mandatory sizes for every practice test. A member may
publish a 10-, 25-, 50- or 100-question practice test. The creator
selects the test size and duration.

### 3.1 Part A -- General Studies (75 questions)

#### Unit I: General Science (5 questions)

Track the following syllabus topics: - Nature of Universe. - Measurement
of physical quantities. - General scientific laws in motion. - Force,
pressure and energy. - Everyday applications of mechanics, electricity,
magnetism, light, sound, heat and nuclear physics. - Elements and
compounds. - Acids, bases and salts. - Petroleum products, fertilizers
and pesticides. - Metallurgy and food adulterants. - Main concepts of
life science. - Classification of living organisms. - Evolution and
genetics. - Physiology, nutrition, health and hygiene. - Human
diseases. - Environmental science. - Latest inventions in science and
technology. - Current affairs.

#### Unit II: Geography (5 questions)

-   Earth location.
-   Physical features.
-   Monsoon, rainfall, weather and climate.
-   Water resources and rivers.
-   Soil, minerals and natural resources.
-   Forest and wildlife.
-   Agriculture pattern.
-   Transport and communication.
-   Population density and distribution in Tamil Nadu and India.
-   Calamities and disaster management.
-   Environment and climate change.
-   Geographical landmarks.
-   Current affairs.

#### Unit III: History, Culture of India and Indian National Movement (10 questions)

-   Indus Valley Civilization.
-   Guptas, Delhi Sultans, Mughals and Marathas.
-   South Indian History.
-   National Renaissance.
-   Early uprising against British Rule.
-   Indian National Congress.
-   Emergence of leaders.
-   Leaders named in the syllabus: B. R. Ambedkar, Bhagat Singh,
    Bharathiar, V. O. Chidambaranar, Thanthai Periyar, Jawaharlal Nehru,
    Rabindranath Tagore, Kamarajar, Mahatma Gandhi, Maulana Abul Kalam
    Azad, Rajaji, Subhash Chandra Bose, Muthulaksmi Ammaiyar, Muvalur
    Ramamirtham and other national leaders.
-   Different modes of agitation in Tamil Nadu and movements.
-   Characteristics of Indian Culture.
-   Unity in Diversity: race, language and custom.
-   India as a secular state.

#### Unit IV: Indian Polity (15 questions)

-   Constitution of India.
-   Preamble to the Constitution.
-   Salient features of the Constitution.
-   Union, State and Union Territory.
-   Citizenship.
-   Fundamental Rights.
-   Fundamental Duties.
-   Directive Principles of State Policy.
-   Union Executive and Union Legislature.
-   State Executive and State Legislature.
-   Local Governments and Panchayat Raj.
-   Spirit of federalism and Centre--State relationships.
-   Election.
-   Judiciary in India.
-   Rule of Law.
-   Corruption in public life and anti-corruption measures.
-   Lokpal and Lokayukta.
-   Right to Information.
-   Empowerment of Women.
-   Consumer Protection Forums.
-   Human Rights Charter.
-   Political parties and political system in Tamil Nadu and India.
-   Current affairs.

#### Unit V: Indian Economy and Development Administration in Tamil Nadu (20 questions)

-   Nature of Indian economy.
-   Five-year plan models and an assessment.
-   Planning Commission and Niti Aayog.
-   Sources of revenue.
-   Reserve Bank of India.
-   Finance Commission.
-   Resource sharing between Union and State Governments.
-   Goods and Services Tax.
-   Economic trends.
-   Employment generation.
-   Land reforms and agriculture.
-   Application of Science and Technology in Agriculture.
-   Industrial growth.
-   Rural welfare-oriented programmes.
-   Social problems: population, education, health, employment and
    poverty.
-   Social Justice and Social Harmony as cornerstones of socio-economic
    development.
-   Education and Health systems in Tamil Nadu.
-   Geography of Tamil Nadu and its impact on economic growth.
-   Welfare schemes of Government.
-   Current socio-economic issues.
-   Current affairs.

#### Unit VI: History, Culture, Heritage and Socio-Political Movements of Tamil Nadu (20 questions)

-   History of Tamil Society.
-   Related archaeological discoveries.
-   Tamil Literature from Sangam age till contemporary times.
-   Thirukkural:
    -   Significance as secular literature.
    -   Relevance to everyday life.
    -   Impact on humanity.
    -   Universal values.
    -   Relevance to socio-political-economic affairs.
    -   Philosophical content.
-   Role of Tamil Nadu in the freedom struggle.
-   Early agitations against British Rule.
-   Role of women in the freedom struggle.
-   Various social reformers.
-   Social reform movements.
-   Social transformation of Tamil Nadu.

### 3.2 Part B -- Aptitude and Mental Ability (25 questions)

#### Unit I: Aptitude (15 questions)

-   Simplification.
-   Percentage.
-   Highest Common Factor (HCF).
-   Lowest Common Multiple (LCM).
-   Ratio and Proportion.
-   Simple interest.
-   Compound interest.
-   Area.
-   Volume.
-   Time and Work.

#### Unit II: Reasoning (10 questions)

-   Logical reasoning.
-   Puzzles.
-   Dice.
-   Visual reasoning.
-   Alphanumeric reasoning.
-   Number series.

### 3.3 Part C -- Tamil Eligibility-cum-Scoring Test (100 questions)

The uploaded PDF lists these units and question counts. Tamil topic
names should be shown in Tamil in the application wherever possible. The
uploaded PDF is the reference for the exact Tamil wording. Its extracted
text contains OCR/encoding irregularities, so the original PDF should be
checked when entering or correcting detailed Tamil labels. Do not
silently replace unclear Tamil terms with guessed wording.

#### அலகு I: இலக்கணம் (25 கேள்விகள்)

The PDF groups grammar topics under எழுத்து and சொல். Topics visible in
the source include: - பிரித்து எழுதுதல்; சேர்த்து எழுதுதல். - சந்திப்பிழை. -
குறில், நெடில் வேறுபாடு. - லகர, ளகர, ழகர வேறுபாடு. - னகர, ணகர வேறுபாடு. -
ரகர, றகர வேறுபாடு. - இன எழுத்துகள் அறிதல். - சுட்டு எழுத்துகள்; வினா
எழுத்துகள். - ஒருமை, பன்மை அறிதல். - சேர்ச்சொல் அறிதல். - வினைமுற்று, வினையெச்சம்,
வினையாலணையும் பெயர், பெயரெச்சம் வகை அறிதல். - அயற்சொல் / தமிழ்ச்சொல் and related
word identification as listed in the source. - எதிர்ச்சொல்; வினைச்சொல். -
எழுத்துப்பிழை and ஒற்றுப்பிழை. - இரண்டு வினைச்சொற்களின் வேறுபாடு.

#### அலகு II: சொல்லகராதி (15 கேள்விகள்)

-   எதிர்ச்சொல் எழுதுதல்.
-   ஓரெழுத்து ஒரு மொழி.
-   உரிய பொருளைக் கண்டறிதல்.
-   ஒருபொருள் தரும் பல சொற்கள்.
-   பொருந்தாச் சொல்லைக் கண்டறிதல்.
-   அகர வரிசைப்படி சொற்களைச் சீரமைத்தல்.
-   ஒருபொருள் பன்மொழி.
-   இருபொருள் குறிக்கும் சொற்கள்.
-   பேச்சு வழக்கு and எழுத்து வழக்கு.
-   சொல்லும் பொருளும் அறிதல்.
-   ஒரு சொல்லிற்கு இணையான வேறு சொல் அறிதல்.
-   சரியான சொல்லைத் தேர்ந்தெடுத்து எழுதுதல்.
-   பொருத்தமான பொருளைத் தெரிவு செய்தல்.
-   ஊர்ப் பெயர்களின் மரூஉ.
-   பிழை திருத்துதல்.
-   பேச்சு வழக்குச் சொற்களுக்கு இணையான தூய தமிழ்ச் சொற்கள்.
-   பேச்சு வழக்குத் தொடர்களில் பிழை திருத்தம்.
-   சொற்களை இணைத்துப் புதிய சொல் உருவாக்குதல்.
-   அடைப்புக்குள் உள்ள சொல்லைத் தகுந்த இடத்தில் சேர்த்தல்.
-   பொருள் தரும் ஓர் எழுத்து.
-   பல பொருள் தரும் ஒரு சொல்லைக் கூறுதல்.

#### அலகு III: எழுதும் திறன் (15 கேள்விகள்)

-   சொற்களை ஒழுங்குபடுத்திச் சொற்றொடர் அமைத்தல்.
-   தொடர் வகைகள்.
-   செய்வினை, செயப்பாட்டு வினை.
-   தன்வினை, பிறவினை.
-   ஒருமை, பன்மை பிழையறிந்து சரியான தொடரறிதல்.
-   மரபுத் தமிழ்:
    -   திணை மரபு.
    -   பால் மரபு.
    -   காலம்.
    -   இளமைப் பெயர்.
    -   ஒலி மரபு.
    -   வினை மரபு.
    -   தொகை மரபு.
-   நிறுத்தல் குறியீடுகள் and their usage.

#### அலகு IV: கலைச் சொற்கள் (10 கேள்விகள்)

The source covers technical/art terms across: - அறிவியல். - கல்வி. -
மருத்துவம். - மேலாண்மை. - சட்டம். - புவியியல். - தொழில்நுட்பம். - ஊடகம். - தகவல்
தொழில்நுட்பம்.

Questions should test equivalent Tamil terms for terms used in these
fields.

#### அலகு V: வாசித்தல் -- புரிந்து கொள்ளும் திறன் (15 கேள்விகள்)

-   Given passages and selecting correct answers.
-   Newspaper content.
-   Editorials.
-   Headlines.
-   Government-related news.
-   Articles.
-   Reading and comprehension.
-   Meaning of similes and idiomatic expressions.
-   Meaning of proverbs.
-   Understanding document contents.

#### அலகு VI: எளிய மொழி பெயர்ப்பு (5 கேள்விகள்)

-   Tamil equivalents for English and other-language words.
-   Translation of commonly used English words.
-   Document titles.
-   Files.
-   Letters.
-   Petitions.
-   Understanding translation.

#### அலகு VII: இலக்கியம், தமிழ் அறிஞர்களும், தமிழ்த்தொண்டும் (15 கேள்விகள்)

The PDF states that this unit is based on school textbooks up to SSLC
standard.

**Thirukkural:** Facts relating to the twenty chapters named in the
source: - ஒழுக்கமுடைமை. - பொறையுடைமை. - ஊக்கமுடைமை. - விருந்தோம்பல். - அறன்
வலியுறுத்தல். - ஈகை. - பெரியாரைத் துணைக்கோடல். - வினை செயல்வகை. - அவையஞ்சாமை. -
கண்ணோட்டம். - அன்புடைமை. - கல்வி. - நடுவுநிலைமை. - கூடா ஒழுக்கம். - கல்லாமை. -
செங்கோன்மை. - பண்புடைமை. - நட்பாராய்தல். - புறங்கூறாமை. - அருளுடைமை.

**Other source-listed areas:** - மேற்கோள்கள். - அறநூல் தொடர்பான செய்திகள்:
நாலடியார், நான்மணிக்கடிகை, பழமொழி நானூறு, முதுமொழிக்காஞ்சி, திரிகடுகம், இன்னா
நாற்பது, சிறுபஞ்சமூலம், ஏலாதி and அவ்வையார் பாடல்கள். - Antiquity and special
features of Tamil. - Dravidian languages. - Tamil service of U. V.
Swaminatha Iyer, தெ. பொ. மீனாட்சி சுந்தரம் and சி. இலக்குவனார். - Devaneya
Pavanar, அகரமுதலி, பாவலரேறு பெருஞ்சித்திரனார், G. U. Pope and வீரமாமுனிவர். -
Tamil service and the Tamil scholars named in the PDF, including
பாவேந்தர், டி. கே. சிதம்பரநாதர், தவத்திரு குன்றக்குடி அடிகளார், கண்ணதாசன், காயிதே
மில்லத், தாரா பாரதி, வேலுநாச்சியார், பட்டுக்கோட்டை கல்யாணசுந்தரம், முடியரசன், தமிழ்
ஒளி, உருத்திரங்கண்ணனார், கி. வா. ஜகந்நாதர் and நாமக்கல் கவிஞர்.

**Source caution:** Some Tamil words and names above are transcribed
from PDF text extraction. Verify spelling and exact labels against the
original PDF before using them as canonical dropdown labels.

### 3.4 Optional Part C -- General English (differently abled candidates only)

Keep this as a separate optional syllabus track: - Unit I: Grammar
(25). - Unit II: Vocabulary (15). - Unit III: Writing Skills (10). -
Unit IV: Technical Terms (10). - Unit V: Reading Comprehension (20). -
Unit VI: Translation (5). - Unit VII: Literary Works (15).

The source includes detailed topic and prescribed literary-work lists.
These can be added to the optional English catalogue as a separate
follow-up data-entry task. This track must not be presented as the
standard Part C Tamil paper.

------------------------------------------------------------------------

## 4. Syllabus-based portion tracking

### 4.1 Syllabus hierarchy

Use a structured hierarchy:

`Exam → Part → Unit → Topic → Subtopic`

Example:

`TNPSC Group IV → Part A: General Studies → Unit IV: Indian Polity → Fundamental Rights`

The syllabus catalogue is centrally maintained. Ordinary members select
existing topics rather than creating duplicate subject/topic names.

### 4.2 Member progress states

Each member can set a status for an individual topic: - Not started. -
In progress. - Completed. - Revision needed.

Store the member's status separately from the shared syllabus catalogue.

### 4.3 Portion record fields

-   Member ID.
-   Syllabus topic ID.
-   Status.
-   Started date (optional).
-   Completed date (optional).
-   Personal notes (optional).
-   Last updated timestamp.

A member may mark a topic completed without creating a test. A test may
be linked to one or more syllabus topics. Do not automatically mark a
topic completed merely because a test was uploaded.

### 4.4 What friends can see

Members can view: - Friend's display name and profile. - Topics marked
completed or in progress. - Public study notes/materials shared by that
friend. - Tests published by that friend.

Members cannot view: - Another friend's private test scores. - Another
friend's selected answers. - Private notes or personal account
information.

### 4.5 Portion tracker screens

-   Syllabus explorer: browse exam, part, unit and topic hierarchy.
-   My portions: update personal topic status.
-   Friends' portions: view another member's shared study progress.
-   Topic detail: show syllabus description, progress status, linked
    published tests and shared resources.

Provide filters by exam part, unit, topic and progress status. Show
progress as counts or completion indicators for the individual member,
not as a comparison with friends.

------------------------------------------------------------------------

## 5. Question preparation and import workflow

### 5.1 Question generation happens outside the application

The application does not generate MCQs using AI.

A member supplies the covered portion to ChatGPT. ChatGPT prepares the
question paper and matching import file. The member reviews the
questions and uploads the JSON file to the application.

### 5.2 Two-file delivery standard

For each prepared test, provide:

1.  **DOCX:** readable question paper for reviewing, printing and
    studying.
2.  **JSON:** structured question data for importing into the
    application.

Both files must represent the same test and use the same stable question
IDs.

The DOCX should contain: - Test title. - Examination, subject, unit and
topic. - Number of questions and suggested duration. - Numbered
questions and four options. - Answer key and explanations in a separate
section, or a separate answer section that can be removed for a
student-only printout.

The JSON should contain: - Schema version. - Test metadata. - Syllabus
topic references. - Question IDs and question text. - Four options. -
Correct option. - Explanation. - Difficulty, if provided. -
Source/reference note, if provided.

### 5.3 Suggested JSON format

``` json
{
  "schemaVersion": "1.0",
  "title": "Indian Polity - Fundamental Rights",
  "exam": "TNPSC Group IV",
  "part": "A",
  "unit": "Indian Polity",
  "topics": ["fundamental-rights"],
  "questionCount": 100,
  "durationMinutes": 90,
  "language": "English",
  "questions": [
    {
      "id": "Q001",
      "question": "Example question text?",
      "options": [
        {"key": "A", "text": "Option one"},
        {"key": "B", "text": "Option two"},
        {"key": "C", "text": "Option three"},
        {"key": "D", "text": "Option four"}
      ],
      "correctAnswer": "B",
      "explanation": "Explanation for the correct answer.",
      "difficulty": "easy"
    }
  ]
}
```

This is the proposed application import contract, not a claim that an
importer already exists. Implement the importer to validate this exact
schema and version it for future changes.

### 5.4 Import validation

Before creating a test, validate: - JSON parses successfully. -
Supported schema version. - Required metadata exists. - Question count
matches the declared count. - Each question has a unique ID. - Each
question has exactly four options with unique keys A, B, C and D. -
Correct answer matches one of the option keys. - Question text and
option text are not empty. - Explanation is present if required by the
test policy. - Topic IDs exist in the syllabus catalogue. - Duplicate
questions within the same upload are flagged for review.

Do not silently discard invalid questions. Show row/question-level
errors and let the creator fix the file.

### 5.5 Test creation lifecycle

`Upload → Validate → Preview → Save as Draft → Publish`

-   Draft: creator can edit or delete.
-   Published: available in the common test library.
-   Archived: hidden from normal browsing but retained for history.
-   Corrected test: create a new version rather than silently changing
    questions already used in attempts.

A test can be linked to multiple syllabus topics. One topic can have
multiple tests.

------------------------------------------------------------------------

## 6. Application modules and requirements

### 6.1 Authentication and accounts

-   Register with display name, email and password.
-   Login and logout.
-   Hash passwords using bcrypt or Argon2.
-   Use secure session/token handling.
-   Enforce unique normalized email addresses.
-   Provide password reset through a secure process.
-   Do not expose password hashes or authentication secrets.
-   New accounts join the configured private study group through the
    chosen invitation/approval process.

### 6.2 Group and friends directory

-   Initial deployment supports one private study group.
-   Data model should allow multiple groups in a future release.
-   Show all approved group members.
-   Search members by display name.
-   Open a member profile.
-   View that member's shared syllabus progress and published tests.
-   Do not show member marks or private attempt history.

### 6.3 Dashboard

Show: - Welcome and personal account summary. - My portions in progress
and completed. - Recently published group tests. - Recently shared
portions/activity. - Quick links to update portions, browse tests and
upload a test.

Do not show leaderboard cards, top scorers, rankings or
friend-versus-friend comparisons.

### 6.4 Test library

-   List published tests visible to the group.
-   Search by title.
-   Filter by examination, part, subject, unit, topic, creator and
    publication date.
-   Filter by attempted/not attempted for the signed-in member.
-   Display title, creator, subject/topic, question count and duration.
-   Open test details before starting.

### 6.5 Examination interface

-   Display one question at a time or a clear question list.
-   Four answer options.
-   Previous and next navigation.
-   Question palette with answered, unanswered and marked-for-review
    states.
-   Mark/unmark for review.
-   Visible countdown timer.
-   Save selected answers automatically.
-   Confirm before manual submission.
-   Automatically submit when time expires.
-   Prevent unauthorized access to correct answers before submission.
-   Handle refresh, temporary disconnection and expired attempts safely.

### 6.6 Results and learning review

After submission, show the signed-in member: - Score and total marks. -
Correct, incorrect and unanswered counts. - Question-by-question
selected answer. - Correct answer. - Explanation. - Personal attempt
history.

Only the owner can see their detailed results by default. A member may
voluntarily share a result in a later release, but group-wide score
visibility is not a default requirement.

### 6.7 Personal progress and revision

-   My tests created.
-   My tests attempted.
-   Personal score history.
-   Topic-wise personal performance.
-   Bookmarked questions.
-   Revision list for questions answered incorrectly.
-   Retake eligible tests.

These are private learning tools. They must not calculate or display a
comparative rank.

### 6.8 Shared activity

A simple chronological feed may show: - Member published a test. -
Member shared a study resource. - Member updated a portion status.

Do not show marks or rank in activity messages.

### 6.9 Study materials

Allow members to share optional PDF or document resources against a
syllabus topic. Store file metadata and a secure file-storage reference.
Apply file type and size limits. Only approved group members should
access private group materials.

------------------------------------------------------------------------

## 7. User roles and permissions

### Member

Every registered friend is a member. All members have the same basic
capabilities: - View group members. - View shared portions. - Update
their own portion progress. - Share their own study materials. - Upload
and manage their own tests. - Attend published tests. - View their own
results and progress.

### Group administrator

A group administrator has additional moderation capabilities: - Approve
or reject join requests, if approval mode is enabled. - Manage
invitations. - Suspend/remove group membership. - Archive inappropriate
shared tests or materials. - Manage group settings.

The group administrator should not automatically have access to members'
private test answers or personal scores.

------------------------------------------------------------------------

## 8. Proposed database design

Use MongoDB with separate collections for catalogue data, group
membership, member progress, tests and attempts.

### `users`

-   `_id`
-   `displayName`
-   `email`
-   `passwordHash`
-   `profileImage` (optional)
-   `accountStatus`
-   `createdAt`
-   `updatedAt`

### `groups`

-   `_id`
-   `name`
-   `description`
-   `createdBy`
-   `joinMode`
-   `invitationCodeHash` (if applicable)
-   `createdAt`

### `groupMembers`

-   `_id`
-   `groupId`
-   `userId`
-   `role` (member/groupAdmin)
-   `membershipStatus`
-   `joinedAt`

Create a unique index on `(groupId, userId)`.

### `exams`

-   `_id`
-   `name`
-   `code`
-   `description`
-   `isActive`

Example: TNPSC Combined Civil Services Examination--IV (Group IV).

### `syllabusParts`

-   `_id`
-   `examId`
-   `code`
-   `name`
-   `language`
-   `questionWeightage`
-   `displayOrder`

### `syllabusUnits`

-   `_id`
-   `partId`
-   `code`
-   `name`
-   `questionWeightage`
-   `displayOrder`

### `syllabusTopics`

-   `_id`
-   `unitId`
-   `parentTopicId` (optional for nested topics)
-   `name`
-   `description`
-   `language`
-   `displayOrder`
-   `isActive`

Use stable topic IDs. Do not rely on topic display names as database
relationships.

### `portionProgress`

-   `_id`
-   `groupId`
-   `userId`
-   `topicId`
-   `status`
-   `startedAt`
-   `completedAt`
-   `privateNotes` (private to owner)
-   `updatedAt`

Create a unique index on `(groupId, userId, topicId)`.

### `materials`

-   `_id`
-   `groupId`
-   `uploadedBy`
-   `topicIds`
-   `title`
-   `description`
-   `fileStorageKey`
-   `fileType`
-   `fileSize`
-   `visibility`
-   `createdAt`

### `tests`

-   `_id`
-   `groupId`
-   `createdBy`
-   `title`
-   `description`
-   `examId`
-   `partId`
-   `unitIds`
-   `topicIds`
-   `questionCount`
-   `durationMinutes`
-   `language`
-   `status` (draft/published/archived)
-   `currentVersion`
-   `createdAt`
-   `publishedAt`
-   `updatedAt`

### `testVersions`

-   `_id`
-   `testId`
-   `versionNumber`
-   `questions`
-   `schemaVersion`
-   `createdAt`
-   `createdBy`

Store a fixed question snapshot for each published version. Do not
mutate a version used by existing attempts.

### `testAttempts`

-   `_id`
-   `testId`
-   `testVersionId`
-   `userId`
-   `startedAt`
-   `submittedAt`
-   `expiresAt`
-   `status` (inProgress/submitted/expired)
-   `score`
-   `correctCount`
-   `incorrectCount`
-   `unansweredCount`

### `attemptAnswers`

-   `_id`
-   `attemptId`
-   `questionId`
-   `selectedOption`
-   `isCorrect`
-   `answeredAt`
-   `markedForReview`

Enforce one answer record per question per attempt, or use a single
attempt document with a controlled answers structure. Never expose
correct answers through an in-progress attempt API.

### `bookmarks`

-   `_id`
-   `userId`
-   `questionId`
-   `testVersionId`
-   `createdAt`

### `activityEvents`

-   `_id`
-   `groupId`
-   `userId`
-   `eventType`
-   `resourceType`
-   `resourceId`
-   `createdAt`

Only store events suitable for group visibility. Do not publish private
score or answer events.

------------------------------------------------------------------------

## 9. Technical architecture

### Frontend

-   React.
-   Vite.
-   JavaScript.
-   CSS or CSS modules.
-   React Router.
-   A reusable component system.
-   Responsive layout for desktop and mobile.

### Backend

-   Node.js.
-   Express.js.
-   REST API.
-   JWT or secure session-based authentication.
-   bcrypt/Argon2 password hashing.
-   Server-side authorization on every protected resource.

### Database and file storage

-   MongoDB Atlas.
-   Mongoose.
-   Object storage for uploaded PDFs and documents.
-   Store file metadata and storage keys in MongoDB, not large file
    binaries in ordinary documents.

### Deployment

-   Frontend: Vercel.
-   Backend: Render or another Node.js host.
-   Database: MongoDB Atlas.
-   File storage: managed object storage.
-   Use environment variables for credentials and connection strings.

### Suggested folder structure

``` text
tnpsc-study-circle/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── features/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── friends/
│       │   ├── syllabus/
│       │   ├── portions/
│       │   ├── tests/
│       │   ├── examination/
│       │   └── progress/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       └── styles/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   └── server.js
├── docs/
│   ├── plan.md
│   ├── database.md
│   └── api.md
└── README.md
```

------------------------------------------------------------------------

## 10. API module outline

Suggested REST endpoints; exact request/response schemas should be
documented during implementation.

### Authentication

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `POST /api/auth/logout`
-   `GET /api/auth/me`

### Group and members

-   `GET /api/groups/current`
-   `GET /api/groups/current/members`
-   `GET /api/groups/current/members/:userId`
-   `POST /api/groups/join`
-   `GET /api/groups/invitations`

### Syllabus and portions

-   `GET /api/exams`
-   `GET /api/exams/:examId/syllabus`
-   `GET /api/syllabus/topics/:topicId`
-   `GET /api/portions/me`
-   `PUT /api/portions/me/:topicId`
-   `GET /api/members/:userId/portions`

### Materials

-   `POST /api/materials`
-   `GET /api/materials`
-   `GET /api/materials/:materialId`
-   `DELETE /api/materials/:materialId`

### Tests

-   `POST /api/tests/import/validate`
-   `POST /api/tests`
-   `GET /api/tests`
-   `GET /api/tests/:testId`
-   `PUT /api/tests/:testId`
-   `POST /api/tests/:testId/publish`
-   `POST /api/tests/:testId/archive`
-   `GET /api/tests/:testId/versions`

### Examination and results

-   `POST /api/tests/:testId/attempts`
-   `GET /api/attempts/:attemptId`
-   `PUT /api/attempts/:attemptId/answers/:questionId`
-   `POST /api/attempts/:attemptId/submit`
-   `GET /api/attempts/:attemptId/result`
-   `GET /api/progress/me`

All endpoints must verify group membership and resource ownership. The
server, not the browser, calculates scores and decides whether an
attempt is allowed.

------------------------------------------------------------------------

## 11. Security, privacy and correctness

-   Hash passwords; never store plaintext passwords.
-   Validate and normalize user input.
-   Check group membership on every group resource request.
-   Check ownership before editing/deleting a member's test or material.
-   Do not trust a client-supplied score or correct-answer result.
-   Keep correct answers out of examination-start and in-progress
    response payloads.
-   Evaluate answers on the server at submission.
-   Use test-version snapshots for reproducible attempts.
-   Prevent multiple conflicting submissions.
-   Enforce attempt time limits on the server.
-   Rate-limit login and sensitive endpoints.
-   Validate uploaded file type, extension and size.
-   Keep secrets in environment variables.
-   Use HTTPS in production.
-   Provide appropriate access controls for private notes, attempts and
    results.
-   Do not build friend rankings, leaderboards or comparative score
    views.

------------------------------------------------------------------------

## 12. UI pages

1.  Register.
2.  Login.
3.  Dashboard.
4.  Friends directory.
5.  Friend profile.
6.  Syllabus explorer.
7.  My portions.
8.  Friend's shared portions.
9.  Topic details and shared materials.
10. Test library.
11. Test details.
12. Upload/import test.
13. Import validation and preview.
14. My tests.
15. Test examination.
16. Test result and explanations.
17. My progress and revision bookmarks.
18. Profile and settings.
19. Group administration.

### Navigation

-   Dashboard
-   Friends
-   Syllabus / Portions
-   Test Library
-   Upload Test
-   My Tests
-   My Progress
-   Profile

Do not include leaderboard navigation.

------------------------------------------------------------------------

## 13. Development roadmap

### Phase 1 -- Foundation and authentication

-   Initialize React/Vite frontend and Express backend.
-   Connect MongoDB Atlas.
-   Create user, group and group membership models.
-   Implement registration, login, logout and protected routes.
-   Create the initial private group and invitation flow.

**Acceptance criteria:** A new friend can register, join the group, log
in and see the protected dashboard. Unauthenticated users cannot access
group data.

### Phase 2 -- Syllabus catalogue and portion tracker

-   Add the Group IV syllabus parts and units.
-   Enter topics and subtopics from the uploaded syllabus.
-   Build the syllabus explorer.
-   Build personal portion status updates.
-   Build friends directory and shared portion profiles.

**Acceptance criteria:** A member can mark a syllabus topic as in
progress/completed and another approved member can view the shared
status. Personal notes remain private.

### Phase 3 -- Test import and publishing

-   Define and document JSON schema version 1.0.
-   Build JSON file upload and validation.
-   Build question preview.
-   Save drafts.
-   Publish and archive tests.
-   Add searchable test library.

**Acceptance criteria:** A valid JSON test imports correctly. Invalid
files show useful errors. Published tests appear in the group library.
Only the creator or authorized group admin can manage the test.

### Phase 4 -- Examination engine

-   Build test instructions and start flow.
-   Implement timer and question navigation.
-   Save answers.
-   Add mark-for-review.
-   Implement server-side submission and evaluation.
-   Handle timeout and interrupted attempts.

**Acceptance criteria:** A member can complete a test, submit it and
receive a result. Correct answers are not accessible before submission.

### Phase 5 -- Learning and personal progress

-   Add answer explanations.
-   Add personal attempt history.
-   Add topic-wise personal analysis.
-   Add question bookmarks and revision list.
-   Add retake rules.

**Acceptance criteria:** A member can review their own answers and
revisit bookmarked questions. Other members cannot see private marks or
answers.

### Phase 6 -- Shared resources and polish

-   Add PDF/document sharing.
-   Add group activity feed.
-   Add notifications for new tests and shared portions.
-   Improve responsive design.
-   Test permissions and edge cases.
-   Deploy frontend, backend and database.

**Acceptance criteria:** Members can share topic-linked materials
securely and receive relevant group activity updates.

------------------------------------------------------------------------

## 14. Explicitly excluded features

These are not part of the project:

-   Leaderboard.
-   Ranking friends.
-   Highest scorer or top performer.
-   Friend-versus-friend score comparison.
-   Competitive badges or rewards.
-   AI question generation inside the web application.
-   Public registration without the configured group joining process.

Question generation is an external preparation workflow. The application
imports, validates, stores, publishes and evaluates questions.

------------------------------------------------------------------------

## 15. Important product decisions

-   Initial release supports one private group; database design should
    allow multiple groups later.
-   Group joining method must be configurable (invitation code or
    administrator approval).
-   Support Tamil and English question text; preserve the language
    selected for each test.
-   Use the uploaded Group IV syllabus as the initial canonical syllabus
    source.
-   Keep the optional General English syllabus separate for differently
    abled candidates.
-   Support variable test sizes; 100 questions is a common requested
    pack, not a mandatory limit.
-   Use DOCX for human-readable question review and JSON for application
    import.
-   Each published test has an immutable version for attempts.
-   Scores and detailed attempts are private by default.
-   No competitive or comparative features.

## 16. Open decisions before implementation

These should be confirmed before the related phase: 1. Final application
name and visual identity. 2. Invitation-code joining versus
administrator approval. 3. Whether members can publish tests immediately
or require group-admin approval. 4. Whether a test permits one attempt
or multiple attempts. 5. Whether published tests are editable only
through a new version. 6. Maximum upload file size and supported
material types. 7. Exact Tamil syllabus labels, checked against the
original PDF due to text-extraction/OCR irregularities.

------------------------------------------------------------------------

## 17. Definition of success

The first usable release is successful when:

1.  You and your friends can create individual accounts and join the
    private group.
2.  Everyone can browse the same Group IV syllabus structure.
3.  Each member can record their own covered portions.
4.  Friends can see one another's shared covered portions.
5.  A member can import a prepared JSON question paper, review it and
    publish it.
6.  Other members can find and attend that test.
7.  The application can evaluate and explain the result.
8.  Each member can review their own progress privately.
9.  No feature ranks or compares friends.

**The central purpose remains simple: know what the group has studied,
share useful tests and help every member learn the portions covered by
others.**
