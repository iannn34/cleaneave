// Dependencies
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const verifyToken  = require('./middleware/verifyToken');
const verifyStaff  = require('./middleware/verifyStaff');
const order = require('./routes/orderRoutes/placeOrder');
const register = require('./routes/userRoutes/registerUser');
const verifyEmail = require('./middleware/verifyEmail');
const login = require('./routes/userRoutes/authenticateUser');
const getProducts = require('./routes/orderRoutes/getProducts');
const getOrders = require('./routes/orderRoutes/getOrders');
const updateOrder = require('./routes/orderRoutes/updateOrder');
const logout = require('./routes/userRoutes/logout');
const resendVerification = require("./routes/userRoutes/resendVerification")
const passwordResetRequest = require("./routes/userRoutes/resetPasswordRequest");
const resetPassword = require("./routes/userRoutes/resetPassword");
const getUserInfo = require("./routes/userRoutes/getUserInfo");
const getOrderInfo = require("./routes/orderRoutes/getOrderInfo");
const favicon = require("serve-favicon");
const checkAuth = require("./routes/userRoutes/checkAuth");
const updateProfile = require('./routes/userRoutes/updateProfile');
const pool = require("./config/db");

// Port
const port = process.env.SERVER_PORT;
// Initializing express application
const app = express()
// Allowing use of json in the application
app.use(express.json())
app.use(favicon(path.join(__dirname, "public", "assets" , "cleanwave.ico")));
app.use(cookieParser())
// Logging of requests
app.use(morgan('dev'));
// Setting static directory
app.use('/public', express.static(path.join(__dirname, 'public')));


// Routes
app.get(("/") ,async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname,"public","html","home.html"));
    } catch (error) {
        res.sendStatus(500).json({ message : "Internal server error"})
    }
})

app.get("/register" ,async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname,"public","html","register.html"));
    } catch (error) {
        res.sendStatus(500).json({ message : "Internal server error"}) 
    }
})

app.post("/register" , register);

app.get("/verify-email/:token", verifyEmail )

app.get("/verify-email/email/:email" ,async (req, res) => {
    try{
        res.status(200).sendFile(path.join(__dirname,"public","html","verify-email.html"));
    }catch (error) {
        res.status(500).json({ message : "Internal server error"})
    }
})

app.post("/resend-verification", resendVerification)

app.get("/login", async (req,res) => {
    try {
        res.sendFile(path.join(__dirname,"public","html","login.html"));
    } catch (error) {
        res.sendStatus(500).json({message : "Internal server error"})
    }
})

app.post("/login" , login);

app.get("/password-reset", async (req,res) => {
    try{
        res.sendFile(path.join(__dirname,"public","html","password-reset-request.html"));
    }catch(error){
        console.log(error)
        res.status(500).json({message : "Internal server error"})
    }
})

app.post("/password-reset", passwordResetRequest)

app.get("/reset-password/:token", async (req,res) => {
    try{
        res.status(200).sendFile(path.join(__dirname,"public","html","password-reset.html"));
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.patch("/reset-password/:token", resetPassword)

app.get("/logout", logout)

app.get("/api/check-auth" ,checkAuth);
app.get("/api/products", verifyToken , getProducts);
app.get("/api/user-info", verifyToken , getUserInfo);
app.get("/api/order-details/:id", verifyToken , getOrderInfo);

app.get("/price-list", async (req,res) => {
    try{
        res.sendFile(path.join(__dirname,"public", "html" , "price-list.html"));
    }catch (error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.get("/profile", verifyToken ,(req,res) => {
    try{
        res.status(200).sendFile(path.join(__dirname,"public", "html", "user-profile.html"));
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.patch("/update-profile", verifyToken , updateProfile)

app.get("/order", verifyToken , async (req,res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'html', 'order.html'));
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post("/order", verifyToken , order)

app.get("/order-details/:id", async (req,res) => {
    try{
        res.sendFile(path.join(__dirname,"public","html", "order-details.html"));
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.get("/staff-dashboard",verifyToken , verifyStaff, async (req,res) => {
    try{
        res.sendFile(path.join(__dirname,"public","html", "staff-dashboard.html"));
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.get("/api/get-orders", verifyToken , verifyStaff, getOrders)

app.get("/update-order-status/:id", verifyToken , verifyStaff, async (req,res) => {
    try{
        res.sendFile(path.join(__dirname,"public","html", "update-order.html"));
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

app.patch("/update-order-status/:id", verifyToken , verifyStaff, updateOrder)
// Verifying server is running
app.listen(port, () => console.log(`Server is running on port ${process.env.SERVER_PORT}`));
