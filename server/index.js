require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));