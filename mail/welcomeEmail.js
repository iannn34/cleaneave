const transporter = require("../config/mail");
require("dotenv").config();

/**
 * Sends a welcome email to a new user with details about Clean Wave's services and links to get started.
 *
 * @async
 * @function sendWelcomeEmail
 * @param {string} name - The name of the recipient.
 * @param {string} email - The email address of the recipient.
 * @returns {Promise<boolean>} Resolves when the email is sent successfully, or logs an error if sending fails.
 */

const sendWelcomeEmail = async (name, email) =>  {
    let message = `
        <p>Dear ${name},</p>

        <p>Welcome to Clean Wave! 🎉 We're thrilled to have you on board. Managing your laundry has never been easier, and we’re here to make the process seamless, efficient, and hassle-free for you.</p>

        <h3>What You Can Do with Clean Wave:</h3>
        <ul>
            <li>✅ Place and schedule laundry orders online at your convenience.</li>
            <li>✅ Track your orders in real-time and stay updated on their progress.</li>
            <li>✅ Receive email notifications when your laundry is processed and ready.</li>
        </ul>

        <h3>Get Started:</h3>
        <p>👉 <a href="${process.env.BASE_URL}/price-list">View our prices.</a></p>
        <p>👉 <a href="${process.env.BASE_URL}/order">Place a New Order.</a></p>
        <p>👉 <a href="${process.env.BASE_URL}/profile">Manage Your Account.</a></p>

        <p>If you have any questions or need assistance, our support team is always ready to help. Reach us at <a href="mailto:cleanwavemail@gmail.com">cleanwavemail@gmail.com</a>.</p>

        <p>Thank you for choosing Clean Wave – where laundry is just a click away! 🚀</p>

        <p>Best Regards,<br>
        The Clean Wave Team</p>
    `;

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: email,
        subject: "Welcome to Clean Wave – Your Smart Laundry Management System!",
        html: message
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log("Error sending email:" , error)
    }
}

module.exports = sendWelcomeEmail;


