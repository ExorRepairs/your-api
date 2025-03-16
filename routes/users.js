const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ List all users (dispatchers only)
router.get("/", authenticateUser, authorizeRole("dispatcher"), async (req, res) => {
    const { data: users, error } = await supabase
        .from("users")
        .select("id, email, role");

    if (error) return res.status(500).json({ error: error.message });

    res.json(users);
});

// ✅ Update user role (dispatchers only)
router.put("/:id", authenticateUser, authorizeRole("dispatcher"), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["tech", "dispatcher"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const { data, error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "✅ User role updated successfully", user: data });
});

// ✅ Delete user (dispatchers only)
router.delete("/:id", authenticateUser, authorizeRole("dispatcher"), async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "✅ User deleted successfully" });
});

module.exports = router;
