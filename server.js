const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const verifyToken  = require('./middleware/verifyToken');
const verifyStaff  = require('./middleware/verifyStaff');
const verifyAdmin  = require('./middleware/verifyAdmin');
const order = require('./routes/orderRoutes/placeOrder');
const register = require('./routes/userRoutes/registerUser');
const verifyEmail = require('./routes/userRoutes/verifyEmail');
const login = require('./routes/userRoutes/authenticateUser');
const getProducts = require('./routes/orderRoutes/getProducts');
const getOrders = require('./routes/orderRoutes/getOrders');
const updateOrder = require('./routes/orderRoutes/updateOrder');
const logout = require('./routes/userRoutes/logout');
const resendVerification = require("./routes/userRoutes/resendVerification")
const passwordResetRequest = require("./routes/userRoutes/resetPasswordRequest");
const updateUserRole = require("./routes/userRoutes/updateUserRole");
const resetPassword = require("./routes/userRoutes/resetPassword");
const getUserInfo = require("./routes/userRoutes/getUserInfo");
const getOrderInfo = require("./routes/orderRoutes/getOrderInfo");
const favicon = require("serve-favicon");
const checkAuth = require("./routes/userRoutes/checkAuth");
const updateProfile = require('./routes/userRoutes/updateProfile');
const reportData = require("./routes/orderRoutes/reportData");
const serveFile = require("./routes/serveFile");


const port = process.env.SERVER_PORT;

const app = express()

app.use(express.json())

app.use(favicon(path.join(__dirname, "public", "assets" , "cleanwave.ico")));

app.use(cookieParser())

app.use(morgan('dev'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get(("/") , serveFile("home.html"))
app.get("/register" , serveFile("register.html"))
app.post("/register" , register);
app.get("/verify-email/:token", verifyEmail )
app.get("/verify-email/email/:email" , serveFile("verify-email.html"))
app.post("/resend-verification", resendVerification)
app.get("/login", serveFile("login.html"))
app.post("/login" , login);
app.get("/password-reset", serveFile("password-reset-request.html"))
app.post("/password-reset", passwordResetRequest)
app.get("/reset-password/:token", serveFile("password-reset.html"))
app.patch("/reset-password/:token", resetPassword)
app.get("/logout", logout)
app.get("/api/check-auth" ,checkAuth);
app.get("/api/products", getProducts);
app.get("/api/user-info", verifyToken , getUserInfo);
app.get("/api/order-details/:id", verifyToken , getOrderInfo);
app.get("/price-list", serveFile("price-list.html"));
app.get("/profile", verifyToken , serveFile("user-profile.html"));
app.patch("/update-profile", verifyToken , updateProfile)
app.get("/order", verifyToken , serveFile("order.html"))
app.post("/order", verifyToken , order)
app.get("/order-details/:id", serveFile("order-details.html"))
app.get("/staff-dashboard",verifyToken , verifyStaff, serveFile("staff-dashboard.html"))
app.get("/api/get-orders", verifyToken , verifyStaff, getOrders)
app.get("/update-order-status/:id", verifyToken , verifyStaff, serveFile("update-order.html"))
app.patch("/update-order-status/:id", verifyToken , verifyStaff, updateOrder)
app.get("/api/report-data",verifyToken, verifyAdmin, reportData);
app.get("/admin/dashboard", verifyToken, verifyAdmin, serveFile("admin-dashboard.html"))
app.get("/admin/revenue-report" , verifyToken, verifyAdmin, serveFile("revenue-report.html"));
app.get("/admin/service-breakdown", verifyToken, verifyAdmin, serveFile("service-breakdown.html"));
app.get("/admin/status-count", verifyToken , verifyAdmin, serveFile("status-count.html"));
app.get("/admin/customer-acquisition", verifyToken, verifyAdmin, serveFile("customer-acquisition.html"));
app.get("/about", serveFile("about.html"));
app.get("/contact", serveFile("contact.html"));
app.get("/admin/user-role-update", verifyToken, verifyAdmin, serveFile("user-role-update.html"));
app.patch("/admin/user-role-update", verifyToken, verifyAdmin, updateUserRole);

if(require.main == module){
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}

module.exports = app;