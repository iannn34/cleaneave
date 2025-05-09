const request = require("supertest");
const express = require("express");
const verifyEmail = require("../routes/userRoutes/verifyEmail");
const pool = require("../config/db");
const sendWelcomeEmail = require("../mail/welcomeEmail");
const getUser = require("../middleware/getUser");

// Mock all dependencies
jest.mock("../config/db");
jest.mock("../mail/welcomeEmail");
jest.mock("../middleware/getUser");

describe("GET /verify-email/:token", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.get("/verify/:token", verifyEmail);
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it("should verify email and redirect on success", async () => {
        // Mock dependencies
        getUser.mockResolvedValue(123); // Valid user ID
        pool.query.mockResolvedValue({
            rowCount: 1,
            rows: [{ name: "Test User", email: "test@example.com" }]
        });
        sendWelcomeEmail.mockResolvedValue(true);

        const res = await request(app)
            .get("/verify/valid-token-here")
            .expect(302); // Redirect status

        // Verify the redirect location
        expect(res.header.location).toBe("/login");

        // Verify database was updated
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE users SET verified = true WHERE user_id = $1 RETURNING name,email",
            [123]
        );

        // Verify welcome email was sent
        expect(sendWelcomeEmail).toHaveBeenCalledWith(
            "Test User",
            "test@example.com"
        );
    });

    it("should return 400 for invalid token", async () => {
        getUser.mockResolvedValue(null); // Invalid token

        const res = await request(app)
            .get("/verify/invalid-token")
            .expect(400);

        expect(res.body).toEqual({ message: "Invalid or expired token." });
        expect(pool.query).not.toHaveBeenCalled();
        expect(sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
        getUser.mockResolvedValue(123); // Valid user ID
        pool.query.mockResolvedValue({ rowCount: 0 }); // No user found

        const res = await request(app)
            .get("/verify/valid-token-but-no-user")
            .expect(404);

        expect(res.body).toEqual({ message: "User not found." });
        expect(sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
        getUser.mockResolvedValue(123);
        pool.query.mockRejectedValue(new Error("Database error"));

        const res = await request(app)
            .get("/verify/valid-token-db-error")
            .expect(500);

        expect(res.body).toEqual({ message: "Internal Server Error" });
    });

    it("should handle email sending failures gracefully", async () => {
        getUser.mockResolvedValue(123);
        pool.query.mockResolvedValue({
            rowCount: 1,
            rows: [{ name: "Test User", email: "test@example.com" }]
        });
        sendWelcomeEmail.mockRejectedValue(new Error("Email failed"));

        const res = await request(app)
            .get("/verify/valid-token-email-fail")
            .expect(500);

        expect(sendWelcomeEmail).toHaveBeenCalled();
    });
});