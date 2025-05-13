const fs = require('node:fs');
const pool = require("../config/db")
const path = require("path");
const transporter = require("../config/mail");

/**
 * Sends an invoice email to the user based on the provided order ID.
 *
 * This function retrieves order and item details from the database, generates
 * an HTML email with the order summary, and sends it to the user's email address.
 *
 * @async
 * @function invoiceEmail
 * @param {number} orderID - The unique identifier of the order.
 * @returns {Promise<void>} Resolves when the email is successfully sent, or logs an error if sending fails.
 *
 * @throws {Error} Throws an error if there is an issue querying the database or sending the email.
 *
 * @example
 * // Call the function with an order ID
 * await invoiceEmail(12345);
 */

const invoiceEmail = (async (orderID) => {
   const orderInfo = await pool.query("SELECT name, email, total_price, pickup_time, delivery_time, orders.created_at as date FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE order_id = $1", [orderID]);
   const items = await pool.query("SELECT name, quantity, total_unit_price as price , service FROM order_items INNER JOIN products ON order_items.product_id = products.product_id WHERE order_id = $1", [orderID]);

   const pickUpTime = new Date(orderInfo.rows[0].pickup_time);
   const deliveryTime = new Date(orderInfo.rows[0].delivery_time);
   const orderDate = new Date(orderInfo.rows[0].date);

   let itemsHTML = "";

   items.rows.forEach((item, index) => {
       itemsHTML += `
       <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.service}</td>
       </tr>
       `
   })

    let message = `
    <html lang="en">
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f8f8;
                padding: 20px;
                margin: 0;
            }
    
            .invoice-container {
                max-width: 650px;
                background-color: #ffffff;
                margin: auto;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
    
            .logo img {
                max-width: 180px;
                height: auto;
            }
    
            h2 {
                text-align: center;
                color: #333;
                margin-bottom: 20px;
                font-size: 24px;
            }
    
            .order-summary {
                background-color: #e9f7fe;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                border: 1px solid #b3e0ff;
            }
    
            .order-summary p {
                margin: 8px;
                font-size: 16px;
                color: #444;
            }
    
            .order-summary strong {
                color: #408ee9;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
    
            table, th, td {
                border: 1px solid #ddd;
            }
    
            th {
                background-color: #408ee9;
                color: white;
                padding: 12px;
                font-size: 14px;
            }
    
            th, td {
                padding: 12px;
                text-align: left;
                font-size: 12px;
            }
    
            tbody tr:nth-child(even) {
                background-color: #f2f2f2;
            }
    
            tbody tr:hover {
                background-color: #f1f1f1;
            }
    
            .total-price {
                font-size: 20px;
                font-weight: bold;
                color: #d9534f;
                text-align: right;
                padding-top: 15px;
                margin-top: 15px;
                border-top: 2px solid #ddd;
                width: 100%;
            }
    
            .footer-note {
                margin-top: 30px;
                font-size: 15px;
                color: #666;
                text-align: center;
            }
    
            .footer-note p {
                margin: 8px 0;
            }
    
            @media (max-width: 600px) {
                .invoice-container {
                    padding: 15px;
                }
    
                h2 {
                    font-size: 20px;
                }
    
                .total-price {
                    font-size: 18px;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="logo">
                <img src="cid:uniqueImageCID123" alt="Company Logo">
            </div>
    
            <h2>🎉 Thank You for Your Order!</h2>
    
            <div class="order-summary">
                <p><strong>Total :</strong> ${orderInfo.rows[0].total_price.toFixed(2)}<br>
                We’ve successfully processed your order. 😊</p>
    
                <p><strong>Pick-up time (if selected):</strong> ${pickUpTime.toLocaleString("en-us",{day: "numeric", weekday: "long", month:"long",hour: "2-digit", minute: "2-digit"})}<br>
                Prefer to pick it up? Your items will be ready at this time! 🏃‍♂️</p>
                
                <p><strong>Estimated delivery date:</strong> ${deliveryTime.toLocaleString("en-us",{day: "numeric", weekday: "long", month:"long",hour: "2-digit", minute: "2-digit"})}<br>
                Our team is prepping your package, and it’s headed your way! 🚚</p>
   
                <p><strong>Order placed on:</strong> ${orderDate.toLocaleString("en-us",{day: "numeric", weekday: "long", month:"long",hour: "2-digit", minute: "2-digit"})}<br>
                Thanks for choosing us — we're thrilled to serve you! 💙</p>
            </div>
    
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Product</th>
                        <th>Service</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
    
            <p class="total-price">Grand Total: ${orderInfo.rows[0].total_price.toFixed(2)}</p>
    
            <div class="footer-note">
                <p>💬 Have any questions or need help with your order?</p>
                <p><a href="tel:+254731453371">📞 Call us today </a>or<a href="mailto:cleanwavemail@gmail.com"> ✉️ email us </a>with any inquiries.</p>
                <p>💖 We appreciate your trust in us. See you again soon!</p>
            </div>
        </div>
    </body>
    </html>`

    let imageAttachment = fs.readFileSync(path.join(__dirname,"..", "public", "assets", "logo.png"));

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: orderInfo.rows[0].email,
        subject: `Order Invoice - ${orderDate.toLocaleDateString("en-us",{day: "numeric", weekday: "long", month:"long"})} `,
        html: message,
        attachments: [
            {
                filename: 'logo.png',
                content: imageAttachment,
                cid: 'uniqueImageCID123'
            }
        ]
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log("Error sending email: ", error)
    }
});

module.exports = invoiceEmail;