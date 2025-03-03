const jwt = require('jsonwebtoken');
// using jwt to protect the routes and verify the token
// this middleware will be used to protect
exports.protect = (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data (id, email) to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, token invalid" });
    }
};
