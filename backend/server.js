const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
console.log("server");
dotenv.config();
const app = express();
// Import and use the router (all routes under "/api" are handled by userRoutes)
const userRoute = require("./routes/userRoutes");
const homeRoute = require("./routes/homeRoutes")

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



app.use("/api/user", userRoute);  // Changed from "/" to "/api"
app.use("/api/user", homeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
