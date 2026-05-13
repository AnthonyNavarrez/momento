const express = require('express');
const router = express.Router();
const { uploadPhoto, getUserPhotos, getPhotoById, deletePhoto } = require('../controllers/photoController');
const protect = require('../middleware/auth');
const upload = require('../config/upload');

router.post('/', protect, upload.single('photo'), uploadPhoto);
router.get('/', protect, getUserPhotos);
router.get('/:id', protect, getPhotoById);
router.delete('/:id', protect, deletePhoto);

module.exports = router;
