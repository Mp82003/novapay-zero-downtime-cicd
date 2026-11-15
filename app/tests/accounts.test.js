jest.mock('../src/config/db', () => ({
    query: jest.fn()
}));

const request = require('supertest');
const pool = require('../src/config/db');
const app = require('../src/app');

describe('Accounts API Tests', () => {

    beforeEach(() => {
        pool.query.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    accountHolder: 'Rahul Sharma',
                    accountType: 'Savings',
                    balance: '5000.00',
                    currency: 'INR'
                },
                {
                    id: 2,
                    accountHolder: 'Priya Singh',
                    accountType: 'Current',
                    balance: '10000.00',
                    currency: 'INR'
                }
            ]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/accounts should return all accounts', async () => {
        const response = await request(app).get('/api/accounts');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(2);
        expect(response.body.accounts).toHaveLength(2);
        expect(response.body.accounts[0].accountHolder).toBe('Rahul Sharma');
        expect(pool.query).toHaveBeenCalled();
    });

    test('GET /api/accounts should return 500 when database fails', async () => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        pool.query.mockRejectedValueOnce(
            new Error('Database connection failed')
        );

        const response = await request(app).get('/api/accounts');

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Unable to fetch accounts');

        consoleSpy.mockRestore();
    });
});
