const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("POST /login", () => {
    it("should authenticate user with valid credentials", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "iankim10834@gmail.com",
                password: "Password@1"
            });

        expect(response.statusCode).toBe(200);

        const cookies = response.header["set-cookie"];
        expect(cookies).toBeDefined();

        const authCookie = cookies.find(cookie => cookie.startsWith("token="));
        expect(authCookie).toBeDefined();

        const token = authCookie.split(";")[0].split("=")[1];
        expect(token).toBeTruthy();

        const secret = process.env.JWT_SECRET;
        const decoded = jwt.decode(token, secret);

        expect(decoded).toHaveProperty("user_id");
    });

    it("should reject login with invalid credentials", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "johndoe@gmail.com",
                password: "WrongPassword"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it("should return 422 for missing fields", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "john@example.com"
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toHaveProperty("message");
    });
});
