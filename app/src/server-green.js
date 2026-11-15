
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Identify Green version in every response
app.use((req, res, next) => {
  res.setHeader("X-App-Version", "green-v3");
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to NovaPay API",
    version: "green-v3",
    deployment: "green"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: "green-v3",
    timestamp: new Date().toISOString()
  });
});

// Readiness check endpoint
app.get("/ready", (req, res) => {
  res.status(200).json({
    status: "ready",
    version: "green-v3"
  });
});

// Version endpoint
app.get("/version", (req, res) => {
  res.status(200).json({
    application: "NovaPay API",
    version: "green-v3",
    deployment: "canary",
    environment: process.env.NODE_ENV || "development"
  });
});

// Accounts endpoint
app.get("/accounts", (req, res) => {
  res.status(200).json({
    message: "Accounts retrieved successfully",
    version: "green-v3",
    accounts: [
      {
        id: 101,
        name: "Green Test Account",
        balance: 5000,
        currency: "INR"
      },
      {
        id: 102,
        name: "Green Savings Account",
        balance: 10000,
        currency: "INR"
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    version: "green-v3"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Green API Error:", err.message);

  res.status(500).json({
    error: "Internal Server Error",
    version: "green-v3"
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NovaPay Green API running on port ${PORT}`);
  console.log(`Version: green-v3`);
});

