const request = require("supertest");
const express = require("express");
const order = require("../routes/orderRoutes/placeOrder");
const getUserId = require("../middleware/getUserId");
const pool = require("../config/db");
const invoiceEmail = require("../mail/invoiceEmail");

jest.mock("../middleware/getUserId", () => jest.fn());
jest.mock("../config/db", () => ({
    connect: jest.fn(() => ({
        query: jest.fn(),
        release: jest.fn()
    }))
}));
jest.mock("../mail/invoiceEmail", () => jest.fn());

describe("POST /order", () => {
    let app, mockClient;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            req.cookies = { token: "testtoken" };
            next();
        });

        app.post("/order", order);
    });

    beforeEach(() => {
        jest.clearAllMocks();

        mockClient = {
            query: jest.fn(),
            release: jest.fn()
        };

        pool.connect.mockResolvedValue(mockClient);
        getUserId.mockReturnValue(1);
        invoiceEmail.mockResolvedValue(true);
    });

    it("should place an order successfully", async () => {
        mockClient.query
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({ rows: [{ order_id: 70 }] })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        const orderData = {
            items: [
                {
                    productId: 4,
                    quantity: 2,
                    totalUnitPrice: 500,
                    service: "wash and fold"
                }
            ],
            totalPrice: 500,
            pickUpTime: "2025-05-09T10:00:00Z",
            deliveryTime: "2025-05-09T12:00:00Z",
            location: {"city": "nairobi"}
        };

        const res = await request(app)
            .post("/order")
            .send(orderData);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "Order placed successfully!",
            redirectURL: "/order-details/70"
        });

        expect(pool.connect).toHaveBeenCalled();
        expect(mockClient.query).toHaveBeenCalledWith("BEGIN");

        expect(mockClient.query).toHaveBeenCalledWith(
            "INSERT INTO orders (user_id, total_price ,pickup_time,delivery_time,location) VALUES ($1,$2,$3,$4,$5) RETURNING order_id",
            [1, 500, orderData.pickUpTime, orderData.deliveryTime, orderData.location]
        );

        expect(mockClient.query).toHaveBeenCalledWith(
            "INSERT INTO order_items (order_id, product_id, quantity, total_unit_price, service) VALUES ($1, $2, $3, $4, $5)",
            [70, 4, 2, 500, "wash and fold"]
        );

        expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
        expect(invoiceEmail).toHaveBeenCalledWith(70);
        expect(mockClient.release).toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
        const testCases = [
            { items: null },
            { items: [], totalPrice: 100, pickUpTime: "time", deliveryTime: "time" },
            { items: [], totalPrice: 100, location: "nairobi", deliveryTime: "time" },
            { items: [], pickUpTime: "time", location: "nairobi", deliveryTime: "time" },
        ];

        for (const body of testCases) {
            const res = await request(app)
                .post("/order")
                .send(body);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: "All fields are required!" });
        }
    });

    it("should handle empty items array", async () => {
        const res = await request(app)
            .post("/order")
            .send({
                items: [],
                totalPrice: 100,
                pickUpTime: "2025-05-09T10:00:00Z",
                deliveryTime: "2025-05-09T12:00:00Z",
                location: {"city": "nairobi"}
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "No items found" });
    });

    it("should handle database errors and rollback", async () => {
        mockClient.query
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ order_id: 123 }] })) // Order insert succeeds
            .mockImplementationOnce(() => Promise.reject(new Error("DB error"))); // Items insert fails

        const res = await request(app)
            .post("/order")
            .send({
                items: [
                    { productId: 1, quantity: 2, totalUnitPrice: 50, service: "delivery" }
                ],
                totalPrice: 100,
                pickUpTime: "2025-05-09T10:00:00Z",
                deliveryTime: "2025-05-09T12:00:00Z",
                location: {"city": "nairobi"}
            });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });

        expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
        expect(mockClient.release).toHaveBeenCalled();
    });

    it("should handle email sending failure after successful order placement", async () => {
        mockClient.query
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({ rows: [{ order_id: 70 }] })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        invoiceEmail.mockRejectedValue(new Error("Email failed"));

        const res = await request(app)
            .post("/order")
            .send({
                items: [
                    { productId: 1, quantity: 2, totalUnitPrice: 50, service: "Wash and fold" }
                ],
                totalPrice: 100,
                pickUpTime: "2025-05-09T10:00:00Z",
                deliveryTime: "2025-05-09T12:00:00Z",
                location: {"city": "nairobi"}
            });

        expect(invoiceEmail).toHaveBeenCalledWith(70);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({message: "Internal server error"});
    });
});