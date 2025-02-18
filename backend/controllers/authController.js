const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

console.log("AuthController initialized...");  // Debugging: Confirm the controller is loaded

// Signup handler
const signUp = async (req, res, next) => {
    console.log("Signup function called");
    console.log("Received data:", req.body);

    const { username, email, password, role } = req.body;  // Use 'username' and 'role' correctly

    // Check if request body is empty
    if (!username || !email || !password || !role) {  // Check for 'role', not 'roleZZ'
        console.error("Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser;
    try {
        console.log("Checking if user exists in database...");
        existingUser = await User.findOne({ email });
    } catch (err) {
        console.error("Error checking existing user:", err);
        return res.status(500).json({ message: "Database query error" });
    }

    if (existingUser) {
        console.warn("User already exists:", email);
        return res.status(400).json({ message: "User already exists" });
    }

    console.log("User does not exist. Proceeding with registration...");

    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("Password hashed successfully");

    const user = new User({
        username,   // Save 'username' here
        email,
        password: hashedPassword,
        role,       // Save 'role' here
        blogs: []   // Assuming user will have a list of blogs
    });

    try {
        await user.save();
        console.log("User registered successfully:", user);
        return res.status(201).json({ user });
    } catch (e) {
        console.error("Error saving user:", e);
        return res.status(500).json({ message: "Server error", error: e.message });
    }
};


// Login handler
const logIn = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        console.log("Login function called");

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            console.warn("Invalid email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the entered password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("Invalid password for email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Exclude password from the response for security
        const { password: _, ...userWithoutPassword } = user.toObject();

        console.log("Login successful for:", email);
        return res.json({ message: "Login successful", user: userWithoutPassword });

    } catch (error) {
        console.error("Error in login function:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { signUp, logIn };
