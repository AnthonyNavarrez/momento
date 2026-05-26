const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');

const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { lat, lng, caption, tags, isPublic } = req.body;

        if (lat == null || lng == null) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const photo = await Photo.create({
            user: req.user.id,
            imageUrl: `/uploads/${req.file.filename}`,
            location: { lat: Number(lat), lng: Number(lng) },
            caption: caption || '',
            tags: tags ? JSON.parse(tags) : [],
            isPublic: isPublic === 'true' || isPublic === true,
        });

        res.status(201).json(photo);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserPhotos = async (req, res) => {
    try {
        const photos = await Photo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getPublicPhotos = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
        const skip = (page - 1) * limit;

        const query = { isPublic: true };
        const totalPhotos = await Photo.countDocuments(query);
        const totalPages = Math.ceil(totalPhotos / limit) || 1;

        const photos = await Photo.find(query)
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ photos, page, totalPages, totalPhotos });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getPhotoById = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        if (photo.isPublic) {
            return res.json(photo);
        }

        if (req.user && photo.user.toString() === req.user.id) {
            return res.json(photo);
        }

        return res.status(403).json({ message: 'Not authorized to view this photo' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        if (photo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this photo' });
        }

        const filePath = path.join(__dirname, '..', photo.imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete file:', err.message);
        });

        await photo.deleteOne();

        res.json({ message: 'Photo deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getHeatmapData = async (req, res) => {
    try {
        const { period } = req.query;
        const query = { isPublic: true };

        if (period && period !== 'all') {
            const now = new Date();
            let startDate;
            if (period === 'week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (period === 'month') {
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            } else if (period === 'year') {
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            }
            if (startDate) {
                query.createdAt = { $gte: startDate };
            }
        }

        const photos = await Photo.find(query).select('location createdAt');

        const points = photos
            .filter(p => p.location && p.location.lat != null && p.location.lng != null)
            .map(p => [p.location.lat, p.location.lng]);

        res.json({ points, count: points.length });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { uploadPhoto, getUserPhotos, getPublicPhotos, getPhotoById, deletePhoto, getHeatmapData };
