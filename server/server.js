const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const jiraRoutes = require('./routes/jira');
const settingsRoutes = require('./routes/settings');
const insightsRoutes = require('./routes/insights');


const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/jira', jiraRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/insights', insightsRoutes);
// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
