const express = require('express');
const router = express.Router();
const { uploadPhoto, getUserPhotos, getPublicPhotos, getPhotoById, deletePhoto, getHeatmapData } = require('../controllers/photoController');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

router.post('/', protect, upload.single('photo'), uploadPhoto);
router.get('/', protect, getUserPhotos);
router.get('/heatmap', getHeatmapData);
router.get('/public', getPublicPhotos);
router.get('/:id', protect, getPhotoById);
router.delete('/:id', protect, deletePhoto);

module.exports = router;
