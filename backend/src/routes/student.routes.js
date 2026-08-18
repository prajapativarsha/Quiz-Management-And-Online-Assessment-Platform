const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware.js');
const { isStudent } = require('../middleware/role.middleware.js');

const  {
  getAllQuizzes,
  getQuizById,
} = require('../controllers/quiz.controller.js');

router.get('/quizzes', verifyToken, isStudent, getAllQuizzes);

module.exports = router;