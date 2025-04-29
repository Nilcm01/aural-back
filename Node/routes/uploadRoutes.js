const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const multer = require('multer');
const path = require('path');

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define the upload route
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;