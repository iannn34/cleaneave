const request = require('supertest');
const app = require("../server");
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const sendVerificationEmail = require('../mail/verificationEmail');

// Mock external dependencies
jest.mock('../config/db', () => ({
    query: jest.fn()
}));
jest.mock('bcrypt', () => ({
    hash: jest.fn()
}));
jest.mock('../mail/verificationEmail', () => jest.fn());


describe('POST /register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        pool.query
            .mockResolvedValueOnce({ rows: [] }) // no existing user
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] }); // insert result

        bcrypt.hash.mockResolvedValue('hashedpassword');
        sendVerificationEmail.mockResolvedValue();

        const res = await request(app)
            .post('/register')
            .send({
                name: 'test user2',
                email: 'testuser2@gmail.com',
                contact: '1234567890',
                password: 'StrongPass123!'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User registered successfully');

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(bcrypt.hash).toHaveBeenCalledWith('StrongPass123!', 10);
        expect(sendVerificationEmail).toHaveBeenCalledWith( 1,'testuser2@gmail.com', 'test user2');
    });

    it('should return 400 if email is already registered', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ email: 'john@example.com' }] });

        const res = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                email: 'johndoe@gmail.com',
                contact: '1234567890',
                password: 'StrongPass123!'
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email already registered!');
    });

    it('should return 422 if validation fails', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                name: '',
                email: 'invalid-email',
                contact: '',
                password: ''
            });

        expect(res.status).toBe(422);
        expect(res.body).toHaveProperty('message');
        expect(Array.isArray(res.body.message)).toBe(true);
        expect(res.body.message[0]).toHaveProperty('fieldName');
        expect(res.body.message[0]).toHaveProperty('errorMessage');
    });

    it('should return 500 if an internal server error occurs', async () => {
        pool.query.mockRejectedValue(new Error('Database failure'));

        const res = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                contact: '1234567890',
                password: 'StrongPass123!'
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
});
