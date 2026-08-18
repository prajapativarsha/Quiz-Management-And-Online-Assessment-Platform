const express = require('express');
const router = express.Router();
const { 
    startQuiz , 
    submitQuizAttempt,
    getAttemptHistory, 
    getAttemptById
 } = require('../controllers/attempt.controller.js');

const verifyToken = require('../middleware/auth.middleware.js'); 
const { isStudent } = require('../middleware/role.middleware.js');

// Route: POST /api/quizzes/:quizId/start
router.post('/quizzes/:quizId/start', verifyToken, isStudent, startQuiz);

//POST /api/quizzes/:quizId/submit
router.post('/quizzes/:quizId/submit', verifyToken, isStudent, submitQuizAttempt);

// Fetch all attempts for the logged-in student
router.get('/attempts', verifyToken, isStudent, getAttemptHistory);

// Fetch detailed results for a specific attempt
router.get('/attempts/:id', verifyToken, isStudent, getAttemptById);

module.exports = router;