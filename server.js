// Import required dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Supabase Client with error handling
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("❌ ERROR: Missing Supabase credentials. Check your .env file.");
  process.exit(1); // Exit process if credentials are missing
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test API Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ API is running successfully." });
});

// Load routes AFTER app is initialized
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

// ✅ Add users route (Only for dispatchers)
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server with Graceful Shutdown Handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Handle unexpected shutdowns
process.on("SIGTERM", () => {
  console.log("⚠️ Shutting down gracefully...");
  server.close(() => {
    console.log("🛑 Server has shut down.");
    process.exit(0);
  });
});
