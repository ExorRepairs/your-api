const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ Allow only dispatchers to add new users
router.post("/", authenticateUser, authorizeRole("dispatcher"), async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }

    if (!["tech", "dispatcher"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'tech' or 'dispatcher'." });
    }

    // ✅ Step 1: Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const supabaseUserId = authUser.user.id;

    // ✅ Step 2: Save user in `users` table with correct role
    const { data: newUser, error: dbError } = await supabase
        .from("users")
        .insert([{ id: supabaseUserId, email, role, supabase_user_id: supabaseUserId }]);

    if (dbError) return res.status(500).json({ error: dbError.message });

    res.json({
        message: "✅ User created successfully!",
        user: {
            id: supabaseUserId,
            email,
            role,
        },
    });
});

module.exports = router;
