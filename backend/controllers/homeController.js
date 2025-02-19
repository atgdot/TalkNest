const User = require("../models/UserModel");

const getHomePage = async (req, res) => {
    try {
        console.log("Received request to get home page");
        const loggedInUserId = req.user.id; // Extract user ID from JWT
        console.log("Logged in user ID:", loggedInUserId);

        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .sort({ rating: -1 }) // Highest rating first
            .select("_id username rating role");

        console.log("Fetched users:", users);
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ✅ Get Another User's Profile
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params; // Extract the requested user ID from URL
        const user = await User.findById(id).select("username rating role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User profile details",
            user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get Logged-in User's Profile
const getMyProfile = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Extract user ID from JWT token
        const user = await User.findById(loggedInUserId).select("username email rating role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Your profile details",
            user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getHomePage, getMyProfile, getUserProfile };

