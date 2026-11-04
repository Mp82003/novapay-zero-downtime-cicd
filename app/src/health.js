const express = require('express');

const router = express.Router();

// Liveness check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'NovaPay API'
    });
});

// Readiness check
router.get('/ready', (req, res) => {
    res.status(200).json({
        status: 'READY',
        service: 'NovaPay API'
    });
});

module.exports = router;
