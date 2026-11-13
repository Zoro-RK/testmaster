const path = require('path');
const fs = require('fs');
const Material = require('../models/Material');
const ActivityEvent = require('../models/ActivityEvent');
const User = require('../models/User');

async function getMaterials(req, res) {
  try {
    const groupId = req.group._id;
    const { topicId } = req.query;

    const query = { groupId };
    if (topicId) {
      query.topicIds = { $in: [topicId] };
    }

    const materials = await Material.find(query);
    materials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const userIds = [...new Set(materials.map(m => m.uploadedBy))];
    const users = await User.find({ _id: { $in: userIds } });

    const formatted = materials.map(m => {
      const uploader = users.find(u => String(u._id) === String(m.uploadedBy));
      return {
        id: m._id,
        title: m.title,
        description: m.description,
        topicIds: m.topicIds,
        fileName: m.fileName || m.title,
        fileType: m.fileType,
        fileSize: m.fileSize,
        fileUrl: `/uploads/${m.fileStorageKey}`,
        uploadedBy: {
          id: m.uploadedBy,
          displayName: uploader ? uploader.displayName : 'Group Member'
        },
        createdAt: m.createdAt,
        isOwner: String(m.uploadedBy) === String(req.user._id)
      };
    });

    res.json({ materials: formatted });
  } catch (err) {
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

