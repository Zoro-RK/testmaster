const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB, isConnectedToMongo } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const portionRoutes = require('./routes/portionRoutes');
const testRoutes = require('./routes/testRoutes');
const examRoutes = require('./routes/examRoutes');
const progressRoutes = require('./routes/progressRoutes');
const materialRoutes = require('./routes/materialRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/portions', portionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/activity', activityRoutes);

// Health check and keep-alive endpoints for UptimeRobot / uptime monitors
const handleHealthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'TNPSC Study Circle API is online and healthy',
    database: isConnectedToMongo() ? 'connected' : 'local-json',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'TNPSC Study Circle API'
  });
};

// Explicitly support GET & HEAD for UptimeRobot and ping monitors
app.get(['/api/health', '/health', '/ping', '/api'], handleHealthCheck);
app.head(['/api/health', '/health', '/ping', '/api'], (req, res) => res.status(200).end());

// Serve frontend in production or if built; otherwise respond 200 OK for root ping
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (require('fs').existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // When running as standalone API on Render, respond 200 to root / for UptimeRobot
  app.get('/', handleHealthCheck);
  app.head('/', (req, res) => res.status(200).end());
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] TNPSC Study Circle server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
