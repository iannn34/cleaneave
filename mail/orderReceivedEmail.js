const transporter = require("../config/mail");
const fs = require("node:fs");
const path = require("path");

/**
 * Sends an email notification to the customer when their laundry order is received.
 *
 * @async
 * @function orderReceived
 * @param {Object} data - The data required to generate the email.
 * @param {Object} data.orderDetails - Details of the order.
 * @param {string} data.orderDetails.name - The name of the customer.
 * @param {number} data.orderDetails.order_id - The unique ID of the order.
 * @param {string} data.orderDetails.date - The date the order was posted.
 * @param {string} data.orderDetails.email - The email address of the customer.
 * @param {Array<Object>} data.orderItems - List of items in the order.
 * @param {string} data.orderItems[].name - The name of the item.
 * @param {number} data.orderItems[].quantity - The quantity of the item.
 * @param {string} data.orderItems[].service - The service associated with the item.
 * @returns {Promise<void>} Resolves when the email is sent successfully.
 * @throws {Error} Throws an error if the email fails to send.
 */

const orderReceived = async (data) =>  {
    let itemsHTML = "";

    data.orderItems.forEach((item,index) =>{
        itemsHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.service}</td>
        </tr>`
    })

    let message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Laundry Order Received</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f6f8;
              margin: 0;
              padding: 0;
            }
            .container {
              background-color: #ffffff;
              width: 100%;
              max-width: 600px;
              margin: 40px auto;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #007bff;
              padding: 20px;
              color: white;
              text-align: center;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
    
            .logo img {
                max-width: 180px;
                height: auto;
            }
            .content {
              padding: 30px;
            }
            .content h2 {
              color: #333;
            }
            .content p {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
            }
            .order-info {
              background-color: #f1f1f1;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
              font-size: 15px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .items-table th, .items-table td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
              font-size: 15px;
            }
            .items-table th {
              background-color: #007bff;
              color: white;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 13px;
              color: #888;
              background-color: #f4f6f8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
                <img src="cid:uniqueImageCID123" alt="Company Logo">
            </div>
            <div class="content">
              <h2>Dear ${data.orderDetails.name},</h2>
              <p>We’ve received your laundry order at our facility. Our team will begin processing your items with care.</p>
        
              <div class="order-info">
                <strong>Order ID:</strong> ORD00${data.orderDetails.order_id}<br>
                <strong>Date Posted:</strong> ${data.orderDetails.date}<br>
                <strong>Status:</strong> Received at facility
              </div>
        
              <h3><strong>Items Received:</strong></h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
        
              <p>If you have any questions or concerns, feel free to contact our support team at <a href="mailto:cleanwavemail@gmail.com">cleanwavemail@gmail.com</a>.</p>
              <p>Thank you for choosing Clean Wave!</p>
            </div>
            <div class="footer">
              © 2025 Clean Wave – All rights reserved.
            </div>
          </div>
        </body>
        </html>
    `;

    let imageAttachment = fs.readFileSync(path.join(__dirname,"..", "public", "assets", "logo.png"));

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: data.orderDetails.email,
        subject: "Order received",
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
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = orderReceived;