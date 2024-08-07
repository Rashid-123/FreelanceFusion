const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const fileUpload = require("express-fileupload"); // Import express-fileupload

require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Development environment
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); // Use file upload middleware

// API routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server listening
connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server started on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
