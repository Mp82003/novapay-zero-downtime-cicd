const express = require('express');

const app = express();

// Security: Disable Express version disclosure
app.disable('x-powered-by');

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none'; form-action 'none'"
    );

    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );

    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, private'
    );

    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    next();
});

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
