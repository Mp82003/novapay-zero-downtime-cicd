const express = require('express');

const router = express.Router();

// Simulated bank account data
const accounts = [
    {
        id: 1,
        accountHolder: 'Rahul Sharma',
        accountType: 'Savings',
        balance: 25000,
        currency: 'INR'
    },
    {
        id: 2,
        accountHolder: 'Priya Singh',
        accountType: 'Current',
        balance: 50000,
        currency: 'INR'
    }
];

// Get all accounts
router.get('/api/accounts', (req, res) => {
    res.status(200).json({
        success: true,
        count: accounts.length,
        accounts: accounts
    });
});

module.exports = router;


