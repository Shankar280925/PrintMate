const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config(); // loads values from .env into process.env

const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow the React dev server to call this API
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

app.use(express.json()); // lets Express read JSON request bodies

// Make uploaded files viewable at http://localhost:5000/uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple check that the server is alive
app.get("/", function (req, res) {
  res.json({ message: "Campus Xerox API is running." });
});

app.use("/api/orders", orderRoutes);

// Unknown URL
app.use(function (req, res) {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler); // must be last

// Connect to MongoDB first, then start the server
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Create backend/.env (see .env.example).");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // give up after 5 seconds
    });
    console.log("MongoDB connected.");

    app.listen(PORT, function () {
      console.log("Server running on http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Check that MongoDB is running and MONGODB_URI in .env is correct.");
    process.exit(1);
  }
}

startServer();
