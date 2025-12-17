// D:\manpower-ms\server\routes\auth.js

const express = require('express');
const router = express.Router();

const { register, login, registerEmployee } = require('../controllers/auth'); // Import new function
const { protect, authorizeRoles } = require('../middleware/auth'); // Import middleware

// Public routes for authentication
router.post('/register', register);
router.post('/login', login);

// Protected routes for internal actions
router.post(
    '/register/employee', 
    protect, 
    authorizeRoles('admin', 'super_admin'), // Only Admins can use this route
    registerEmployee
);

module.exports = router;