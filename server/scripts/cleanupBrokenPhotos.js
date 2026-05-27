/**
 * OPTIONAL maintenance script — permanently deletes photo records whose image
 * files are missing or invalid test stubs. Does NOT affect Explore display;
 * use only if you want to purge bad data from the database.
 *
 * Run from server/: node scripts/cleanupBrokenPhotos.js
 */
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const { isValidImageFile, getImagePath } = require('../config/imageProcessing');

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    const photos = await Photo.find({});
    let removed = 0;
    let kept = 0;

    for (const photo of photos) {
        if (isValidImageFile(photo.imageUrl)) {
            kept += 1;
            continue;
        }

        const filePath = getImagePath(photo.imageUrl);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await photo.deleteOne();
        removed += 1;
        console.log(`Removed ${photo._id} (${photo.imageUrl})`);
    }

    await mongoose.disconnect();
    console.log(`Done. Kept ${kept}, removed ${removed}.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
