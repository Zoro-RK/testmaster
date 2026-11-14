const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const ActivityEvent = require('../models/ActivityEvent');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { displayName, name, email, password, invitationCode } = req.body;
    const finalName = (displayName || name || '').trim();

    if (!finalName) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Auto-generate or normalize email
    const safeHandle = finalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'candidate';
    const normalizedEmail = (email && email.trim())
      ? email.trim().toLowerCase()
      : `${safeHandle}_${Math.random().toString(36).substring(2, 7)}@studycircle.tnpsc`;

    // Check if an existing user has this exact displayName (case-insensitive) or email
    const allExisting = await User.find({});
    const duplicate = allExisting.find(u => 
      (u.displayName && u.displayName.trim().toLowerCase() === finalName.toLowerCase()) ||
      (u.email && u.email.trim().toLowerCase() === normalizedEmail)
    );
    if (duplicate) {
      return res.status(400).json({ error: 'An account with this name already exists. Please sign in or use a different name.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      displayName: finalName,
      email: normalizedEmail,
      passwordHash,
      accountStatus: 'active'
    });

    // Handle group joining - automatically connect every new user as a study circle friend
    let group = await Group.findOne({ name: 'TNPSC Group IV Study Circle' }) || (await Group.findOne({})) || (await Group.find({}))[0];
    if (!group) {
      group = await Group.create({
        name: 'TNPSC Group IV Study Circle',
        description: 'Collaborative private circle for preparing for TNPSC Group IV examination.',
        createdBy: 'system',
        joinMode: 'open'
      });
    }

    let membership = await GroupMember.findOne({ groupId: group._id, userId: user._id });
    if (!membership) {
      membership = await GroupMember.create({
        groupId: group._id,
        userId: user._id,
        role: 'member',
        membershipStatus: 'approved'
      });
    }

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
        role: 'member'
      } : null
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed due to server error.' });
  }
}

async function login(req, res) {
  try {
    const { email, name, displayName, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || displayName || name || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Name and password are required.' });
    }

    const normalizedIdentifier = loginIdentifier.toLowerCase();

    // Find by email or displayName (case-insensitive)
    let user = await User.findOne({ email: normalizedIdentifier });
    if (!user) {
      const allUsers = await User.find({});
      user = allUsers.find(u => 
        (u.displayName && u.displayName.trim().toLowerCase() === normalizedIdentifier) ||
        (u.email && u.email.trim().toLowerCase() === normalizedIdentifier)
      );
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid name/email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name/email or password.' });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Fetch group membership - automatically attach user to study circle if not linked
    let membership = await GroupMember.findOne({ userId: user._id, membershipStatus: 'approved' });
    let group = null;
    if (membership) {
      group = await Group.findById(membership.groupId);
    }

    if (!membership || !group) {
      const defaultGroup = await Group.findOne({ name: 'TNPSC Group IV Study Circle' }) || (await Group.findOne({})) || (await Group.find({}))[0];
      if (defaultGroup) {
        group = defaultGroup;
        if (!membership) {
          membership = await GroupMember.create({
            groupId: defaultGroup._id,
            userId: user._id,
            role: 'member',
            membershipStatus: 'approved'
          });
        } else {
          await GroupMember.findByIdAndUpdate(membership._id, { groupId: defaultGroup._id });
        }
      }
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
        role: 'member'
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
    let membership = await GroupMember.findOne({ userId: user._id, membershipStatus: 'approved' });
    let group = null;
    if (membership) {
      group = await Group.findById(membership.groupId);
    }

    if (!membership || !group) {
      const defaultGroup = await Group.findOne({ name: 'TNPSC Group IV Study Circle' }) || (await Group.findOne({})) || (await Group.find({}))[0];
      if (defaultGroup) {
        group = defaultGroup;
        if (!membership) {
          membership = await GroupMember.create({
            groupId: defaultGroup._id,
            userId: user._id,
            role: 'member',
            membershipStatus: 'approved'
          });
        } else {
          await GroupMember.findByIdAndUpdate(membership._id, { groupId: defaultGroup._id });
        }
      }
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
        role: 'member'
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

