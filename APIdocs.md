# API Documentation
## User Routes
### `POST /register`
Register a new user

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "contact": "string",
  "password": "string"
}
```

**Responses:**

| Code | Description                  | Response Body                                                        |
|------|------------------------------|----------------------------------------------------------------------|
| 201  | User successfully registered | `{ "message": "User registered successfully", "userId": "integer" }` |
| 400  | User already exists          | `{ "message": "User already exists" }`                               |
| 422  | Validation error             | `{ "message": { /* fields with errors */ } }`                        |
| 500  | Internal server error        | `{ "message": "Internal server error" }`                             |

---

### `POST /login`
Authenticate a user

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

| Code | Description         | Response Body                                                                             |
|------|---------------------|-------------------------------------------------------------------------------------------|
| 200  | Login successful    | `{ "token": "string", "user": { "id": "integer", "name": "string", "email": "string" } }` |
| 401  | Invalid credentials | `{ "error": "Invalid email or password" }`                                                |

---

### `GET /verify-email/:token`
Verify user's email

**Responses:**

| Code | Description    | Response Body                                  |
|------|----------------|------------------------------------------------|
| 200  | Email verified | `{ "message": "Email verified successfully" }` |
| 400  | Invalid token  | `{ "error": "Invalid or expired token" }`      |

---

### `POST /resend-verification`
Resend verification email

**Request Body:**
```json
{
  "email": "string"
}
```

**Responses:**

| Code | Description     | Response Body                              |
|------|-----------------|--------------------------------------------|
| 200  | Email sent      | `{ "message": "Verification email sent" }` |
| 404  | Email not found | `{ "error": "Email not found" }`           |

---

### `POST /password-reset`
Request password reset

**Request Body:**
```json
{
  "email": "string"
}
```

**Responses:**

| Code | Description      | Response Body                                |
|------|------------------|----------------------------------------------|
| 200  | Reset email sent | `{ "message": "Password reset email sent" }` |
| 404  | Email not found  | `{ "error": "Email not found" }`             |

---

### `PATCH /reset-password/:token`
Reset user password

**Request Body:**
```json
{
  "password": "string"
}
```

**Responses:**

| Code | Description    | Response Body                                  |
|------|----------------|------------------------------------------------|
| 200  | Password reset | `{ "message": "Password reset successfully" }` |
| 400  | Invalid token  | `{ "error": "Invalid or expired token" }`      |

---

### `GET /api/user-info`
Get authenticated user's profile

**Responses:**

| Code | Description         | Response Body                                                                   |
|------|---------------------|---------------------------------------------------------------------------------|
| 200  | User info retrieved | `{ "id": "integer", "name": "string", "email": "string", "contact": "string" }` |
| 401  | Unauthorized        | `{ "error": "Unauthorized" }`                                                   |

---

### `PATCH /update-profile`
Update user profile

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "contact": "string"
}
```

**Responses:**

| Code | Description      | Response Body                                   |
|------|------------------|-------------------------------------------------|
| 200  | Profile updated  | `{ "message": "Profile updated successfully" }` |
| 400  | Validation error | `{ "error": "string" }`                         |

---

### `GET /logout`
Logout user

**Responses:**

| Code | Description | Response Body                              |
|------|-------------|--------------------------------------------|
| 200  | Logged out  | `{ "message": "Logged out successfully" }` |

## Order Routes

### `POST /order`
Place a new order

**Request Body:**
```json
{
  "items": [
    {
      "productId": "integer",
      "quantity": "integer",
      "totalUnitPrice": "float",
      "service": "string"
    }
  ],
  "totalPrice": "float",
  "pickUpTime": "string (ISO 8601)",
  "deliveryTime": "string (ISO 8601)",
  "location": "object"
}
```

**Responses:**

| Code | Description      | Response Body                                                      |
|------|------------------|--------------------------------------------------------------------|
| 201  | Order placed     | `{ "message": "Order placed successfully", "orderId": "integer" }` |
| 400  | Validation error | `{ "error": "string" }`                                            |

---

### `GET /api/order-details/:id`
Get order details

**Responses:**

