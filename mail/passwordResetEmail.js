const generateEmailToken = require("../middleware/generateEmailToken");
const transporter = require("../config/mail");


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