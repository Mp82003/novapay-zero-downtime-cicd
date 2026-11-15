
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all accounts from PostgreSQL
router.get('/api/accounts', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                account_holder AS "accountHolder",
                account_type AS "accountType",
                balance,
                currency
             FROM accounts
             ORDER BY id`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            accounts: result.rows
        });

    } catch (error) {
        console.error('Database query failed:', error.message);

        res.status(500).json({
            success: false,
            message: 'Unable to fetch accounts'
        });
    }
});

module.exports = router;

