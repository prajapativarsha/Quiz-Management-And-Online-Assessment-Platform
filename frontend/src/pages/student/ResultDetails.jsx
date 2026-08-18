import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import attemptService from '../../services/attemptService';

const ResultDetails = () => {
  const { id } = useParams(); // Get the attempt ID from the URL
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        const data = await attemptService.getAttemptById(id);
        setAttempt(data);
      } catch (err) {
        setError('Failed to load result details. It may be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading your results...</div>;
  if (error || !attempt) return <div className="text-center mt-20 text-red-500">{error}</div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 mt-6">
      
      {/* Header & Summary Dashboard */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className={`p-6 text-white flex justify-between items-center ${attempt.status === 'PASSED' ? 'bg-green-600' : 'bg-red-600'}`}>
          <div>
            <h1 className="text-2xl font-bold mb-1">Result: {attempt.quizzes?.title}</h1>
            <p className="text-white/80">Completed on {new Date(attempt.completed_at).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{attempt.percentage}%</div>
            <div className="text-sm font-medium uppercase tracking-wide">{attempt.status}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-t border-gray-100">
          <div className="text-center p-4 bg-white rounded shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Total Score</div>
            <div className="text-2xl font-bold text-gray-800">{attempt.score} Pts</div>
          </div>
          <div className="text-center p-4 bg-white rounded shadow-sm border border-gray-100 text-green-600">
            <div className="text-gray-500 text-sm mb-1">Correct</div>
            <div className="text-2xl font-bold">{attempt.correct_answers}</div>
          </div>
          <div className="text-center p-4 bg-white rounded shadow-sm border border-gray-100 text-red-600">
            <div className="text-gray-500 text-sm mb-1">Incorrect</div>
            <div className="text-2xl font-bold">{attempt.incorrect_answers}</div>
          </div>
          <div className="text-center p-4 bg-white rounded shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Time Taken</div>
            <div className="text-2xl font-bold text-gray-800">{formatTime(attempt.time_taken_seconds)}</div>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Detailed Review</h2>
      <div className="space-y-6">
        {attempt.answers.map((answer, index) => {
          const question = answer.questions;
          const selectedOption = answer.options; // What the student picked
          const correctOption = question.options.find(opt => opt.is_correct); // What the right answer was

          return (
            <div key={answer.id} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${answer.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex-1 pr-4">
                  <span className="text-gray-500 mr-2">{index + 1}.</span> 
                  {question.question_text}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${answer.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {answer.is_correct ? `+${question.marks} Points` : '0 Points'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                <div className={`p-3 rounded-md border ${answer.is_correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  {selectedOption ? selectedOption.option_text : <span className="italic">Left Unanswered</span>}
                </div>
              </div>

              {!answer.is_correct && correctOption && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                  <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-gray-800 font-medium">
                    {correctOption.option_text}
                  </div>
                </div>
              )}

              {question.explanation && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Explanation:</p>
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={() => navigate('/student/history')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
        >
          Back to My History
        </button>
      </div>

    </div>
  );
};

export default ResultDetails;