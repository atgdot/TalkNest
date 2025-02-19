const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    console.log("Headers:", req.headers); // Debugging
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No token found"); // Debugging
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message); // Debugging
        return res.status(403).json({ message: "Invalid token." });
    }
};


module.exports = verifyToken;
