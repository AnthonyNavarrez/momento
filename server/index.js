// [GenAI Use] Detailed prompt, LLM response, reflection, and ownership notes for
// AI-assisted backend work are documented in ../GENAI_USE.md.
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

connectDB();

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err.message?.includes('files are allowed')) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

// Serve React frontend in production
const frontendDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));