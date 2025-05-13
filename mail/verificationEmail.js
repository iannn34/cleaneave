const generateEmailToken = require("../middleware/generateEmailToken");
const transporter = require("../config/mail");

/**
 * Sends a verification email to a user with a unique token to verify their email address.
 *
 * @param {string} user_id - The unique identifier of the user.
 * @param {string} email - The email address of the user to send the verification email to.
 * @param {string} name - The name of the user to personalize the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully, or rejects with an error if sending fails.
 *
 * @throws {Error} Throws an error if there is an issue sending the email.
 */

const sendVerificationEmail = (async (user_id, email, name) => {
    const token = await generateEmailToken(user_id);

    const verificationURL = `http://localhost:1337/verify-email/${encodeURIComponent(token)}`;

    let message = `
    <h3>Dear ${name},</h3>

    <p>Thank you for signing up with Clean wave. To complete your registration and activate your account, please verify your email by clicking the link below:</p>

    <p><a href=${verificationURL}>Verify My Email</a></p>

    <p>If you did not create this account, please ignore this email. This link will expire after 3 hours for security reasons.</p>

    <p>For any assistance, contact our support team at - cleanwavemail@gmail.com.</p>

    <p>Best Regards,<br>The Clean wave Team</p>`;

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: email,
        subject: "Verify Your Email – Clean wave Account Activation",
        html: message
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
    }
});

module.exports = sendVerificationEmail;