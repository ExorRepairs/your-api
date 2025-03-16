const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ Secure jobs endpoint with JWT authentication
router.get("/", authenticateUser, async (req, res) => {
    console.log(`🛠️ Jobs requested by: ${req.user.email}, Role: ${req.user.role}`);

    // ✅ Fetch jobs from Supabase database
    const { data: jobs, error } = await supabase
        .from("jobs") // Ensure this table exists in your database
        .select("*"); 

    if (error) {
        console.error("❌ Failed to fetch jobs:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(jobs);
});

module.exports = router;
