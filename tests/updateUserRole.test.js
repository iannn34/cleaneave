const request = require('supertest');
const express = require('express');
const updateUserRole = require('../routes/userRoutes/updateUserRole');
const pool = require('../config/db');

jest.mock('../config/db');

describe('updateUserRole', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.patch('/admin/user-role-update', updateUserRole);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('successful role updates', () => {
        it('should update role to admin', async () => {
            pool.query.mockResolvedValue({ rowCount: 1 });

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'admin'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User role updated successfully');
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET role_id = $1 WHERE email = $2',
                [3, 'john@example.com']
            );
        });

        it('should update role to staff', async () => {
            pool.query.mockResolvedValue({ rowCount: 1 });

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'staff'
                });

            expect(response.status).toBe(200);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET role_id = $1 WHERE email = $2',
                [1, 'jane@example.com']
            );
        });

        it('should update role to default (2) when unknown role provided', async () => {
            pool.query.mockResolvedValue({ rowCount: 1 });

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    role: 'unknown'
                });

            expect(response.status).toBe(200);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET role_id = $1 WHERE email = $2',
                [2, 'bob@example.com']
            );
        });
    });

    // Test cases for error scenarios
    describe('error handling', () => {
        it('should return 404 when required fields are missing', async () => {
            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'John Doe',
                    // email missing
                    role: 'admin'
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
            expect(pool.query).not.toHaveBeenCalled();
        });

        it('should return 404 when user not found in database', async () => {
            pool.query.mockResolvedValue({ rowCount: 0 });

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'Nonexistent User',
                    email: 'nonexistent@example.com',
                    role: 'admin'
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        it('should return 500 when database query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'admin'
                });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error updating user role. Please try again');
            expect(response.body.error).toBeDefined();
        });
    });

    // Edge cases
    describe('edge cases', () => {
        it('should handle empty string values', async () => {
            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: '',
                    email: '',
                    role: ''
                });

            expect(response.status).toBe(404);
            expect(pool.query).not.toHaveBeenCalled();
        });

        it('should handle SQL injection attempts', async () => {
            pool.query.mockResolvedValue({ rowCount: 0 });

            const response = await request(app)
                .patch('/admin/user-role-update')
                .send({
                    name: 'Test',
                    email: "'; DROP TABLE users;--",
                    role: 'admin'
                });

            // Should pass through as parameterized query
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET role_id = $1 WHERE email = $2',
                [3, "'; DROP TABLE users;--"]
            );
        });
    });
});