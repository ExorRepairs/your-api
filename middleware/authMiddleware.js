const jwt = require("jsonwebtoken");

// ✅ Middleware: Authenticate JWT token
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token." });
    }
};

// ✅ Middleware: Authorize role (only dispatchers can add users)
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };

