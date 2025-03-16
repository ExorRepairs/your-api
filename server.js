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

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test API Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Load job routes
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port $
