const transporter = require("../config/mail");

const sendWelcome = async (name, email) =>  {
    let message = `
        <p><strong>Dear ${name},</strong></p>

        <p>Welcome to <strong>Clean Wave</strong>! 🎉 We're thrilled to have you on board. Managing your laundry has never been easier, and we’re here to make the process <strong>seamless, efficient, and hassle-free</strong> for you.</p>

        <h3>What You Can Do with Clean Wave:</h3>
        <ul>
            <li>✅ <strong>Place and schedule laundry orders</strong> online at your convenience.</li>
            <li>✅ <strong>Track your orders in real-time</strong> and stay updated on their progress.</li>
            <li>✅ <strong>Receive email notifications</strong> when your laundry is processed and ready.</li>
        </ul>

        <h3>Get Started:</h3>
        <p>👉 <a href="[Insert Order Link]">Place a New Order</a></p>
        <p>👉 <a href="[Insert Tracking Link]">Track Your Laundry</a></p>
        <p>👉 <a href="[Insert Account Dashboard Link]">Manage Your Account</a></p>

        <p>If you have any questions or need assistance, our support team is always ready to help. Reach us at <a href="mailto:[Support Email]">[Support Email]</a> or visit our <a href="[Insert Help Center Link]">Help Center</a>.</p>

        <p>Thank you for choosing <strong>Clean Wave</strong> – where laundry is just a click away! 🚀</p>

        <p><strong>Best Regards,</strong><br>
        <strong>The Clean Wave Team</strong></p>
    `;

    let mailOptions = {
        from: "cleanwavemail@gmail.com",
        to: email,
        subject: "Welcome to Clean Wave – Your Smart Laundry Management System!",
        html: message // Use `html` instead of `text`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = sendWelcome;


