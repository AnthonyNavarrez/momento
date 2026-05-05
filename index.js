require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" })
});

// Server startup
app.listen(PORT, () => {
    console.log("Listening on port 5001");
});