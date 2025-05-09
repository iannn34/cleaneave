const request = require("supertest");
const express = require("express");
const updateProfile = require("../routes/userRoutes/updateProfile");
const getUserId = require("../middleware/getUserId");
const profileUpdateSchema = require("../schemas/profile-update");
const pool = require("../config/db");

jest.mock("../middleware/getUserId");
jest.mock("../schemas/profile-update");
jest.mock("../config/db");

describe("PATCH /update-profile", () => {
    let app, mockClient;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            req.cookies = { token: "testtoken" };
            next();
        });

        app.patch("/update-profile", updateProfile);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        getUserId.mockReturnValue(1);
    });

    it("should update profile successfully", async () => {
        profileUpdateSchema.validateAsync.mockResolvedValue(true);
        pool.query.mockResolvedValue({});

        const updateData = {
            name: "Updated Name",
            email: "updated@example.com",
            contact: "+1234567890"
        };

        const res = await request(app)
            .patch("/update-profile")
            .send(updateData)
            .expect(200);

        expect(res.body).toEqual({ message: "Profile updated successfully!" });

        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE users SET name = $1 , email = $2 , contact = $3 WHERE user_id = $4",
            [updateData.name, updateData.email, updateData.contact, 1]
        );
    });

    it("should return 422 for invalid profile data", async () => {
        const validationError = new Error("Validation error");
        validationError.isJoi = true;
        validationError.details = [
            {
                path: ["email"],
                message: "Email must be a valid email address"
            },
            {
                path: ["contact"],
                message: "Contact must be at least 10 characters long"
            }
        ];
        profileUpdateSchema.validateAsync.mockRejectedValue(validationError);

        const invalidProfile = {
            name: "Valid Name",
            email: "invalid-email",
            contact: "123"
        };

        const res = await request(app)
            .patch("/update-profile")
            .set("Cookie", ["token=valid-token"])
            .send(invalidProfile)
            .expect(422);

        expect(res.body).toEqual({
            message: [
                {
                    fieldName: "email",
                    errorMessage: "Email must be a valid email address"
                },
                {
                    fieldName: "contact",
                    errorMessage: "Contact must be at least 10 characters long"
                }
            ]
        });
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("should return 500 if database update fails", async () => {
        profileUpdateSchema.validateAsync.mockResolvedValue(true);
        pool.query.mockRejectedValue(new Error("Database error"));

        const validProfile = {
            name: "Test Name",
            email: "test@example.com",
            contact: "+1234567890"
        };

        const res = await request(app)
            .patch("/update-profile")
            .set("Cookie", ["token=valid-token"])
            .send(validProfile)
            .expect(500);

        expect(res.body).toEqual({ message: "Internal server error" });
    });

    it("should handle missing required fields", async () => {
        const validationError = new Error("Validation error");
        validationError.isJoi = true;
        validationError.details = [
            {
                path: ["name"],
                message: "Name is required"
            },
            {
                path: ["email"],
                message: "Email is required"
            }
        ];
        profileUpdateSchema.validateAsync.mockRejectedValue(validationError);

        const incompleteProfile = {
            contact: "+1234567890"
        };

        const res = await request(app)
            .patch("/update-profile")
            .set("Cookie", ["token=valid-token"])
            .send(incompleteProfile)
            .expect(422);

        expect(res.body).toEqual({
            message: [
                {
                    fieldName: "name",
                    errorMessage: "Name is required"
                },
                {
                    fieldName: "email",
                    errorMessage: "Email is required"
                }
            ]
        });
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("should return 500 if getUserId throws an error", async () => {
        profileUpdateSchema.validateAsync.mockResolvedValue(true);
        getUserId.mockImplementation(() => {
            throw new Error("Token parsing error");
        });

        const updateData = {
            name: "Test Name",
            email: "test@example.com",
            contact: "+1234567890"
        };

        const res = await request(app)
            .patch("/update-profile")
            .send(updateData)
            .expect(500);

        expect(res.body).toEqual({ message: "Internal server error" });
        expect(pool.query).not.toHaveBeenCalled();
    });
});