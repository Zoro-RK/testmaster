const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const PortionProgress = require('../models/PortionProgress');
const SyllabusTopic = require('../models/SyllabusTopic');
const Test = require('../models/Test');
const ActivityEvent = require('../models/ActivityEvent');

async function getCurrentGroup(req, res) {
  try {
    const group = req.group;
    const memberCount = await GroupMember.countDocuments({ groupId: group._id, membershipStatus: 'approved' });

    res.json({
      id: group._id,
      name: group.name,
      description: group.description,
      joinMode: group.joinMode,
      invitationCode: req.isGroupAdmin ? group.invitationCode : undefined,
      memberCount,
      role: req.membership.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group details.' });
  }
}

async function getMembers(req, res) {
  try {
    const group = req.group;
    const { search } = req.query;

    const memberships = await GroupMember.find({ groupId: group._id, membershipStatus: 'approved' });
    const userIds = memberships.map(m => m.userId);

    const users = await User.find({ _id: { $in: userIds }, accountStatus: 'active' });

    // Compute shared portion stats for each member without exposing private scores
    const allPortions = await PortionProgress.find({ groupId: group._id });
    const allTests = await Test.find({ groupId: group._id, status: 'published' });
    const totalTopics = await SyllabusTopic.countDocuments({ isActive: true });

    let membersList = users.map(user => {
      const membership = memberships.find(m => String(m.userId) === String(user._id));
      const userPortions = allPortions.filter(p => String(p.userId) === String(user._id));
      const completedCount = userPortions.filter(p => p.status === 'completed').length;
      const inProgressCount = userPortions.filter(p => p.status === 'inProgress').length;
      const revisionCount = userPortions.filter(p => p.status === 'revisionNeeded').length;
      const testsPublishedCount = allTests.filter(t => String(t.createdBy) === String(user._id)).length;

      // Find the most recently updated topic
      const recentPortion = [...userPortions].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0];

      return {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: membership ? membership.role : 'member',
        joinedAt: membership ? membership.joinedAt : user.createdAt,
        portionSummary: {
          completedCount,
          inProgressCount,
          revisionCount,
          totalTopics,
          completionPercentage: totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0
        },
        recentActivity: recentPortion ? {
          topicId: recentPortion.topicId,
          status: recentPortion.status,
          updatedAt: recentPortion.updatedAt || recentPortion.createdAt
        } : null,
        testsPublishedCount
      };
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      membersList = membersList.filter(m => m.displayName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }

    res.json({ members: membersList });
  } catch (err) {
    console.error('getMembers error:', err);
    res.status(500).json({ error: 'Failed to retrieve group members.' });
  }
}

async function getMemberProfile(req, res) {
  try {
    const { userId } = req.params;
    const group = req.group;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const membership = await GroupMember.findOne({ groupId: group._id, userId, membershipStatus: 'approved' });
    if (!membership) {
      return res.status(404).json({ error: 'This user is not an approved member of this study group.' });
    }

    // Shared portions (status only, NO private notes or scores!)
    const portions = await PortionProgress.find({ groupId: group._id, userId });
    const topics = await SyllabusTopic.find({});

    const sharedPortions = portions.map(p => {
      const topic = topics.find(t => String(t._id) === String(p.topicId) || t.slug === p.topicId);
      return {
        topicId: p.topicId,
        topicName: topic ? topic.name : p.topicId,
        status: p.status,
        completedAt: p.completedAt,
        updatedAt: p.updatedAt
      };
    });

    // Tests published by this member
    const publishedTests = await Test.find({ groupId: group._id, createdBy: userId, status: 'published' });

    res.json({
      member: {
        id: user._id,
        displayName: user.displayName,
        role: membership.role,
        joinedAt: membership.joinedAt
      },
      sharedPortions,
      publishedTests: publishedTests.map(t => ({
        id: t._id,
        title: t.title,
        description: t.description,
        questionCount: t.questionCount,
        durationMinutes: t.durationMinutes,
        language: t.language,
        publishedAt: t.publishedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve member profile.' });
  }
}

async function joinGroup(req, res) {
  try {
    const { invitationCode } = req.body;
    if (!invitationCode || !invitationCode.trim()) {
      return res.status(400).json({ error: 'Invitation code is required.' });
    }

    const group = await Group.findOne({ invitationCode: invitationCode.trim() });
    if (!group) {
      return res.status(404).json({ error: 'Invalid invitation code.' });
    }

    const existing = await GroupMember.findOne({ groupId: group._id, userId: req.user._id });
    if (existing) {
      if (existing.membershipStatus === 'approved') {
        return res.json({ message: 'You are already an approved member of this group.', group });
      }
      return res.status(400).json({ error: 'Your membership is pending approval or suspended.' });
    }

    const membership = await GroupMember.create({
      groupId: group._id,
      userId: req.user._id,
      role: 'member',
      membershipStatus: 'approved'
    });

    await ActivityEvent.create({
      groupId: group._id,
      userId: req.user._id,
      userDisplayName: req.user.displayName,
      eventType: 'member_joined',
      resourceType: 'member',
      resourceId: req.user._id,
      resourceTitle: req.user.displayName,
      details: 'Joined the study circle'
    });

    res.status(201).json({
      message: 'Joined group successfully.',
      group: {
        id: group._id,
        name: group.name,
        role: membership.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group.' });
  }
}

async function updateGroupSettings(req, res) {
  try {
    const { name, description, joinMode, invitationCode } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (joinMode) updates.joinMode = joinMode;
    if (invitationCode) updates.invitationCode = invitationCode;

    const updated = await Group.findByIdAndUpdate(req.group._id, { $set: updates }, { new: true });
    res.json({ message: 'Group settings updated successfully.', group: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update group settings.' });
  }
}

module.exports = {
  getCurrentGroup,
  getMembers,
  getMemberProfile,
  joinGroup,
  updateGroupSettings
};

