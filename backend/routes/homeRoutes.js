const express = require("express");
const homeRouter = express.Router();
//const { getHomePage } = require("../controllers/homeController");
const { getHomePage, getMyProfile, getUserProfile } = require("../controllers/homeController");
const verifyToken = require("../middleware/authMiddleware");

console.log("Initializing home router...");
homeRouter.get("/home", verifyToken, getHomePage);
console.log("home router setup completed");

console.log("Initializing user router...");
homeRouter.get("/my-profile", verifyToken, getMyProfile);
console.log("user router setup completed");

console.log("Initializing profile/:id router...");
homeRouter.get("/profile/:id", verifyToken, getUserProfile);
console.log("profile/:id router setup completed");

module.exports = homeRouter;