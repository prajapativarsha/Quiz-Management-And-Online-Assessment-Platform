import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService'; 
import attemptService from '../../services/attemptService'; 

const QuizDetails = () => {
  const { id } = useParams(); // Extracts the quiz ID from the URL
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz details. It may have been removed or unpublished.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  const handleStartQuiz = async () => {
    setIsStarting(true);
    setError('');
    
    try {
      // Calls the POST /api/quizzes/:quizId/start endpoint you built in Step 1
      const response = await attemptService.startQuizAttempt(id);
      
      // Navigate to the active quiz interface, passing the newly created attempt ID
      navigate(`/student/quizzes/${id}/attempt/${response.attempt.id}`);
    } catch (err) {
      // Capture the specific error from the backend (e.g., "Maximum attempts reached")
      setError(err.response?.data?.message || 'Failed to start the quiz. Please try again.');
      setIsStarting(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading quiz details...</div>;
  
  if (error && !quiz) return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button onClick={() => navigate('/student/quizzes')} className="mt-4 text-blue-600 hover:underline">
            Return to Available Quizzes
        </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
              <span className="inline-block bg-blue-800 text-blue-100 text-sm px-3 py-1 rounded-full font-medium">
                {quiz.categories?.name || 'General'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Difficulty</p>
              <p className="text-xl font-semibold">{quiz.difficulty}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {quiz.description || 'Test your knowledge with this assessment.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-y border-gray-100 py-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-gray-800">{quiz.questions?.length || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Duration</p>
              <p className="text-2xl font-bold text-gray-800">{quiz.duration_minutes} Min</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Passing Score</p>
              <p className="text-2xl font-bold text-gray-800">{quiz.passing_score}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Max Attempts</p>
              <p className="text-2xl font-bold text-gray-800">{quiz.max_attempts}</p>
            </div>
          </div>

          {/* Error Display for Failed Starts (e.g., max attempts hit) */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {/* Action Section */}
          <div className="flex justify-end gap-4">
            <button 
              onClick={() => navigate('/student/quizzes')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleStartQuiz}
              disabled={isStarting}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isStarting ? 'Initializing...' : 'Start Quiz Now'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default QuizDetails;