const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tnpsc_study_circle_secret_2025';

async function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    } else if (req.query && req.query.token) {
      token = String(req.query.token).trim();
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found or token invalid.' });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ error: 'Your account is suspended. Contact the administrator.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication session.' });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    } else if (req.query && req.query.token) {
      token = String(req.query.token).trim();
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && user.accountStatus !== 'suspended') {
        req.user = user;
        req.token = token;
      }
    }
  } catch (err) {
    // Optional auth silently continues if token is absent or invalid
  }
  next();
}

module.exports = {
  auth,
  optionalAuth,
  JWT_SECRET
};

