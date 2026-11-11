const express = require('express');

const app = express();

// Security: Disable Express version disclosure
app.disable('x-powered-by');

// Import routes
const healthRoutes = require('./routes/health');
const versionRoutes = require('./routes/version');
const accountsRoutes = require('./routes/accounts');

// Middleware
app.use(express.json());

// Register routes
app.use('/', healthRoutes);
app.use('/', versionRoutes);
app.use('/', accountsRoutes);

// Export app
module.exports = app;
