const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');
const apiRoutes = require('./routes/api');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Routes
app.use('/api', apiRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
