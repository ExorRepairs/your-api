const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "✅ Login successful",
    token: data.session.access_token,
    user: data.user
  });
});

module.exports = router;
