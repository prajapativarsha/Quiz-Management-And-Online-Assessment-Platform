const prisma = require('../config/prisma');

// Fetch all questions for a specific quiz (including their options)
exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await prisma.questions.findMany({
      where: { quiz_id: parseInt(quizId) },
      include: { options: true }, // Crucial: Fetch the options along with the question
      orderBy: { created_at: 'asc' }
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// Create a question and its options simultaneously
exports.createQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const { question_text, marks, explanation, difficulty, options } = req.body;

    const newQuestion = await prisma.questions.create({
      data: {
        quiz_id: parseInt(quizId),
        question_text,
        marks: marks || 1,
        explanation,
        difficulty,
        options: {
          create: options.map(opt => ({
            option_text: opt.option_text,
            is_correct: opt.is_correct === true || opt.is_correct === 'true'
          }))
        }
      },
      include: { options: true } 
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// Update a question and its options
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, marks, explanation, difficulty, options } = req.body;

   
    const updatedQuestion = await prisma.questions.update({
      where: { id: parseInt(id) },
      data: {
        question_text,
        marks: marks || 1,
        explanation,
        difficulty,
        options: {
          deleteMany: {}, 
          create: options.map(opt => ({ // Insert the updated options
            option_text: opt.option_text,
            is_correct: opt.is_correct === true || opt.is_correct === 'true'
          }))
        }
      },
      include: { options: true }
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};


exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.questions.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};