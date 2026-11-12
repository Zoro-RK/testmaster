const ActivityEvent = require('../models/ActivityEvent');

async function getRecentActivity(req, res) {
  try {
    const groupId = req.group._id;
    const limit = parseInt(req.query.limit) || 20;

    const events = await ActivityEvent.find({ groupId });
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sliced = events.slice(0, limit);

    // Strictly ensure no marks or scores are present in activity items
    const cleanEvents = sliced.map(e => ({
      id: e._id,
      userId: e.userId,
      userDisplayName: e.userDisplayName,
      eventType: e.eventType,
      resourceType: e.resourceType,
      resourceId: e.resourceId,
      resourceTitle: e.resourceTitle,
      details: e.details,
      createdAt: e.createdAt
    }));

    res.json({ activities: cleanEvents });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve group activity.' });
  }
}

module.exports = {
  getRecentActivity
};

