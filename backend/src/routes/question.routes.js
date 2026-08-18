const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller.js');
const verifyToken = require('../middleware/auth.middleware.js');
const { isAdmin } = require('../middleware/role.middleware.js');

// Fetch questions for a specific quiz
// GET /api/quizzes/:quizId/questions
router.get('/quizzes/:quizId/questions', verifyToken, isAdmin, questionController.getQuestionsByQuiz);

// Create a new question (with options) for a specific quiz
// POST /api/quizzes/:quizId/questions
router.post('/quizzes/:quizId/questions', verifyToken, isAdmin, questionController.createQuestion);

// Update a question and its options
// PUT /api/questions/:id
router.put('/questions/:id', verifyToken, isAdmin, questionController.updateQuestion);

// Delete a question
// DELETE /api/questions/:id
router.delete('/questions/:id', verifyToken, isAdmin, questionController.deleteQuestion);

module.exports = router;