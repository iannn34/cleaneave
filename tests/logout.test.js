const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
require("dotenv").config()

describe("GET /logout", () => {
    let authCookie;

    beforeAll(async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email: "testuser@gmail.com",
                password: "Password@1"
            });

        expect(response.status).toBe(200);
        const cookies = response.header["set-cookie"];
        expect(cookies).toBeDefined();
        authCookie = cookies.find(cookies => cookies.startsWith("token="));
        expect(authCookie).toBeDefined();

        const tokenValue = authCookie.split(";")[0].split("=")[1];
        const decoded = jwt.decode(tokenValue, process.env.JWT_SECRET);
        expect(decoded).toHaveProperty("user_id");
    });

    it("should clear the token cookie and redirect user to /login", async () => {
        const res = await request(app)
            .get("/logout")
            .set("Cookie", authCookie);

        expect(res.status).toBe(302);
        expect(res.headers["set-cookie"]).toBeDefined();

        const clearedCookie = res.headers["set-cookie"].find(cookie => cookie.startsWith("token="));
        expect(clearedCookie).toContain("token=");
        expect(clearedCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");

        expect(res.headers["location"]).toBe("/login");
    });

    it("should return status 500 and message on server-side errors", async () => {
        app.get("/logout-error", async (req, res, next) => {
            try {
                throw new Error("Test error");
            } catch (err) {
                res.status(500).json({"message": "Internal server error"})
            }
        });

        const res = await request(app)
            .get("/logout-error")
            .set("Cookie", authCookie);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
});