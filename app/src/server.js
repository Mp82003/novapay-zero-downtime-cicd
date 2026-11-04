const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

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

// Start server
app.listen(PORT, () => {
    console.log(`NovaPay server running on port ${PORT}`);
});
