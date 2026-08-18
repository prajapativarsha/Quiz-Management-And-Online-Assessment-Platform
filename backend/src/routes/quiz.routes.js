const express = require('express');
const router = express.Router();

const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  updateQuizStatus
} = require('../controllers/quiz.controller.js');

const  verifyToken  = require('../middleware/auth.middleware.js');
const {isAdmin } = require ('../middleware/role.middleware.js')

// ----------------Public / Student Routes-----------------//
// Fetch all quizzes (Controller will handle filtering published ones for students) 
router.get('/', verifyToken ,getAllQuizzes);

// Fetch a single quiz by its ID 
router.get('/:id', verifyToken ,getQuizById);


//----------------- Admin-Only Routes-------------------------//
// Create a new quiz 
router.post('/', verifyToken, isAdmin, createQuiz);

// Update an existing quiz 
router.put('/:id', verifyToken, isAdmin, updateQuiz);

// Delete a quiz 
router.delete('/:id', verifyToken, isAdmin, deleteQuiz);

// Update the publish status (e.g., from DRAFT to PUBLISHED) 
router.patch('/:id/publish', verifyToken, isAdmin, updateQuizStatus);

module.exports = router;