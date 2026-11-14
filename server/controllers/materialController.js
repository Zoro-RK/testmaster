const path = require('path');
const fs = require('fs');
const Material = require('../models/Material');
const ActivityEvent = require('../models/ActivityEvent');
const User = require('../models/User');
const Test = require('../models/Test');

async function getMaterials(req, res) {
  try {
    const groupId = req.group._id;
    const { topicId } = req.query;

    // 1. Fetch standalone materials (filter out legacy demo placeholder)
    let materials = await Material.find({});
    materials = materials.filter(m => 
      m.title !== 'Indian Constitution Quick Revision Notes' && 
      m.uploadedBy !== 'demo'
    );
    if (groupId) {
      materials = materials.filter(m => !m.groupId || String(m.groupId) === String(groupId));
    }
    if (topicId) {
      materials = materials.filter(m => m.topicIds && m.topicIds.includes(topicId));
    }

    // 2. Fetch published tests to expose their portion study materials
    let tests = await Test.find({ status: 'published' });
    if (groupId) {
      tests = tests.filter(t => !t.groupId || String(t.groupId) === String(groupId));
    }
    if (topicId) {
      tests = tests.filter(t => t.topicIds && t.topicIds.includes(topicId));
    }

    // 3. Resolve user profiles
    const userIds = [
      ...new Set([
        ...materials.map(m => m.uploadedBy),
        ...tests.map(t => t.createdBy)
      ])
    ];
    const users = await User.find({ _id: { $in: userIds } });

    // Format standalone materials
    const formattedStandalone = materials.map(m => {
      const uploader = users.find(u => String(u._id) === String(m.uploadedBy));
      return {
        id: m._id,
        title: m.title,
        description: m.description,
        topicIds: m.topicIds || [],
        fileName: m.fileName || m.title,
        fileType: m.fileType,
        fileSize: m.fileSize,
        fileUrl: `/uploads/${m.fileStorageKey}`,
        testId: m.testId || null,
        isPortionMaterial: false,
        uploadedBy: {
          id: m.uploadedBy,
          displayName: (!uploader || String(m.uploadedBy) === 'demo') ? 'Demo' : uploader.displayName
        },
        createdAt: m.createdAt,
        isOwner: String(m.uploadedBy) === String(req.user._id)
      };
    });

    // Format portion materials derived from tests
    const formattedTestPortions = tests.map(t => {
      const uploader = users.find(u => String(u._id) === String(t.createdBy));
      const pdfUrl = t.portionPdfUrl 
        ? (t.portionPdfUrl.startsWith('http') || t.portionPdfUrl.startsWith('/') ? t.portionPdfUrl : `/uploads/${t.portionPdfUrl}`)
        : `/api/tests/${t._id}/portion-pdf`;
      const pdfName = t.portionPdfName || `${(t.title || 'Portion_Study_Guide').replace(/[^a-zA-Z0-9_-]/g, '_')}_Portion_Guide.pdf`;

      return {
        id: `portion_${t._id}`,
        testId: t._id,
        testTitle: t.title,
        title: `${t.title} — Portion Study Guide`,
        description: t.description || `Study notes and syllabus guide covering ${t.questionCount || 0} questions in ${t.partName || t.partId || 'Group IV'}. Review before attending test.`,
        topicIds: t.topicIds || [],
        fileName: pdfName,
        fileType: 'application/pdf',
        fileSize: 1024 * 250,
        fileUrl: pdfUrl,
        questionCount: t.questionCount || 0,
        durationMinutes: t.durationMinutes || 0,
        partName: t.partName || t.partId || 'General Studies',
        isPortionMaterial: true,
        uploadedBy: {
          id: t.createdBy,
          displayName: (!uploader || String(t.createdBy) === 'demo') ? 'Demo' : uploader.displayName
        },
        createdAt: t.publishedAt || t.createdAt,
        isOwner: String(t.createdBy) === String(req.user._id)
      };
    });

    const combined = [...formattedTestPortions, ...formattedStandalone];
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ materials: combined });
  } catch (err) {
    console.error('getMaterials error:', err);
    res.status(500).json({ error: 'Failed to fetch study materials.' });
  }
}

async function uploadMaterial(req, res) {
  try {
    const { title, description, topicIds } = req.body;
    const file = req.file;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Material title is required.' });
    }

    let storageKey = 'placeholder.pdf';
    let fileName = 'Study_Notes.pdf';
    let fileType = 'application/pdf';
    let fileSize = 1024 * 100;

    if (file) {
      storageKey = file.filename;
      fileName = file.originalname;
      fileType = file.mimetype;
      fileSize = file.size;
    } else if (req.body.textNotes) {
      // If direct study notes text was provided, write to a text file
      storageKey = `notes_${Date.now()}.txt`;
      fileName = `${title.replace(/\s+/g, '_')}.txt`;
      fileType = 'text/plain';
      const notesPath = path.join(__dirname, '..', 'uploads', storageKey);
      fs.writeFileSync(notesPath, req.body.textNotes, 'utf8');
      fileSize = Buffer.byteLength(req.body.textNotes);
    }

    let parsedTopicIds = [];
    if (Array.isArray(topicIds)) {
      parsedTopicIds = topicIds;
    } else if (typeof topicIds === 'string') {
      try {
        parsedTopicIds = JSON.parse(topicIds);
      } catch (e) {
        parsedTopicIds = [topicIds];
      }
    }

    const material = await Material.create({
      groupId: req.group._id,
      uploadedBy: req.user._id,
      topicIds: parsedTopicIds,
      title: title.trim(),
      description: description || '',
      fileStorageKey: storageKey,
      fileName,
      fileType,
      fileSize,
      visibility: 'group'
    });

    await ActivityEvent.create({
      groupId: req.group._id,
      userId: req.user._id,
      userDisplayName: req.user.displayName,
      eventType: 'material_shared',
      resourceType: 'material',
      resourceId: material._id,
      resourceTitle: material.title,
      details: `Shared a new study resource: "${material.title}"`
    });

    res.status(201).json({
      message: 'Study material shared successfully.',
      material
    });
  } catch (err) {
    console.error('uploadMaterial error:', err);
    res.status(500).json({ error: 'Failed to share study material.' });
  }
}

async function deleteMaterial(req, res) {
  try {
    const { materialId } = req.params;
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found.' });
    }

    if (String(material.uploadedBy) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Only the uploader can delete this material.' });
    }

    await Material.findByIdAndDelete(material._id);
    res.json({ message: 'Study material deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material.' });
  }
}

module.exports = {
  getMaterials,
  uploadMaterial,
  deleteMaterial
};

