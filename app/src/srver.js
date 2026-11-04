const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

// Import health routes
const healthRoutes = require('./routes/health');

// Middleware
app.use(express.json());

// Register health routes
app.use('/', healthRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`NovaPay server running on port ${PORT}`);
});
