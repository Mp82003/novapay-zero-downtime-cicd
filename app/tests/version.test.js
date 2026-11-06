const request = require('supertest');
const app = require('../src/app');

describe('Version API Tests', () => {

    test('GET /version should return application version', async () => {

        const response = await request(app).get('/version');

        expect(response.statusCode).toBe(200);
        expect(response.body.application).toBe('NovaPay');
        expect(response.body.version).toBe('1.0.0');
        expect(response.body.environment).toBe('test');

    });

});

