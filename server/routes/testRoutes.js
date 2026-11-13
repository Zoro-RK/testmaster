const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const testController = require('../controllers/testController');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `portion_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for study portion PDFs
});

router.post('/validate', auth, testController.validateTestJson);
router.post('/', auth, requireGroupMember, upload.single('portionPdf'), testController.createTest);
router.get('/', auth, requireGroupMember, testController.getTests);
router.get('/my', auth, requireGroupMember, testController.getMyTests);
router.get('/:testId/portion-pdf', optionalAuth, testController.getPortionPdf);
router.get('/:testId', auth, requireGroupMember, testController.getTestById);
router.post('/:testId/publish', auth, requireGroupMember, testController.publishTest);
router.post('/:testId/archive', auth, requireGroupMember, testController.archiveTest);

module.exports = router;

