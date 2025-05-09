const request = require('supertest');
const express = require('express');
const getUserInfo = require('../routes/userRoutes/getUserInfo');

jest.mock('../middleware/getUserId', () => jest.fn());
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

const getUserId = require('../middleware/getUserId');
const pool = require('../config/db');

describe('GET /api/user-info', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            req.cookies = { token: 'testtoken' };
            next();
        });

        app.get('/api/user-info', getUserInfo);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user and order data successfully', async () => {
        getUserId.mockReturnValue(1);

        pool.query
            .mockResolvedValueOnce({
                rows: [{ user_id: 1, name: 'John Doe', email: 'john@example.com' }]
            }) // user query
            .mockResolvedValueOnce({
                rows: [
                    { order_id: 101, total: 100 },
                    { order_id: 102, total: 200 }
                ]
            }); // order query

        const res = await request(app).get('/api/user-info');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('userData');
        expect(res.body.userData.name).toBe('John Doe');
        expect(res.body).toHaveProperty('orderData');
        expect(Array.isArray(res.body.orderData)).toBe(true);
        expect(res.body.orderData.length).toBe(2);

        expect(getUserId).toHaveBeenCalledWith('testtoken');
        expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should handle internal server errors', async () => {
        getUserId.mockImplementation(() => {
            throw new Error('Token decode failed');
        });

        const res = await request(app).get('/api/user-info');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });

    afterAll(() => {
        jest.clearAllMocks();
        if (pool.end) {
            pool.end();
        }
    });
});
