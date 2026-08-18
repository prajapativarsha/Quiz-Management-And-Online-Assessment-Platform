const prisma = require("../config/prisma");

const startQuiz = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const userId = req.user.id; 
    
   // Verifying the quiz exists and is actually published
    const quiz = await prisma.quizzes.findUnique({
      where: { id: quizId },
    });

    if (!quiz || quiz.status !== 'PUBLISHED') {
      return res.status(404).json({ message: 'Quiz not found or not available.' });
    }

    //  Enforcing the maximum attempts rule from your schema
    const attemptCount = await prisma.attempts.count({
      where: {
        quiz_id: quizId,
        user_id: userId,
      },
    });
    
    if (attemptCount >= quiz.max_attempts) {
      return res.status(403).json({ message: 'You have reached the maximum attempts for this quiz.' });
    }
    
    // Creating the new attempt
    const newAttempt = await prisma.attempts.create({
      data: {
        quiz_id: quizId,
        user_id: userId,
      },
    });
   
     res.status(201).json({
      message: 'Quiz started successfully',
      attempt: newAttempt,
    });

  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ message: 'Server error while starting the quiz.' });
  }
};


const submitQuizAttempt = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const userId = req.user.id; // From verifyToken middleware
    const { answers } = req.body; 

    
    // ---------Fetch Attempt & Quiz Data
    
    // Finding the student's active attempt
    const attempt = await prisma.attempts.findFirst({
      where: { 
        quiz_id: quizId, 
        user_id: userId, 
        status: 'IN_PROGRESS' 
      },
      orderBy: { started_at: 'desc' }
    });

    if (!attempt) {
      return res.status(400).json({ message: 'No active attempt found. The quiz may have already been submitted.' });
    }

    // Fetching the quiz along with all questions and their associated options
    const quiz = await prisma.quizzes.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    
    // Implementing Score Calculation
    
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    let earnedMarks = 0;

    const answersToSave = []; // Array to hold records for bulk insertion

    // Loop through the database questions (Answer Key) and compare with frontend submission
    quiz.questions.forEach((question) => {
      totalMarks += question.marks;
      
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find(opt => opt.is_correct);
      
      let isCorrect = false;

      if (selectedOptionId) {
        // Student answered the question
        if (correctOption && selectedOptionId === correctOption.id) {
          isCorrect = true;
          correctCount++;
          earnedMarks += question.marks;
        } else {
          incorrectCount++;
        }
        
        answersToSave.push({
          attempt_id: attempt.id,
          question_id: question.id,
          selected_option_id: selectedOptionId,
          is_correct: isCorrect
        });
      } else {
        // Student skipped/unanswered the question
        unansweredCount++;
        answersToSave.push({
          attempt_id: attempt.id,
          question_id: question.id,
          selected_option_id: null,
          is_correct: false
        });
      }
    });

    // Calculate final percentage
    const percentage = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0;

   
    // Determining Pass/Fail Status
    const finalStatus = percentage >= quiz.passing_score ? 'PASSED' : 'FAILED';

    
    //---------- Saving Final Results to Database
    
    // Calculate time taken in seconds
    const timeTaken = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000);

    // Updating the attempts record
    const updatedAttempt = await prisma.attempts.update({
      where: { id: attempt.id },
      data: {
        score: earnedMarks,
        percentage: percentage,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        unanswered: unansweredCount,
        time_taken_seconds: timeTaken,
        status: finalStatus,
        completed_at: new Date()
      }
    });

    //  Bulk insert the student's individual answers for review later
    if (answersToSave.length > 0) {
      await prisma.answers.createMany({
        data: answersToSave
      });
    }

    // Sending the final graded result back to the frontend
    res.status(200).json({
      message: 'Quiz submitted and graded successfully',
      result: updatedAttempt
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz.' });
  }
};

const getAttemptHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from verifyToken middleware

    // the attempts table for all records matching the user's ID
    const history = await prisma.attempts.findMany({
      where: { 
        user_id: userId,
        status: { not: 'IN_PROGRESS' } 
      },
      orderBy: { 
        completed_at: 'desc' // Most recent first
      },
      include: {
        quizzes: {
          select: { title: true } 
        }
      }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching attempt history:', error);
    res.status(500).json({ message: 'Server error while fetching history.' });
  }
};


//------Fetching Detailed Attempt Results
const getAttemptById = async (req, res) => {
  try {
    const attemptId = parseInt(req.params.id);
    const userId = req.user.id; 

    // Query for the specific attempt
    const attempt = await prisma.attempts.findFirst({
      where: { 
        id: attemptId,
        user_id: userId // Security measure: ensure the student requesting it actually owns it
      },
      // Deep relational fetch using Prisma's include feature
      include: {
        quizzes: true, // Details about the overall quiz
        answers: {
          include: {
            questions: {
              include: {
                options: true // Fetches all possible options for the question
              }
            },
            options: true // Fetches the specific option the student selected
          }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found or access denied.' });
    }

    res.status(200).json(attempt);
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ message: 'Server error while fetching attempt details.' });
  }
};

module.exports = { 
  startQuiz ,
  submitQuizAttempt , 
  getAttemptHistory, 
  getAttemptById};