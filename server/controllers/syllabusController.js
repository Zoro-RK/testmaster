const Exam = require('../models/Exam');
const SyllabusPart = require('../models/SyllabusPart');
const SyllabusUnit = require('../models/SyllabusUnit');
const SyllabusTopic = require('../models/SyllabusTopic');
const Test = require('../models/Test');
const Material = require('../models/Material');

async function getExams(req, res) {
  try {
    const exams = await Exam.find({ isActive: true });
    res.json({ exams });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams.' });
  }
}

async function getExamSyllabus(req, res) {
  try {
    const { examId } = req.params;
    let exam;
    if (examId === 'default' || !examId) {
      exam = await Exam.findOne({ code: 'TNPSC_GROUP_IV' });
    } else {
      exam = await Exam.findById(examId) || await Exam.findOne({ code: examId });
    }

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const parts = await SyllabusPart.find({ examId: exam._id });
    parts.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const fullSyllabus = [];

    for (const part of parts) {
      const units = await SyllabusUnit.find({ partId: part._id });
      units.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      const unitsWithTopics = [];
      for (const unit of units) {
        const topics = await SyllabusTopic.find({ unitId: unit._id, isActive: true });
        topics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

        unitsWithTopics.push({
          id: unit._id,
          code: unit.code,
          name: unit.name,
          questionWeightage: unit.questionWeightage,
          topicsCount: topics.length,
          topics: topics.map(t => ({
            id: t._id,
            slug: t.slug,
            name: t.name,
            nameTa: t.nameTa,
            description: t.description,
            language: t.language
          }))
        });
      }

      fullSyllabus.push({
        id: part._id,
        code: part.code,
        name: part.name,
        language: part.language,
        questionWeightage: part.questionWeightage,
        unitsCount: units.length,
        units: unitsWithTopics
      });
    }

    res.json({
      exam: {
        id: exam._id,
        name: exam.name,
        code: exam.code,
        description: exam.description
      },
      parts: fullSyllabus
    });
  } catch (err) {
    console.error('getExamSyllabus error:', err);
    res.status(500).json({ error: 'Failed to retrieve syllabus hierarchy.' });
  }
}

async function getTopicDetails(req, res) {
  try {
    const { topicId } = req.params;
    const topic = await SyllabusTopic.findById(topicId) || await SyllabusTopic.findOne({ slug: topicId });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    const unit = await SyllabusUnit.findById(topic.unitId);
    let part = null;
    if (unit) {
      part = await SyllabusPart.findById(unit.partId);
    }

    // Linked published tests
    const tests = await Test.find({
      groupId: req.group._id,
      status: 'published',
      topicIds: { $in: [topic._id, topic.slug] }
    });

    // Linked materials
    const materials = await Material.find({
      groupId: req.group._id,
      topicIds: { $in: [topic._id, topic.slug] }
    });

    res.json({
      topic: {
        id: topic._id,
        slug: topic.slug,
        name: topic.name,
        nameTa: topic.nameTa,
        description: topic.description,
        language: topic.language,
        unit: unit ? { id: unit._id, code: unit.code, name: unit.name } : null,
        part: part ? { id: part._id, code: part.code, name: part.name } : null
      },
      tests: tests.map(t => ({
        id: t._id,
        title: t.title,
        questionCount: t.questionCount,
        durationMinutes: t.durationMinutes,
        language: t.language
      })),
      materials: materials.map(m => ({
        id: m._id,
        title: m.title,
        description: m.description,
        fileName: m.fileName,
        fileType: m.fileType,
        fileSize: m.fileSize
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topic details.' });
  }
}

module.exports = {
  getExams,
  getExamSyllabus,
  getTopicDetails
};

