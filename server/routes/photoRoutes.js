const express = require('express');
const router = express.Router();
const { uploadPhoto, getUserPhotos, getPublicPhotos, getPhotoById, updatePhoto, deletePhoto, getHeatmapData, searchPhotos } = require('../controllers/photoController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../config/upload');

router.post('/', protect, (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, uploadPhoto);
router.get('/', protect, getUserPhotos);
router.get('/heatmap', getHeatmapData);
router.get('/public', getPublicPhotos);
router.get('/search', protect, searchPhotos);
router.get('/:id', optionalAuth, getPhotoById);
router.put('/:id', protect, updatePhoto);
router.delete('/:id', protect, deletePhoto);


module.exports = router;
