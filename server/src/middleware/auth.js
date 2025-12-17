// D:\manpower-ms\server\middleware\auth.js

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

// Middleware to verify JWT and attach user data to the request
const protect = (req, res, next) => {
    // 1. Check for token in headers (Standard is 'Bearer <token>')
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify token using the secret
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user payload (ID, Role, CompanyId) to the request object
        req.user = { 
            userId: payload.userId, 
            role: payload.role, 
            companyId: payload.companyId 
        };
        
        next();

    } catch (error) {
        // If verification fails (e.g., token expired or invalid secret)
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication failed: Invalid token.' });
    }
};

// Middleware to restrict access based on user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles list
        if (!roles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                msg: `User role (${req.user.role}) is not authorized to access this route.` 
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };