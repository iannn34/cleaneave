const request = require("supertest");
const express = require("express");
const resetPassword = require("../routes/userRoutes/resetPassword");
const bcrypt = require("bcrypt");
const getUser = require("../middleware/getUser");
const passwordSchema = require("../schemas/password-reset");
const pool = require("../config/db");

// Mock all dependencies
jest.mock("bcrypt");
jest.mock("../middleware/getUser");
jest.mock("../schemas/password-reset");
jest.mock("../config/db");

describe("POST /reset-password/:token", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post("/reset-password/:token", resetPassword);
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it("should reset password and redirect to login on success", async () => {
        // Mock dependencies
        getUser.mockResolvedValue(123); // Valid user ID
        passwordSchema.validateAsync.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue("hashed_password");
        pool.query.mockResolvedValue({ rows: [{ name: "Test User", email: "test@example.com" }] });

        const res = await request(app)
            .post("/reset-password/valid-token")
            .send({ password: "ValidPassword123!" })
            .expect(200);

        expect(res.body).toEqual({ redirectURL: "/login" });
        expect(bcrypt.hash).toHaveBeenCalledWith("ValidPassword123!", 10);
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING name, email",
            ["hashed_password", 123]
        );
    });

    it("should redirect to password reset page for invalid token", async () => {
        getUser.mockResolvedValue(null); // Invalid token

        const res = await request(app)
            .post("/reset-password/invalid-token")
            .send({ password: "ValidPassword123!" })
            .expect(303);

        expect(res.body).toEqual({ redirectURL: "/password-reset" });
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("should return 422 for invalid password format", async () => {
        getUser.mockResolvedValue(123);
        const validationError = new Error("Validation error");
        validationError.isJoi = true;
        validationError.details = [{ message: "Password must be at least 8 characters long" }];
        passwordSchema.validateAsync.mockRejectedValue(validationError);

        const res = await request(app)
            .post("/reset-password/valid-token")
            .send({ password: "short" })
            .expect(422);

        expect(res.body).toEqual({ errorMessage: "Password must be at least 8 characters long" });
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("should return 422 when password is missing", async () => {
        getUser.mockResolvedValue(123);
        const validationError = new Error("Validation error");
        validationError.isJoi = true;
        validationError.details = [{ message: "password is required" }];
        passwordSchema.validateAsync.mockRejectedValue(validationError);

        const res = await request(app)
            .post("/reset-password/valid-token")
            .send({}) // No password provided
            .expect(422);

        expect(res.body).toEqual({ errorMessage: "password is required" });
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
        getUser.mockResolvedValue(123);
        passwordSchema.validateAsync.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue("hashed_password");
        pool.query.mockRejectedValue(new Error("Database error"));

        const res = await request(app)
            .post("/reset-password/valid-token-db-error")
            .send({ password: "ValidPassword123!" })
            .expect(500);

        expect(res.body).toEqual({ message: "Internal server error" });
    });

    it("should handle bcrypt hashing errors", async () => {
        getUser.mockResolvedValue(123);
        passwordSchema.validateAsync.mockResolvedValue(true);
        bcrypt.hash.mockRejectedValue(new Error("Hashing failed"));

        const res = await request(app)
            .post("/reset-password/valid-token-hash-error")
            .send({ password: "ValidPassword123!" })
            .expect(500);

        expect(res.body).toEqual({ message: "Internal server error" });
        expect(pool.query).not.toHaveBeenCalled();
    });
});