| Code | Description     | Response Body                                                                         |
|------|-----------------|---------------------------------------------------------------------------------------|
| 200  | Order retrieved | `{ "orderId": "integer", "items": [...], "totalPrice": "float", "status": "string" }` |
| 404  | Order not found | `{ "error": "Order not found" }`                                                      |

---

### `GET /api/get-orders`
List orders

**Query Params:**
- `page`: integer
- `name`: string
- `status`: string
- `from`: date
- `to`: date

**Responses:**

| Code | Description      | Response Body                                                                       |
|------|------------------|-------------------------------------------------------------------------------------|
| 200  | Orders retrieved | `{ "orders": [...], "pagination": { "page": "integer", "totalPages": "integer" } }` |

---

### `GET /api/products`
List products

**Responses:**

| Code | Description        | Response Body                                                                      |
|------|--------------------|------------------------------------------------------------------------------------|
| 200  | Products retrieved | `{ "products": [{ "productId": "integer", "name": "string", "price": "float" }] }` |

## Staff Routes

### `GET /staff-dashboard`
Get staff dashboard

**Responses:**

| Code | Description    | Response Body                                                                            |
|------|----------------|------------------------------------------------------------------------------------------|
| 200  | Dashboard data | `{ "orders": [...], "stats": { "totalOrders": "integer", "pendingOrders": "integer" } }` |
| 401  | Unauthorized   | `{ "error": "Unauthorized" }`                                                            |

---

### `PATCH /update-order-status/:id`
Update order status

**Request Body:**
```json
{
  "status": "string",
  "data": {
    "orderDetails": "object"
  }
}
```

**Responses:**

| Code | Description     | Response Body                                        |
|------|-----------------|------------------------------------------------------|
| 200  | Status updated  | `{ "message": "Order status updated successfully" }` |
| 400  | Invalid status  | `{ "error": "Invalid status" }`                      |
| 404  | Order not found | `{ "error": "Order not found" }`                     |

## Admin Routes

### `GET /admin/dashboard`
Get admin dashboard

**Responses:**

| Code | Description    | Response Body                                                        |
|------|----------------|----------------------------------------------------------------------|
| 200  | Dashboard data | `{ "stats": { "totalRevenue": "float", "totalOrders": "integer" } }` |
| 401  | Unauthorized   | `{ "error": "Unauthorized" }`                                        |

---

### `GET /admin/revenue-report`
Get revenue report

**Responses:**

| Code | Description | Response Body                                              |
|------|-------------|------------------------------------------------------------|
| 200  | Report data | `{ "report": [{ "date": "string", "revenue": "float" }] }` |

---

### `GET /admin/service-breakdown`
Get service breakdown

**Responses:**

| Code | Description    | Response Body                                                |
|------|----------------|--------------------------------------------------------------|
| 200  | Breakdown data | `{ "services": [{ "name": "string", "count": "integer" }] }` |

---

### `GET /admin/status-count`
Get status counts

**Responses:**

| Code | Description   | Response Body                                                  |
|------|---------------|----------------------------------------------------------------|
| 200  | Status counts | `{ "statuses": [{ "status": "string", "count": "integer" }] }` |

---

### `GET /admin/customer-acquisition`
Get customer data

**Responses:**

| Code | Description      | Response Body                                                   |
|------|------------------|-----------------------------------------------------------------|
| 200  | Acquisition data | `{ "acquisition": [{ "date": "string", "count": "integer" }] }` |

---

### `GET /api/report-data`
Get report data

**Responses:**
| Code | Description | Response Body |
|------|-------------|---------------|
| 200  | Report data | `{ "data": [...] }` |

## Static Routes

| Route                    | Method | Description         |
|--------------------------|--------|---------------------|
| `/`                      | GET    | Home page           |
| `/register`              | GET    | Registration page   |
| `/login`                 | GET    | Login page          |
| `/password-reset`        | GET    | Password reset page |
| `/reset-password/:token` | GET    | Password reset form |
| `/order`                 | GET    | Order page          |
| `/order-details/:id`     | GET    | Order details page  |
| `/about`                 | GET    | About page          |
| `/contact`               | GET    | Contact page        |

**All static routes return HTML content with 200 status code**
**All static routes return 500 status in case of errors**