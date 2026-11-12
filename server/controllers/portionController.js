const PortionProgress = require('../models/PortionProgress');
const SyllabusTopic = require('../models/SyllabusTopic');
const ActivityEvent = require('../models/ActivityEvent');

async function getMyPortions(req, res) {
  try {
    const userId = req.user._id;
    const groupId = req.group._id;

    const portions = await PortionProgress.find({ groupId, userId });

    res.json({ portions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve portions.' });
  }
}

async function updateMyPortion(req, res) {
  try {
    const userId = req.user._id;
    const groupId = req.group._id;
    const { topicId } = req.params;
    const { status, privateNotes } = req.body;

    const validStatuses = ['notStarted', 'inProgress', 'completed', 'revisionNeeded'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const topic = await SyllabusTopic.findById(topicId) || await SyllabusTopic.findOne({ slug: topicId });
    const targetTopicId = topic ? topic._id : topicId;

    const existing = await PortionProgress.findOne({ groupId, userId, topicId: targetTopicId });

    const now = new Date();
    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'inProgress' && (!existing || !existing.startedAt)) {
        updateData.startedAt = now;
      }
      if (status === 'completed') {
        updateData.completedAt = now;
      }
    }
    if (privateNotes !== undefined) {
      updateData.privateNotes = privateNotes;
    }
    updateData.updatedAt = now;

    let updated;
    if (existing) {
      updated = await PortionProgress.findByIdAndUpdate(existing._id, { $set: updateData }, { new: true });
    } else {
      updated = await PortionProgress.create({
        groupId,
        userId,
        topicId: targetTopicId,
        status: status || 'notStarted',
        privateNotes: privateNotes || '',
        startedAt: status === 'inProgress' ? now : null,
        completedAt: status === 'completed' ? now : null
      });
    }

    // Publish safe activity event if marked completed or revision
    if (status === 'completed' || status === 'inProgress') {
      const topicName = topic ? topic.name : 'a topic';
      await ActivityEvent.create({
        groupId,
        userId,
        userDisplayName: req.user.displayName,
        eventType: 'portion_updated',
        resourceType: 'topic',
        resourceId: targetTopicId,
        resourceTitle: topicName,
        details: status === 'completed' ? `marked "${topicName}" as completed` : `started studying "${topicName}"`
      });
    }

    res.json({
      message: 'Portion progress updated.',
      portion: updated
    });
  } catch (err) {
    console.error('updateMyPortion error:', err);
    res.status(500).json({ error: 'Failed to update portion status.' });
  }
}

async function getMemberPortions(req, res) {
  try {
    const { userId } = req.params;
    const groupId = req.group._id;

    // Fetch member's portion progress (status only, exclude privateNotes!)
    const portions = await PortionProgress.find({ groupId, userId });

    const safePortions = portions.map(p => ({
      topicId: p.topicId,
      status: p.status,
      startedAt: p.startedAt,
      completedAt: p.completedAt,
      updatedAt: p.updatedAt
    }));

    res.json({ portions: safePortions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch member portions.' });
  }
}

module.exports = {
  getMyPortions,
  updateMyPortion,
  getMemberPortions
};

