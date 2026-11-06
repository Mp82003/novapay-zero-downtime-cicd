const request = require('supertest');
const app = require('../src/app');

describe('Readiness API Tests', () => {

    test('GET /ready should return status READY', async () => {

        const response = await request(app).get('/ready');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('READY');
        expect(response.body.service).toBe('NovaPay API');

    });

});
