const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ Get all payouts (only dispatchers can see payouts)
router.get("/", authenticateUser, authorizeRole("dispatcher"), async (req, res) => {
    const { data: payouts, error } = await supabase
        .from("payouts")
        .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(payouts);
});

// ✅ Calculate technician earnings
router.get("/calculate", authenticateUser, async (req, res) => {
    const { data: earnings, error } = await supabase.rpc("calculate_earnings"); // Example stored function

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "✅ Payouts calculated", earnings });
});

module.exports = router;
