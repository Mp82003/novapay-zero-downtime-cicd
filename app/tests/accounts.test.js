const request = require('supertest');
const app = require('../src/app');

describe('Accounts API Tests', () => {

    test('GET /api/accounts should return all accounts', async () => {

        const response = await request(app).get('/api/accounts');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(2);
        expect(response.body.accounts).toHaveLength(2);

    });

});
