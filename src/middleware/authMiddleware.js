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

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" });

        // Assuming the payload contains a property `id` and `data` to attach to `req.user`.
        req.user = user.data || user; // Adjust based on how your token payload is structured.
        next();
    });
}

module.exports = verifyToken;
