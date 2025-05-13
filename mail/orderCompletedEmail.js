const fs = require("fs")
const path = require("path");
const transporter = require("../config/mail");

/**
 * Sends an email notification to the user when their laundry order is completed.
 *
 * @async
 * @function orderCompleted
 * @param {Object} data - The data required to send the email.
 * @param {string} data.name - The name of the customer.
 * @param {string} data.email - The email address of the customer.
 * @param {number} data.order_id - The unique identifier for the order.
 * @param {string} data.date - The date the order was posted.
 * @returns {Promise<void>} - Resolves when the email is sent successfully.
 * @throws {Error} - Throws an error if the email fails to send.
 */

const orderCompleted = async (data) =>  {
    let message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Laundry Order Ready</title>
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
        <div class="header">
          <h1>Your Laundry Order is Ready!</h1>
        </div>
        <div class="content">
          <h2>Dear ${data.name},</h2>
          <p>Your laundry order has been processed and is now ready for pickup or scheduled delivery to the original location.</p>
    
          <div class="order-info">
            <strong>Order ID:</strong> ORD00${data.order_id}<br>
            <strong>Date Posted:</strong> ${data.date}<br>
            <strong>Status:</strong> Ready for Pickup/Delivery
          </div>
    
          <p>To make any changes or if you have questions about your order, contact us at <a href="mailto:cleanwavemail@gmail.com">cleanwavemail@gmail.com</a>.</p>
          <p>We appreciate your business and look forward to serving you again!</p>
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
        to: data.email,
        subject: "Order Completed",
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

module.exports = orderCompleted;