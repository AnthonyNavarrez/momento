/**
 * One-time script: convert existing HEIC uploads to JPEG and update MongoDB records.
 * Run from server/: node scripts/convertHeicPhotos.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const convert = require('heic-convert');
const Photo = require('../models/Photo');

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function convertHeicFile(filename) {
    const heicPath = path.join(uploadsDir, filename);
    if (!fs.existsSync(heicPath)) return null;

    const jpegFilename = filename.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
    const jpegPath = path.join(uploadsDir, jpegFilename);

    const inputBuffer = fs.readFileSync(heicPath);
    const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.92,
    });

    fs.writeFileSync(jpegPath, Buffer.from(outputBuffer));
    fs.unlinkSync(heicPath);

    return jpegFilename;
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    const photos = await Photo.find({
        imageUrl: { $regex: /\.heic$/i },
    });

    console.log(`Found ${photos.length} HEIC photo records`);

    for (const photo of photos) {
        const filename = path.basename(photo.imageUrl);
        const jpegFilename = await convertHeicFile(filename);
        if (!jpegFilename) {
            console.warn(`Skipped ${photo._id}: file missing (${filename})`);
            continue;
        }
        photo.imageUrl = `/uploads/${jpegFilename}`;
        await photo.save();
        console.log(`Converted ${photo._id} -> ${jpegFilename}`);
    }

    await mongoose.disconnect();
    console.log('Done');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
