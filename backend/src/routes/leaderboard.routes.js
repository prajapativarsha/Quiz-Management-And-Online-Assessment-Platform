const express = require('express');
const router = express.Router();

// Import the controller function (we will build this in Step 2)
const { getLeaderboard } = require('../controllers/leaderboard.controller.js');

// Import your authentication middleware
const verifyToken = require('../middleware/auth.middleware.js');

// Route: GET /api/leaderboard
// We apply verifyToken so both Students and Admins can view it, 
// but unauthenticated users are blocked.
router.get('/leaderboard', verifyToken, getLeaderboard);

module.exports = router;