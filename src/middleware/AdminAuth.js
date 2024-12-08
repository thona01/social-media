const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.JWT_KEY, (err, admin) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" });
        req.admin = admin.data || admin;
        next();
    });

}

module.exports = verifyToken;

