const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { connectDB } = require('../config/db');

async function runTests() {
  console.log('--- Starting TNPSC Study Circle Verification Test Suite (In-Process) ---');
  await connectDB();

  const createdUserIds = [];
  let publishedTestId = null;

  try {
    // 1. Health check
    console.log('[Test 1] Health check...');
    const health = await request(app).get('/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'healthy');
    console.log('✔ Health check passed');

    // 2. Authentication: Register with ONLY name and password
    console.log('[Test 2] Register with ONLY Name and Password...');
    const testUsername = `Student_${Date.now()}`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: testUsername,
        password: 'TestPassword#2025'
      });
    assert.strictEqual(registerRes.status, 201);
    assert(registerRes.body.token, 'Token must be returned for new register');
    assert.strictEqual(registerRes.body.user.displayName, testUsername);
    assert.strictEqual(registerRes.body.group.role, 'member', 'New registrant must have standard member role');
    const token = registerRes.body.token;
    if (registerRes.body.user && (registerRes.body.user.id || registerRes.body.user._id)) {
      createdUserIds.push(registerRes.body.user.id || registerRes.body.user._id);
    }
    console.log('✔ Register with only name + password succeeded');

    // 2b. Login using the registered name and password
    console.log('[Test 2b] Authentication login with registered Name...');
    const loginWithNameRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUsername,
        password: 'TestPassword#2025'
      });
    assert.strictEqual(loginWithNameRes.status, 200);
    assert.strictEqual(loginWithNameRes.body.user.displayName, testUsername);
    assert.strictEqual(loginWithNameRes.body.group.role, 'member');
    console.log('✔ Login with name verified successfully');

    // 3. User profile check
    console.log('[Test 3] Profile /me check...');
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.body.user.displayName, testUsername);
    assert.strictEqual(meRes.body.group.name, 'TNPSC Group IV Study Circle');
    console.log('✔ Profile /me passed');

    // 4. Canonical Syllabus Retrieval
    console.log('[Test 4] Syllabus hierarchy retrieval...');
    const syllabusRes = await request(app)
      .get('/api/syllabus/exams/default/syllabus')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(syllabusRes.status, 200);
    assert(syllabusRes.body.parts.length >= 3, 'Must have at least Part A, B, C');
    const partCodes = syllabusRes.body.parts.map(p => p.code);
    assert(partCodes.includes('A'), 'Must have Part A');
    assert(partCodes.includes('B'), 'Must have Part B');
    assert(partCodes.includes('C'), 'Must have Part C');
    console.log(`✔ Syllabus retrieved with ${syllabusRes.body.parts.length} parts and canonical units`);

    // 5. Portion update
    console.log('[Test 5] Update portion progress...');
    const targetTopic = syllabusRes.body.parts[0].units[0].topics[0];
    const updatePortionRes = await request(app)
      .put(`/api/portions/me/${targetTopic.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'completed',
        privateNotes: 'My confidential notes on Nature of Universe.'
      });
    assert.strictEqual(updatePortionRes.status, 200);
    assert.strictEqual(updatePortionRes.body.portion.status, 'completed');
    console.log('✔ Portion update passed');

    // 6. Privacy verification: Another member views portions
    console.log('[Test 6] Privacy check: Friend viewing portions must NOT see private notes...');
    const friendUsername = `Friend_${Date.now()}`;
    const friendRegister = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: friendUsername,
        password: 'FriendPassword#2025'
      });
    const friendToken = friendRegister.body.token;
    if (friendRegister.body.user && (friendRegister.body.user.id || friendRegister.body.user._id)) {
      createdUserIds.push(friendRegister.body.user.id || friendRegister.body.user._id);
    }

    const friendViewRes = await request(app)
      .get(`/api/portions/member/${meRes.body.user.id}`)
      .set('Authorization', `Bearer ${friendToken}`);
    assert.strictEqual(friendViewRes.status, 200);
    const viewedTopic = friendViewRes.body.portions.find(p => p.topicId === targetTopic.id);
    assert(viewedTopic, 'Friend should see portion status');
    assert.strictEqual(viewedTopic.status, 'completed');
    assert.strictEqual(viewedTopic.privateNotes, undefined, 'Private notes MUST NOT be exposed!');
    console.log('✔ Privacy check passed: Private notes strictly isolated');

    // 7. Test schema validation: Valid and Invalid
    console.log('[Test 7] Test JSON validation...');
    const validTestPayload = {
      schemaVersion: '1.0',
      title: 'Science Basics Quick Test',
      exam: 'TNPSC Group IV',
      part: 'A',
      unit: 'General Science',
      topics: ['nature-of-universe'],
      questionCount: 2,
      durationMinutes: 5,
      language: 'English',
      questions: [
        {
          id: 'SCI-001',
          question: 'What is the primary source of energy for the earth?',
          options: [
            { key: 'A', text: 'The Moon' },
            { key: 'B', text: 'The Sun' },
            { key: 'C', text: 'Geothermal vents' },
            { key: 'D', text: 'Tides' }
          ],
          correctAnswer: 'B',
          explanation: 'The Sun is the star at the center of the Solar System and principal energy source.',
          difficulty: 'easy'
        },
        {
          id: 'SCI-002',
          question: 'Which of the following is a scalar quantity?',
          options: [
            { key: 'A', text: 'Velocity' },
            { key: 'B', text: 'Acceleration' },
            { key: 'C', text: 'Mass' },
            { key: 'D', text: 'Force' }
          ],
          correctAnswer: 'C',
          explanation: 'Mass has magnitude only and is therefore a scalar quantity.',
          difficulty: 'easy'
        }
      ]
    };

    const validVal = await request(app)
      .post('/api/tests/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(validTestPayload);
    assert.strictEqual(validVal.status, 200);
    assert.strictEqual(validVal.body.isValid, true);

    const invalidTestPayload = {
      schemaVersion: '2.0', // Unsupported version
      title: '',
      questionCount: 1,
      questions: []
    };
    const invalidVal = await request(app)
      .post('/api/tests/validate')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidTestPayload);
    assert.strictEqual(invalidVal.status, 200); // 200 with isValid: false
    assert.strictEqual(invalidVal.body.isValid, false);
    assert(invalidVal.body.errors.length >= 2, 'Must report multiple specific errors');
    console.log('✔ Test JSON validation passed (valid and invalid detection)');

    // 7b. Validate Real User Uploaded File: TNPSC_GS_Unit_I_General_Science_100_MCQ.json
    console.log('[Test 7b] Validating user uploaded file: TNPSC_GS_Unit_I_General_Science_100_MCQ.json...');
    const fs = require('fs');
    const path = require('path');
    const userJsonPath = path.join(__dirname, '..', '..', 'TNPSC_GS_Unit_I_General_Science_100_MCQ.json');
    if (fs.existsSync(userJsonPath)) {
      const userFileData = JSON.parse(fs.readFileSync(userJsonPath, 'utf8'));
      const userValRes = await request(app)
        .post('/api/tests/validate')
        .set('Authorization', `Bearer ${token}`)
        .send(userFileData);
      assert.strictEqual(userValRes.status, 200);
      assert.strictEqual(userValRes.body.isValid, true, 'User JSON file must pass validation with 0 errors');
      assert.strictEqual(userValRes.body.summary.questionCount, 100);
      assert(userValRes.body.summary.durationMinutes > 0);
      console.log('✔ User General Science 100-MCQ file validated successfully with 0 errors');
    }

    // 8. Create and Publish Test
    console.log('[Test 8] Create and Publish Test...');
    const createTestRes = await request(app)
      .post('/api/tests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...validTestPayload,
        status: 'published'
      });
    assert.strictEqual(createTestRes.status, 201);
    publishedTestId = createTestRes.body.test._id;
    console.log(`✔ Test published with ID: ${publishedTestId}`);

    // 9. Examination Lifecycle & Security
    console.log('[Test 9] Start exam attempt & verify security...');
    const startExamRes = await request(app)
      .post(`/api/exam/tests/${publishedTestId}/attempts`)
      .set('Authorization', `Bearer ${friendToken}`); // Manoj takes the test
    assert.strictEqual(startExamRes.status, 201);
    const attemptId = startExamRes.body.attemptId;

    // Fetch active attempt questions
    const attemptDetailsRes = await request(app)
      .get(`/api/exam/attempts/${attemptId}`)
      .set('Authorization', `Bearer ${friendToken}`);
    assert.strictEqual(attemptDetailsRes.status, 200);
    const activeQuestions = attemptDetailsRes.body.questions;
    assert.strictEqual(activeQuestions.length, 2);

    // CRITICAL SECURITY ASSERTION: correctAnswer and explanation MUST NOT be sent!
    assert.strictEqual(activeQuestions[0].correctAnswer, undefined, 'CRITICAL: correctAnswer must NOT be leaked in active exam!');
    assert.strictEqual(activeQuestions[0].explanation, undefined, 'CRITICAL: explanation must NOT be leaked in active exam!');
    console.log('✔ Active examination security verified: Zero answer leakage');

    // 10. Save answer and Submit
    console.log('[Test 10] Save answers and submit attempt...');
    await request(app)
      .put(`/api/exam/attempts/${attemptId}/answers/SCI-001`)
      .set('Authorization', `Bearer ${friendToken}`)
      .send({ selectedOption: 'B', markedForReview: false }); // Correct

    await request(app)
      .put(`/api/exam/attempts/${attemptId}/answers/SCI-002`)
      .set('Authorization', `Bearer ${friendToken}`)
      .send({ selectedOption: 'A', markedForReview: true }); // Incorrect

    const submitRes = await request(app)
      .post(`/api/exam/attempts/${attemptId}/submit`)
      .set('Authorization', `Bearer ${friendToken}`);
    assert.strictEqual(submitRes.status, 200);
    assert.strictEqual(submitRes.body.score, 1);
    assert.strictEqual(submitRes.body.correctCount, 1);
    assert.strictEqual(submitRes.body.incorrectCount, 1);
    console.log('✔ Submission & server-side evaluation passed: 1 correct, 1 incorrect');

    // 11. Result View & Explanations
    console.log('[Test 11] Private result retrieval with explanations...');
    const resultRes = await request(app)
      .get(`/api/exam/attempts/${attemptId}/result`)
      .set('Authorization', `Bearer ${friendToken}`);
    assert.strictEqual(resultRes.status, 200);
    assert.strictEqual(resultRes.body.result.score, 1);
    assert.strictEqual(resultRes.body.result.percentage, 50);
    assert(resultRes.body.result.questions[0].explanation, 'Explanation should now be available');
    assert.strictEqual(resultRes.body.result.questions[0].isCorrect, true);
    assert.strictEqual(resultRes.body.result.questions[1].isCorrect, false);

    // Verify privacy: Other user cannot view this result
    const unauthorizedResultRes = await request(app)
      .get(`/api/exam/attempts/${attemptId}/result`)
      .set('Authorization', `Bearer ${token}`); // Kavitha tries to view Manoj's result
    assert.strictEqual(unauthorizedResultRes.status, 403, 'Other members must NOT be allowed to view someone else’s result!');
    console.log('✔ Private result & explanation check passed; privacy barrier verified');

    // 12. Bookmarks & Revision list
    console.log('[Test 12] Bookmark question & check Revision list...');
    const uniqueBookmarkQId = `SCI-${Date.now()}`;
    const bookmarkRes = await request(app)
      .post('/api/progress/bookmarks')
      .set('Authorization', `Bearer ${friendToken}`)
      .send({
        questionId: uniqueBookmarkQId,
        testId: publishedTestId
      });
    assert(bookmarkRes.status === 200 || bookmarkRes.status === 201);
    assert.strictEqual(bookmarkRes.body.isBookmarked, true);

    const revisionRes = await request(app)
      .get('/api/progress/revision')
      .set('Authorization', `Bearer ${friendToken}`);
    assert.strictEqual(revisionRes.status, 200);
    assert(revisionRes.body.revisionQuestions.some(q => q.id === 'SCI-002'), 'Incorrect question SCI-002 must appear in revision list');
    console.log('✔ Bookmarks and Revision list verified');

    // 13. Activity feed
    console.log('[Test 13] Group activity feed check...');
    const activityRes = await request(app)
      .get('/api/activity')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(activityRes.status, 200);
    assert(activityRes.body.activities.length > 0);
    for (const act of activityRes.body.activities) {
      assert.strictEqual(act.score, undefined, 'Activity feed must never contain score');
      assert.strictEqual(act.marks, undefined, 'Activity feed must never contain marks');
    }
    console.log('✔ Non-competitive group activity feed verified');

    // 14. Portion Study PDF Generation & Retrieval
    console.log('[Test 14] Portion Study PDF Generation & Retrieval...');
    const pdfRes = await request(app)
      .get(`/api/tests/${publishedTestId}/portion-pdf`)
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(pdfRes.status, 200);
    assert.strictEqual(pdfRes.headers['content-type'], 'application/pdf');
    assert(pdfRes.body.length > 100 || (pdfRes.text && pdfRes.text.length > 100), 'PDF binary content must be returned');
    console.log('✔ Portion Study PDF successfully generated and served');

    // 14b. Verify browser iframe and query token PDF retrieval without header
    console.log('[Test 14b] Browser iframe retrieval without Authorization header...');
    const iframeRes = await request(app)
      .get(`/api/tests/${publishedTestId}/portion-pdf`);
    assert.strictEqual(iframeRes.status, 200, 'Iframe browser request without header must succeed for published test');
    assert.strictEqual(iframeRes.headers['content-type'], 'application/pdf');

    const queryTokenRes = await request(app)
      .get(`/api/tests/${publishedTestId}/portion-pdf?token=${token}`);
    assert.strictEqual(queryTokenRes.status, 200);
    assert.strictEqual(queryTokenRes.headers['content-type'], 'application/pdf');
    console.log('✔ Browser iframe and query token PDF streaming verified successfully');

    console.log('\n======================================================');
    console.log('🎉 ALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    throw err;
  } finally {
    // Clean up all test artifacts and temporary test users so the live DB remains pristine
    try {
      if (mongoose.connection && mongoose.connection.db) {
        const db = mongoose.connection.db;
        if (createdUserIds.length > 0) {
          const stringIds = createdUserIds.map(id => String(id));
          const allIds = [...createdUserIds, ...stringIds];
          await db.collection('users').deleteMany({ _id: { $in: allIds } });
          await db.collection('groupmembers').deleteMany({ userId: { $in: allIds } });
          await db.collection('portionprogresses').deleteMany({ userId: { $in: allIds } });
          await db.collection('bookmarks').deleteMany({ userId: { $in: allIds } });
          await db.collection('activityevents').deleteMany({ userId: { $in: allIds } });
          await db.collection('testattempts').deleteMany({ userId: { $in: allIds } });
          await db.collection('materials').deleteMany({ uploadedBy: { $in: allIds } });
        }
        if (publishedTestId) {
          await db.collection('tests').deleteOne({ _id: publishedTestId });
          await db.collection('testversions').deleteMany({ testId: publishedTestId });
          await db.collection('testattempts').deleteMany({ testId: publishedTestId });
        }
      }
    } catch (cleanErr) {
      console.warn('Test cleanup warning:', cleanErr.message);
    }
  }
}

if (require.main === module) {
  runTests().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = runTests;
