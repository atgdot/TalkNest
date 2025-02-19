const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store in .env file

// Signup
const signUp = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            console.log("Missing fields in request");
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Hashing password...");
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log("Password hashed successfully");

        const user = new User({ username, email, password: hashedPassword, role, rating: 0 });
        await user.save();
        console.log("User saved to database:", user);

        // Generate JWT
        console.log("Generating JWT...");
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
        console.log("JWT generated successfully");

        return res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Login
const logIn = async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing email or password in request");
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        console.log("Comparing passwords...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match for user:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        console.log("Generating JWT...");
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
        console.log("JWT generated successfully");

        return res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signUp, logIn };
