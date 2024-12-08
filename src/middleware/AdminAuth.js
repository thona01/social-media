const jwt = require('jsonwebtoken');

function AdminAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, admin) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Log the decoded token for debugging
        console.log('Decoded token:', admin);

        // Ensure the payload has the expected structure
        if (!admin || !admin.data) {
            return res.status(401).json({ message: "Invalid token structure" });
        }

        req.admin = admin.data; // Set the admin data in the request object
        next();
    });
}

module.exports = AdminAuth;
