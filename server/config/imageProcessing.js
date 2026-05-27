const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const MIN_FILE_SIZE = 1024;

function getImagePath(imageUrl) {
    return path.join(uploadsDir, path.basename(imageUrl));
}

function isValidImageFile(imageUrl) {
    try {
        const filePath = getImagePath(imageUrl);
        if (!fs.existsSync(filePath)) return false;
        return fs.statSync(filePath).size >= MIN_FILE_SIZE;
    } catch {
        return false;
    }
}

function isHeicFile(file) {
    const name = file.originalname?.toLowerCase() || '';
    return file.mimetype === 'image/heic'
        || file.mimetype === 'image/heif'
        || name.endsWith('.heic')
        || name.endsWith('.heif');
}

async function normalizeUploadedImage(file) {
    if (!isHeicFile(file)) {
        return file.filename;
    }

    const heicPath = path.join(uploadsDir, file.filename);
    const jpegFilename = file.filename.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
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

module.exports = { normalizeUploadedImage, isHeicFile, isValidImageFile, getImagePath };
