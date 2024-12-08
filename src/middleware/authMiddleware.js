const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.JWT_KEY, (err, user, admin) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" });
        req.user = user.data || admin;
        next();
    });

}

module.exports = verifyToken;

