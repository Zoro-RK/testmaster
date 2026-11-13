const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const Exam = require('../models/Exam');
const SyllabusPart = require('../models/SyllabusPart');
const SyllabusUnit = require('../models/SyllabusUnit');
const SyllabusTopic = require('../models/SyllabusTopic');
const PortionProgress = require('../models/PortionProgress');
const Test = require('../models/Test');
const TestVersion = require('../models/TestVersion');
const Material = require('../models/Material');
const ActivityEvent = require('../models/ActivityEvent');
const { examData, syllabusStructure } = require('./syllabusData');

async function seed() {
  await connectDB();
  console.log('[Seeding] Starting TNPSC Study Circle initial seed...');

  // 1. Seed Exam
  let exam = await Exam.findOne({ code: examData.code });
  if (!exam) {
    exam = await Exam.create(examData);
    console.log('[Seeding] Created Exam:', exam.name);
  }

  // 2. Seed Parts, Units, Topics
  for (const partData of syllabusStructure) {
    let part = await SyllabusPart.findOne({ examId: exam._id, code: partData.code });
    if (!part) {
      part = await SyllabusPart.create({
        examId: exam._id,
        code: partData.code,
        name: partData.name,
        language: partData.language,
        questionWeightage: partData.questionWeightage,
        displayOrder: partData.displayOrder
      });
    }

    for (const unitData of partData.units) {
      let unit = await SyllabusUnit.findOne({ partId: part._id, code: unitData.code });
      if (!unit) {
        unit = await SyllabusUnit.create({
          partId: part._id,
          code: unitData.code,
          name: unitData.name,
          questionWeightage: unitData.questionWeightage,
          displayOrder: unitData.displayOrder
        });
      }

      for (const topicData of unitData.topics) {
        let topic = await SyllabusTopic.findOne({ unitId: unit._id, slug: topicData.slug });
        if (!topic) {
          topic = await SyllabusTopic.create({
            unitId: unit._id,
            slug: topicData.slug,
            name: topicData.name,
            nameTa: topicData.nameTa || topicData.name,
            language: partData.language
          });
        }
      }
    }
  }
  console.log('[Seeding] Canonical Syllabus parts, units and topics verified.');

  // 3. Seed Default Group
  let group = await Group.findOne({ name: 'TNPSC Group IV Study Circle' });
  if (!group) {
    group = await Group.create({
      name: 'TNPSC Group IV Study Circle',
      description: 'Collaborative private circle for preparing for TNPSC Group IV examination.',
      createdBy: 'system',
      joinMode: 'invitationCode',
      invitationCode: 'TNPSC2025'
    });
    console.log('[Seeding] Created Default Group with Invitation Code: TNPSC2025');
  }

  // 4. Seed Users (all peer members, no admin role)
  const passwordHash = await bcrypt.hash('TNPSCUser#2025', 10);

  const usersToSeed = [
    { displayName: 'Senthil Kumar', email: 'senthil@studycircle.tnpsc', passwordHash, role: 'member' },
    { displayName: 'Kavitha Rajan', email: 'kavitha@studycircle.tnpsc', passwordHash, role: 'member' },
    { displayName: 'Manojkumar S.', email: 'manoj@studycircle.tnpsc', passwordHash, role: 'member' },
    { displayName: 'Deepa Sundaram', email: 'deepa@studycircle.tnpsc', passwordHash, role: 'member' }
  ];

  const seededUsers = [];
  for (const u of usersToSeed) {
    let user = await User.findOne({ email: u.email });
    if (!user && u.email === 'senthil@studycircle.tnpsc') {
      // Check legacy admin user and migrate to peer member
      user = await User.findOne({ email: 'admin@studycircle.tnpsc' });
      if (user) {
        user = await User.findByIdAndUpdate(user._id, {
          displayName: 'Senthil Kumar',
          email: 'senthil@studycircle.tnpsc',
          passwordHash
        });
      }
    }

    if (!user) {
      user = await User.create({
        displayName: u.displayName,
        email: u.email,
        passwordHash: u.passwordHash,
        accountStatus: 'active'
      });
      console.log(`[Seeding] Created user: ${user.displayName} (${user.email})`);
    } else if (user.displayName.includes('(Admin)')) {
      user = await User.findByIdAndUpdate(user._id, { displayName: 'Senthil Kumar' });
    }
    seededUsers.push(user);

    // Ensure group membership as equal peer member
    let membership = await GroupMember.findOne({ groupId: group._id, userId: user._id });
    if (!membership) {
      await GroupMember.create({
        groupId: group._id,
        userId: user._id,
        role: 'member',
        membershipStatus: 'approved'
      });
    } else if (membership.role === 'groupAdmin') {
      await GroupMember.findByIdAndUpdate(membership._id, { role: 'member' });
    }
  }

  // 5. Seed Portion Progress for friends to demonstrate the Portion Path & Friends Directory
  const allTopics = await SyllabusTopic.find({});
  if (allTopics.length > 0) {
    const friendKavitha = seededUsers[1];
    const friendManoj = seededUsers[2];
    const friendDeepa = seededUsers[3];

    // Give Kavitha some completed & in progress topics
    for (let i = 0; i < Math.min(8, allTopics.length); i++) {
      const topic = allTopics[i];
      const existing = await PortionProgress.findOne({ groupId: group._id, userId: friendKavitha._id, topicId: topic._id });
      if (!existing) {
        await PortionProgress.create({
          groupId: group._id,
          userId: friendKavitha._id,
          topicId: topic._id,
          status: i < 5 ? 'completed' : 'inProgress',
          startedAt: new Date(Date.now() - 86400000 * (10 - i)),
          completedAt: i < 5 ? new Date(Date.now() - 86400000 * (8 - i)) : null,
          privateNotes: 'Self notes - revision done on formulas.'
        });
      }
    }

    // Give Manoj some topics
    for (let i = 5; i < Math.min(12, allTopics.length); i++) {
      const topic = allTopics[i];
      const existing = await PortionProgress.findOne({ groupId: group._id, userId: friendManoj._id, topicId: topic._id });
      if (!existing) {
        await PortionProgress.create({
          groupId: group._id,
          userId: friendManoj._id,
          topicId: topic._id,
          status: i < 9 ? 'completed' : 'revisionNeeded',
          startedAt: new Date(Date.now() - 86400000 * 7),
          completedAt: i < 9 ? new Date() : null
        });
      }
    }

    // Give Deepa some topics
    for (let i = 10; i < Math.min(16, allTopics.length); i++) {
      const topic = allTopics[i];
      const existing = await PortionProgress.findOne({ groupId: group._id, userId: friendDeepa._id, topicId: topic._id });
      if (!existing) {
        await PortionProgress.create({
          groupId: group._id,
          userId: friendDeepa._id,
          topicId: topic._id,
          status: 'completed',
          startedAt: new Date(Date.now() - 86400000 * 14),
          completedAt: new Date(Date.now() - 86400000 * 2)
        });
      }
    }
  }

  // 6. Seed Sample Tests
  const polityPart = await SyllabusPart.findOne({ code: 'A' });
  const tamilPart = await SyllabusPart.findOne({ code: 'C' });
  const aptitudePart = await SyllabusPart.findOne({ code: 'B' });

  // Test 1: Indian Polity
  const polityTestTitle = 'Indian Polity - Fundamental Rights & Preamble';
  let polityTest = await Test.findOne({ title: polityTestTitle });
  if (!polityTest && polityPart) {
    const polityQuestions = [
      {
        id: 'POL-001',
        question: 'Under which Article of the Indian Constitution is the "Right to Equality before Law" guaranteed?',
        options: [
          { key: 'A', text: 'Article 14' },
          { key: 'B', text: 'Article 19' },
          { key: 'C', text: 'Article 21' },
          { key: 'D', text: 'Article 32' }
        ],
        correctAnswer: 'A',
        explanation: 'Article 14 of the Indian Constitution states that the State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
        difficulty: 'easy'
      },
      {
        id: 'POL-002',
        question: 'Which Constitutional Amendment introduced the words "Socialist, Secular and Integrity" into the Preamble of India?',
        options: [
          { key: 'A', text: '44th Constitutional Amendment Act, 1978' },
          { key: 'B', text: '42nd Constitutional Amendment Act, 1976' },
          { key: 'C', text: '86th Constitutional Amendment Act, 2002' },
          { key: 'D', text: '73rd Constitutional Amendment Act, 1992' }
        ],
        correctAnswer: 'B',
        explanation: 'The 42nd Amendment Act of 1976 added three new words—Socialist, Secular and Integrity—to the Preamble of the Indian Constitution.',
        difficulty: 'medium'
      },
      {
        id: 'POL-003',
        question: 'Which of the following Fundamental Rights cannot be suspended even during a National Emergency under Article 352?',
        options: [
          { key: 'A', text: 'Article 19 and Article 20' },
          { key: 'B', text: 'Article 20 and Article 21' },
          { key: 'C', text: 'Article 14 and Article 21' },
          { key: 'D', text: 'Article 21 and Article 22' }
        ],
        correctAnswer: 'B',
        explanation: 'By the 44th Amendment Act, Articles 20 (protection in respect of conviction for offences) and 21 (protection of life and personal liberty) cannot be suspended during an emergency.',
        difficulty: 'medium'
      },
      {
        id: 'POL-004',
        question: 'Who described the Right to Constitutional Remedies (Article 32) as the "Heart and Soul of the Constitution"?',
        options: [
          { key: 'A', text: 'Jawaharlal Nehru' },
          { key: 'B', text: 'Dr. B. R. Ambedkar' },
          { key: 'C', text: 'Dr. Rajendra Prasad' },
          { key: 'D', text: 'Sardar Vallabhbhai Patel' }
        ],
        correctAnswer: 'B',
        explanation: 'Dr. B. R. Ambedkar referred to Article 32 (Right to Constitutional Remedies) as the very heart and soul of the Constitution.',
        difficulty: 'easy'
      },
      {
        id: 'POL-005',
        question: 'Which writ is issued by courts to secure the release of a person unlawfully detained?',
        options: [
          { key: 'A', text: 'Mandamus' },
          { key: 'B', text: 'Quo-Warranto' },
          { key: 'C', text: 'Habeas Corpus' },
          { key: 'D', text: 'Certiorari' }
        ],
        correctAnswer: 'C',
        explanation: 'Habeas Corpus literally means "to have the body of" and is issued to produce a detained person before the court to examine the legality of detention.',
        difficulty: 'easy'
      }
    ];

    polityTest = await Test.create({
      groupId: group._id,
      createdBy: seededUsers[1]._id, // Kavitha
      title: polityTestTitle,
      description: 'Comprehensive practice test covering fundamental rights, writs, and preamble provisions.',
      examId: exam._id,
      partId: polityPart._id,
      questionCount: polityQuestions.length,
      durationMinutes: 10,
      language: 'English',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000 * 3),
      portionPdfName: 'TNPSC_Polity_Portion_Study_Guide.pdf',
      portionPdfUrl: ''
    });

    await Test.findByIdAndUpdate(polityTest._id, {
      portionPdfUrl: `/api/tests/${polityTest._id}/portion-pdf`
    });

    await TestVersion.create({
      testId: polityTest._id,
      versionNumber: 1,
      questions: polityQuestions,
      schemaVersion: '1.0',
      createdBy: seededUsers[1]._id
    });

    await ActivityEvent.create({
      groupId: group._id,
      userId: seededUsers[1]._id,
      userDisplayName: seededUsers[1].displayName,
      eventType: 'test_published',
      resourceType: 'test',
      resourceId: polityTest._id,
      resourceTitle: polityTestTitle,
      details: 'Published a 5-question test on Indian Polity'
    });
    console.log('[Seeding] Created Sample Test: Indian Polity');
  }

  // Test 2: Tamil Eligibility Test
  const tamilTestTitle = 'பொதுத் தமிழ் - அலகு I இலக்கணம் மற்றும் திருக்குறள்';
  let tamilTest = await Test.findOne({ title: tamilTestTitle });
  if (!tamilTest && tamilPart) {
    const tamilQuestions = [
      {
        id: 'TAM-001',
        question: '“கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக” - இக்குறட்பாவில் பயின்று வந்துள்ள மோனை யாது?',
        options: [
          { key: 'A', text: 'பொழிப்பு மோனை' },
          { key: 'B', text: 'முற்று மோனை' },
          { key: 'C', text: 'கூழை மோனை' },
          { key: 'D', text: 'இணை மோனை' }
        ],
        correctAnswer: 'B',
        explanation: 'செய்யுளின் நான்கு சீர்களிலும் முதல் எழுத்து ஒன்றி வருவது "முற்று மோனை" எனப்படும் (கற்க, கசடறக், கற்பவை, கற்றபின்).',
        difficulty: 'medium'
      },
      {
        id: 'TAM-002',
        question: '‘செங்கதிர்’ - பிரித்து எழுதுக:',
        options: [
          { key: 'A', text: 'செம்மை + கதிர்' },
          { key: 'B', text: 'செம் + கதிர்' },
          { key: 'C', text: 'செந் + கதிர்' },
          { key: 'D', text: 'செழுமை + கதிர்' }
        ],
        correctAnswer: 'A',
        explanation: 'ஈறுபோதல் விதியின்படி செம்மை + கதிர் என்பது "செங்கதிர்" எனப் புணரும்.',
        difficulty: 'easy'
      },
      {
        id: 'TAM-003',
        question: '‘ஒழுக்கமுடைமை’ அதிகாரம் திருக்குறளில் எந்தப் பாலில் அமைந்துள்ளது?',
        options: [
          { key: 'A', text: 'அறத்துப்பால்' },
          { key: 'B', text: 'பொருட்பால்' },
          { key: 'C', text: 'காமத்துப்பால்' },
          { key: 'D', text: 'இன்பத்துப்பால்' }
        ],
        correctAnswer: 'A',
        explanation: 'ஒழுக்கமுடைமை அதிகாரம் அறத்துப்பாலில் இல்லறவியலில் 14-வது அதிகாரமாக அமைந்துள்ளது.',
        difficulty: 'easy'
      },
      {
        id: 'TAM-004',
        question: 'பொருந்தாச் சொல்லைக் கண்டறிக:',
        options: [
          { key: 'A', text: 'அன்புடைமை' },
          { key: 'B', text: 'விருந்தோம்பல்' },
          { key: 'C', text: 'பெரியாரைத் துணைக் கோடல்' },
          { key: 'D', text: 'மரூஉ' }
        ],
        correctAnswer: 'D',
        explanation: 'முதல் மூன்றும் திருக்குறளின் அதிகாரப் பெயர்கள்; மரூஉ என்பது இலக்கணச் சொல் வகை ஆகும்.',
        difficulty: 'medium'
      },
      {
        id: 'TAM-005',
        question: '“தமிழ்த்தாத்தா” என்று போற்றப்படும் தமிழ் அறிஞர் யார்?',
        options: [
          { key: 'A', text: 'பாரதியார்' },
          { key: 'B', text: 'உ.வே. சாமிநாதையர்' },
          { key: 'C', text: 'மறைமலையடிகள்' },
          { key: 'D', text: 'தேவநேயப் பாவாணர்' }
        ],
        correctAnswer: 'B',
        explanation: 'பழங்காலத் தமிழ் ஓலைச்சுவடிகளைத் தேடித் தொகுத்துப் பதிப்பித்த உ.வே. சாமிநாதையர் "தமிழ்த்தாத்தா" என அழைக்கப்படுகிறார்.',
        difficulty: 'easy'
      }
    ];

    tamilTest = await Test.create({
      groupId: group._id,
      createdBy: seededUsers[2]._id, // Manoj
      title: tamilTestTitle,
      description: 'TNPSC குரூப் 4 பொதுத் தமிழ் இலக்கணம், புணர்ச்சி மற்றும் திருக்குறள் வினாத்தாள்.',
      examId: exam._id,
      partId: tamilPart._id,
      questionCount: tamilQuestions.length,
      durationMinutes: 10,
      language: 'Tamil',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000 * 1),
      portionPdfName: 'TNPSC_Tamil_Grammar_Thirukkural_Study_Guide.pdf',
      portionPdfUrl: ''
    });

    await Test.findByIdAndUpdate(tamilTest._id, {
      portionPdfUrl: `/api/tests/${tamilTest._id}/portion-pdf`
    });

    await TestVersion.create({
      testId: tamilTest._id,
      versionNumber: 1,
      questions: tamilQuestions,
      schemaVersion: '1.0',
      createdBy: seededUsers[2]._id
    });

    await ActivityEvent.create({
      groupId: group._id,
      userId: seededUsers[2]._id,
      userDisplayName: seededUsers[2].displayName,
      eventType: 'test_published',
      resourceType: 'test',
      resourceId: tamilTest._id,
      resourceTitle: tamilTestTitle,
      details: 'Published a Tamil test on Grammar and Thirukkural'
    });
    console.log('[Seeding] Created Sample Test: பொதுத் தமிழ்');
  }

  // 7. Seed Sample Material
  let material = await Material.findOne({ title: 'Indian Constitution Quick Revision Notes' });
  if (!material) {
    await Material.create({
      groupId: group._id,
      uploadedBy: seededUsers[1]._id,
      title: 'Indian Constitution Quick Revision Notes',
      description: 'Handmade summary of Fundamental Rights articles 12-35 with landmark cases.',
      fileStorageKey: 'sample_notes_polity.pdf',
      fileName: 'polity_quick_revision.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 350,
      visibility: 'group'
    });
    console.log('[Seeding] Created Sample Study Material');
  }

  console.log('[Seeding] Finished successfully!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error('[Seeding Error]:', err);
    process.exit(1);
  });
}

module.exports = seed;

