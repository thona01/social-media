// const jwt = require('jsonwebtoken');
//
// function verifyToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({ message: "Authentication required" });
//
//     jwt.verify(token, process.env.JWT_KEY, (err, user) => {
//         if (err) return res.status(401).json({ message: "Invalid or expired token" });
//         req.user = user.data;
//         next();
//     });
// }
//
// module.exports = verifyToken;
const jwt = require('jsonwebtoken');

function verifyToken(requiredRole = null) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Authentication required" });

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) return res.status(401).json({ message: "Invalid or expired token" });

            req.user = user.data;

            // Check for required role, if specified
            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }

            next();
        });
    };
}

module.exports = verifyToken;
