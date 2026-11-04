const express = require('express');

const router = express.Router();

// Application version information
router.get('/version', (req, res) => {
    res.status(200).json({
        application: 'NovaPay',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports = router;
