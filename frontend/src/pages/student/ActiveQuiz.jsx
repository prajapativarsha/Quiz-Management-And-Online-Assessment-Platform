import React, { useState, useEffect , useRef} from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import quizService from '../../services/quizService';
import attemptService from '../../services/attemptService'; 

const ActiveQuiz = () => {
  const { id: quizId, attemptId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz & Timer State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hasSubmitted = useRef(false); //to prevent multiple submissions

  
  useEffect(() => {
    const fetchActiveQuiz = async () => {
     
      try {
        // Fetch the quiz along with its questions and options
        const data = await quizService.getQuizById(quizId);
        setQuiz(data);

        const durationMs = data.duration_minutes * 60 * 1000;
        let startTime = localStorage.getItem(`attempt_${attemptId}_start`);
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem(`attempt_${attemptId}_start`, startTime);
        }

        const endTime = parseInt(startTime) + durationMs;
        
        // Initial time calculation
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);

      } catch (err) {
        setError('Failed to load the active quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveQuiz();
  }, [quizId],[attemptId]);

  // The Countdown Timer Hook
  useEffect(() => {
    if (timeLeft === null || isSubmitting || hasSubmitted.current) return;

    // If time runs out, auto-submit!
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  // Submission Logic
  const handleFinalSubmit = async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setIsSubmitting(true)

    try {
      
      await attemptService.submitQuizAttempt(quizId, answers);
      
      // Clean up local storage backup
      localStorage.removeItem(`attempt_${attemptId}_start`);
      
      // Redirect to a results processing or summary page
      navigate(`/student/results/${attemptId}`);
    } catch (err) {
      console.error("Failed to submit", err);
      setError("Failed to submit the quiz. Please contact an administrator.");
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  // Format time for the UI display (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Answer Selection Logic
  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Navigation Logic
  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJump = (index) => {
    setCurrentIndex(index);
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading your assessment...</div>;
  if (error || !quiz) return <div className="text-center mt-20 text-red-500">{error}</div>;

  // ADD THIS NEW SAFETY CHECK:
  if (!quiz.questions || quiz.questions.length === 0) {
    return <div className="text-center mt-20 text-xl text-red-600 font-semibold">Error: No questions found for this quiz.</div>;
  }
  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mt-6 flex flex-col lg:flex-row gap-6">
      
      {/* Main Quiz Area */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Quiz Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold truncate pr-4">{quiz.title}</h1>
          <div className={`px-4 py-2 rounded-lg font-mono text-lg font-semibold shrink-0 shadow-inner ${
              timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-blue-800'
          }`}>
            ⏱ {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8 flex-grow">
          <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
            <h2 className="text-lg font-medium text-gray-500">
              Question {currentIndex + 1} of {quiz.questions.length}
            </h2>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {currentQuestion.marks} Point{currentQuestion.marks > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xl text-gray-800 mb-8 leading-relaxed">
            {currentQuestion.question_text}
          </p>

          {/* Multiple Choice Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <label 
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  answers[currentQuestion.id] === option.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-4 text-gray-700 text-lg">{option.option_text}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
      <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors"  
            >
              Next
            </button>
          )}
        </div>

      {/* Sidebar: Question Grid (Jump Navigation) */}
      <div className="w-full lg:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit shrink-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Quiz Overview</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentIndex === index;
            
            let buttonClass = "w-full aspect-square rounded font-semibold text-sm transition-all ";
            
            if (isCurrent) {
              buttonClass += "bg-blue-600 text-white ring-2 ring-blue-300 shadow-md scale-105";
            } else if (isAnswered) {
              buttonClass += "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200";
            } else {
              buttonClass += "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200";
            }

            return (
              <button
                key={q.id}
                onClick={() => handleJump(index)}
                className={buttonClass}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-600 rounded inline-block"></span> Current Question</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-100 border border-blue-200 rounded inline-block"></span> Answered</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-100 border border-gray-200 rounded inline-block"></span> Unanswered</div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default ActiveQuiz;