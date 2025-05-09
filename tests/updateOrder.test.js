const request = require("supertest");
const express = require("express");
const updateOrder = require("../routes/orderRoutes/updateOrder");
const getUser = require("../middleware/getUser");
const orderReceived = require("../mail/orderReceivedEmail");
const orderCompleted = require("../mail/orderCompletedEmail");
const pool = require("../config/db");

jest.mock("../middleware/getUser");
jest.mock("../mail/orderReceivedEmail");
jest.mock("../mail/orderCompletedEmail");
jest.mock("../config/db");

describe("PATCH /orders/:id", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            req.cookies = { token: "testtoken" };
            next();
        });

        app.patch("/orders/:id", updateOrder);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        getUser.mockResolvedValue(123);
        orderReceived.mockResolvedValue(true);
        orderCompleted.mockResolvedValue(true);
        pool.query.mockResolvedValue({ rowCount: 1 });
    });

    describe("when updating status to processing", () => {
        it("should update order with received timestamp and send receipt email", async () => {
            const orderData = {
                customer: "John Doe",
                items: [{ name: "Shirt", quantity: 2 }]
            };

            const res = await request(app)
                .patch("/orders/456")
                .send({
                    status: "processing",
                    data: orderData
                })
                .expect(200);

            expect(res.body).toEqual({ message: "Order updated successfully" });

            expect(pool.query).toHaveBeenCalledWith(
                "UPDATE orders SET status = $1, received_on = CURRENT_TIMESTAMP, handled_by = $2 WHERE order_id = $3",
                ["processing", 123, "456"]
            );

            expect(orderReceived).toHaveBeenCalledWith(orderData);
            expect(orderCompleted).not.toHaveBeenCalled();
        });
    });

    describe("when updating to other statuses", () => {
        it("should update order with completed timestamp and send completion email", async () => {
            const orderDetails = {
                customer: "Jane Smith",
                items: [{ name: "Pants", quantity: 1 }]
            };

            const res = await request(app)
                .patch("/orders/789")
                .send({
                    status: "completed",
                    data: { orderDetails }
                })
                .expect(200);

            expect(res.body).toEqual({ message: "Order updated successfully" });

            // Verify database update
            expect(pool.query).toHaveBeenCalledWith(
                "UPDATE orders SET status = $1, completed_on = CURRENT_TIMESTAMP, handled_by = $2 WHERE order_id = $3",
                ["completed", 123, "789"]
            );

            // Verify email was sent
            expect(orderCompleted).toHaveBeenCalledWith(orderDetails);
            expect(orderReceived).not.toHaveBeenCalled();
        });
    });

    describe("error handling", () => {
        it("should return 500 if database update fails", async () => {
            pool.query.mockRejectedValue(new Error("Database error"));

            const res = await request(app)
                .patch("/orders/123")
                .send({
                    status: "processing",
                    data: { customer: "Test" }
                })
                .expect(500);

            expect(res.body.message).toBe("Internal server error");
            expect(res.body.error).toBe("Database error");
        });

        it("should return 500 if getUser fails", async () => {
            getUser.mockRejectedValue(new Error("Invalid token"));

            const res = await request(app)
                .patch("/orders/123")
                .set("Cookie", ["token=invalid-token"])
                .send({
                    status: "processing",
                    data: { customer: "Test" }
                })
                .expect(500);

            expect(res.body.message).toBe("Internal server error");
        });

        it("should return 500 if email sending fails", async () => {
            orderReceived.mockRejectedValue(new Error("Email failed"));

            const res = await request(app)
                .patch("/orders/123")
                .send({
                    status: "processing",
                    data: { customer: "Test" }
                })
                .expect(500);

            expect(res.body.message).toBe("Internal server error");
        });
    });

    describe("edge cases", () => {
        it("should handle empty data object for non-processing status", async () => {
            const res = await request(app)
                .patch("/orders/123")
                .send({
                    status: "shipped"
                })
                .expect(400);

            expect(pool.query).not.toHaveBeenCalled();
            expect(orderCompleted).not.toHaveBeenCalled();
            expect(orderReceived).not.toHaveBeenCalled();
        });

        it("should handle missing status field", async () => {
            const res = await request(app)
                .patch("/orders/123")
                .send({
                    data: { customer: "Test" }
                })
                .expect(400);

            expect(res.body.message).toBe("All fields are required");
        });
    });
});