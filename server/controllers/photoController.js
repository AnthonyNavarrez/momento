const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');

const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { lat, lng, caption, tags } = req.body;

        if (lat == null || lng == null) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const photo = await Photo.create({
            user: req.user.id,
            imageUrl: `/uploads/${req.file.filename}`,
            location: { lat: Number(lat), lng: Number(lng) },
            caption: caption || '',
            tags: tags ? JSON.parse(tags) : [],
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

const getPhotoById = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        if (!photo.isPublic && photo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this photo' });
        }

        res.json(photo);
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

module.exports = { uploadPhoto, getUserPhotos, getPhotoById, deletePhoto };
