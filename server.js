// Dependencies
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const verifyToken  = require('./middleware/verifyToken');
const order = require('./routes/orderRoutes/placeOrder');
const register = require('./routes/userRoutes/registerUser');
const verifyEmail = require('./middleware/verifyEmail');
const login = require('./routes/userRoutes/authenticateUser');
const getProducts = require('./routes/orderRoutes/getProducts');
const logout = require('./routes/userRoutes/logout');
const resendVerification = require("./routes/userRoutes/resendVerification")
const passwordResetRequest = require("./routes/userRoutes/resetPasswordRequest");
const resetPassword = require("./routes/userRoutes/resetPassword");

// Port
const port = process.env.SERVER_PORT;
// Initializing express application
const app = express()
// Allowing use of json in the application
app.use(express.json())
app.use(cookieParser())
// Logging of requests
app.use(morgan('combined'));
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

app.post("/reset-password/:token", resetPassword)

app.get("/logout", logout)

app.get("/api/products", verifyToken , getProducts)

app.get("/order", verifyToken , async (req,res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'html', 'order.html'));
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post("/order", verifyToken , order )

// Verifying server is running
app.listen(port, () => console.log(`Server is running on port ${process.env.SERVER_PORT}`));
