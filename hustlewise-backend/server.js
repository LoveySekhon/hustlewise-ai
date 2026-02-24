const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

// Import routes
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recommendations', recommendationRoutes);

// Progress tracking routes
const progressRoutes = require('./routes/progressRoutes');
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
    res.send('HustleWise API Running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});