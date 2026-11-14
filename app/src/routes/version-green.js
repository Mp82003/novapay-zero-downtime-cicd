
const express = require('express');

const router = express.Router();

// NovaPay Green deployment - Version 2
router.get('/version', (req, res) => {
    res.status(200).json({
        application: 'NovaPay',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'production',
        deployment: 'green'
    });
});

module.exports = router;

