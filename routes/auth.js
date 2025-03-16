const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const JWT_SECRET = process.env.JWT_SECRET; // Your custom JWT secret

// ✅ Login Route with Role Lookup
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    // ✅ Attempt to log in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const supabaseUserId = data.user.id; // UUID from Supabase Auth

    // ✅ Fetch user's role from `users` table
    const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("supabase_user_id", supabaseUserId) // ✅ Fixed: Match using `supabase_user_id`
        .single();

    if (roleError || !userData) {
        return res.status(500).json({ error: "User role not found in database." });
    }

    const userRole = userData.role; // `tech` or `dispatcher`

    // ✅ Generate JWT including user role
    const token = jwt.sign(
        {
            userId: supabaseUserId,
            email: data.user.email,
            role: userRole, // Attach role to token
        },
        JWT_SECRET,
        { expiresIn: "24h" }
    );

    res.json({
        message: "✅ Login successful",
        token,
        user: { ...data.user, role: userRole },
    });
});

module.exports = router;
