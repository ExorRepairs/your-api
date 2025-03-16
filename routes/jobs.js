const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Secure all job routes with authentication
router.get("/", authenticateUser, async (req, res) => {
    res.json({ message: "🔒 Jobs data secured!" });
});

module.exports = router;
