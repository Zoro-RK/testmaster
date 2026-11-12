const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const ActivityEvent = require('../models/ActivityEvent');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { displayName, email, password, invitationCode } = req.body;

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ error: 'Display name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      displayName: displayName.trim(),
      email: normalizedEmail,
      passwordHash,
      accountStatus: 'active'
    });

    // Handle group joining
    let group = null;
    let membership = null;

    if (invitationCode) {
      group = await Group.findOne({ invitationCode: invitationCode.trim() });
    }
    // If no group code or not matched, find default group
    if (!group) {
      const allGroups = await Group.find({});
      group = allGroups[0];
    }

    if (group) {
      membership = await GroupMember.create({
        groupId: group._id,
        userId: user._id,
        role: 'member',
        membershipStatus: 'approved'
      });

      await ActivityEvent.create({
        groupId: group._id,
        userId: user._id,
        userDisplayName: user.displayName,
        eventType: 'member_joined',
        resourceType: 'member',
        resourceId: user._id,
        resourceTitle: user.displayName,
        details: 'Joined the study circle'
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage
      },
      group: group ? {
        id: group._id,
        name: group.name,
        role: membership ? membership.role : 'member'
      } : null
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed due to server error.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Fetch group membership
    const membership = await GroupMember.findOne({ userId: user._id, membershipStatus: 'approved' });
    let group = null;
    if (membership) {
      group = await Group.findById(membership.groupId);
    }

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage
      },
      group: group ? {
        id: group._id,
        name: group.name,
        role: membership.role
      } : null
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed due to server error.' });
  }
}

async function getMe(req, res) {
  try {
    const user = req.user;
    const membership = await GroupMember.findOne({ userId: user._id, membershipStatus: 'approved' });
    let group = null;
    if (membership) {
      group = await Group.findById(membership.groupId);
    }

    res.json({
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage
      },
      group: group ? {
        id: group._id,
        name: group.name,
        role: membership ? membership.role : 'member',
        invitationCode: group.invitationCode
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

async function updateProfile(req, res) {
  try {
    const { displayName, profileImage } = req.body;
    const updates = {};
    if (displayName && displayName.trim()) updates.displayName = displayName.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated._id,
        displayName: updated.displayName,
        email: updated.email,
        profileImage: updated.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};

