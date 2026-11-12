const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const materialController = require('../controllers/materialController');
const { auth } = require('../middleware/auth');
const { requireGroupMember } = require('../middleware/groupMember');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `mat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

router.get('/', auth, requireGroupMember, materialController.getMaterials);
router.post('/', auth, requireGroupMember, upload.single('file'), materialController.uploadMaterial);
router.delete('/:materialId', auth, requireGroupMember, materialController.deleteMaterial);

module.exports = router;

