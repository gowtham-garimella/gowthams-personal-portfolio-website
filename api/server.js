require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8000;

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve local uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Serve frontend if not in development
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
});

// Export for Vercel serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
