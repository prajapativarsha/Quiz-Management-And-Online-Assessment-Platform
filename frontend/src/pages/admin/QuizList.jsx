import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService.js'; 

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      setError("Failed to load quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.");
    
    if (isConfirmed) {
      try {
        await quizService.deleteQuiz(id);
        
        // Update the local state to remove the deleted quiz instantly 
        // without needing to refresh the page or make another GET request.
        setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      } catch (err) {
        console.error("Failed to delete quiz:", err);
        alert("Failed to delete the quiz. Please try again.");
      }
    }
  };


  const handleEdit = (id) => {
    // Navigate to the edit route, passing the quiz ID in the URL
    navigate(`/admin/quizzes/edit/${id}`);
  };

  
  const handleTogglePublish = async (id, currentStatus) => {
    try {
      // Determine the new status
      const newStatus = currentStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
      
      // Call the PATCH API endpoint
      await quizService.updateQuizStatus(id, newStatus);
      
      // Update the local state to reflect the new status in the UI instantly
      setQuizzes(quizzes.map((quiz) => 
        quiz.id === id ? { ...quiz, status: newStatus } : quiz
      ));
    } catch (err) {
      console.error("Failed to update quiz status:", err);
      alert("Failed to update the quiz status. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading quizzes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Management</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => navigate("/admin/quizzes/create")}
        >
          + Create New Quiz
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b">Quiz Title</th>
              <th className="py-3 px-6 border-b">Category</th>
              <th className="py-3 px-6 border-b">Difficulty</th>
              <th className="py-3 px-6 border-b">Duration</th>
              <th className="py-3 px-6 border-b">Status</th>
              <th className="py-3 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No quizzes found. Create your first one!
                </td>
              </tr>
            ) : (
              quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium text-gray-900"><button 
                      onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                      className="text-black-500 hover:text-blue-700 px-2"
                    >
                    {quiz.title}
                    </button></td>
                  <td className="py-3 px-6">{quiz.categories?.name || 'N/A'}</td>
                  <td className="py-3 px-6">{quiz.difficulty}</td>
                  <td className="py-3 px-6">{quiz.duration_minutes} min</td>
                  <td className="py-3 px-6">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      quiz.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-700' 
                        : quiz.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center flex justify-center space-x-2">
                    <button 
                      onClick={() => handleEdit(quiz.id)}
                      className="text-blue-500 hover:text-blue-700 px-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleTogglePublish(quiz.id, quiz.status)}
                      className="text-indigo-500 hover:text-indigo-700 px-2"
                    >
                      {quiz.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizList;