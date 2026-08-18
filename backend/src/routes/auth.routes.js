const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth.controller.js');
const verifyToken = require('../middleware/auth.middleware.js');
const { isAdmin } = require('../middleware/role.middleware.js');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
