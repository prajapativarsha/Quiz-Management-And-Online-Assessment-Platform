import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService'; 

const QuizDiscovery = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedQuizzes = async () => {
      try {
        // This utilizes the getPublishedQuizzes service we built in Step 2
        const data = await quizService.getPublishedQuizzes();
        setQuizzes(data);
        setFilteredQuizzes(data);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedQuizzes();
  }, []);

  // Filter Logic: Runs whenever search, difficulty, category, or base quizzes change
  useEffect(() => {
    let result = quizzes;

    if (searchTerm) {
      result = result.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter) {
      result = result.filter((quiz) => quiz.difficulty === difficultyFilter);
    }

    if (categoryFilter) {
      // Assumes your backend includes relational category data (quiz.categories.name)
      result = result.filter((quiz) => quiz.categories?.name === categoryFilter);
    }

    setFilteredQuizzes(result);
  }, [searchTerm, difficultyFilter, categoryFilter, quizzes]);

  // Extract unique categories from the loaded quizzes to populate the dropdown dynamically
  const uniqueCategories = [...new Set(quizzes.map(q => q.categories?.name).filter(Boolean))];

  if (loading) return <div className="text-center mt-10 text-xl">Loading available quizzes...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Quizzes</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search quizzes by title..."
          className="flex-1 border border-gray-300 rounded-md p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="border border-gray-300 rounded-md p-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-md p-2"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No quizzes match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 p-6 flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{quiz.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                  {quiz.categories?.name || 'General'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                {quiz.description || "No description provided for this quiz."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
                <div><strong>Difficulty:</strong> {quiz.difficulty}</div>
                <div><strong>Duration:</strong> {quiz.duration_minutes} mins</div>
                <div><strong>Passing Score:</strong> {quiz.passing_score}%</div>
                <div><strong>Attempts Allowed:</strong> {quiz.max_attempts}</div>
              </div>
              
              <button
                onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                View Details
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizDiscovery;