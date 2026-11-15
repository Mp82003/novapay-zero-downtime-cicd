
const express = require('express');

const app = express();

// Hide Express technology information
app.disable('x-powered-by');

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; " +
        "base-uri 'none'; " +
        "object-src 'none'; " +
        "script-src 'none'; " +
        "style-src 'none'; " +
        "img-src 'none'; " +
        "connect-src 'none'; " +
        "font-src 'none'; " +
        "frame-src 'none'; " +
        "media-src 'none'; " +
        "worker-src 'none'; " +
        "manifest-src 'none'; " +
        "frame-ancestors 'none'; " +
        "form-action 'none'"
    );

    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader(
        'Cross-Origin-Resource-Policy',
        'same-origin'
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

// Identify Green version in every response
app.use((req, res, next) => {
    res.setHeader('X-App-Version', 'green-v3');
    next();
});

// Parse JSON request bodies
app.use(express.json());

// Import routes
const healthRoutes = require('./routes/health');
const versionRoutes = require('./routes/version-green');
const accountsRoutes = require('./routes/accounts');

// Register routes
app.use('/', healthRoutes);
app.use('/', versionRoutes);
app.use('/', accountsRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        version: 'green-v3'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Green API Error:', err.message);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        version: 'green-v3'
    });
});

// Export application
module.exports = app;

