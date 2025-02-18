const express = require("express");
const { signUp, logIn } = require("../controllers/authController");

const router = express.Router();
console.log("Routes initialized..."); // Debugging route initialization

// Route for signup
router.post("/signup", (req, res, next) => {
  console.log("Signup route hit!"); // Debugging: Check if the route is hit
  console.log("Request body:", req.body); // Debugging: Log the request body
  next(); // Proceed to the signUp controller function
}, signUp);

router.post("/login", (req, res, next) => {
  console.log("loginhit!"); // Debugging: Check if the route is hit
  console.log("Request body:", req.body); // Debugging: Log the request body
  next(); // Proceed to the signUp controller function
}, logIn);

module.exports = router;
