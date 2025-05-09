const generateEmailToken = require("../middleware/generateEmailToken");
const transporter = require("../config/mail");


/**
 * Sends a password reset email to the specified user.
 *
 * @param {string} user_id - The unique identifier of the user requesting the password reset.
 * @param {string} email - The email address of the user to send the password reset email to.
 * @param {string} name - The name of the user to personalize the email content.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully or rejects if an error occurs.
 *
 * @description
 * This function generates a secure token for the user and constructs a password reset URL.
 * It then sends an email containing the reset link and instructions to the user's email address.
 * The email includes a link that expires in 3 hours for security reasons.
 *
 * @throws {Error} If there is an issue sending the email, the error is logged to the console.
 */

const passwordResetEmail = (async (user_id, email, name) => {
    const token = await generateEmailToken(user_id);

    const passwordResetURL = `http://localhost:1337/reset-password/${encodeURIComponent(token)}`;

    let message = `
        <h3>Dear ${name}</h3>

        <p>We received a request to reset your password for your Clean wave account. Click the button below to reset your password:</p>

        <a href="${passwordResetURL}">Reset Password</a>

        <p>If you did not request a password reset, please ignore this email. This link will expire in 3 hours for security reasons.</p>

        <p>For any assistance, contact our support team at <a href="mailto:cleanwavemail@gmail.com">cleanwavemail@gmail.com</a>.</p>

        <p>Best Regards,</p>
        <p>The Cleanwave Team</p>`;

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: email,
        subject: "Reset Your Password – Clean wave",
        html: message
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Error sending email:", error);
    }
});

module.exports = passwordResetEmail;