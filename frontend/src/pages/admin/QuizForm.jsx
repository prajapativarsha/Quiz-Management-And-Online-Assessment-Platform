import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService.js';
import categoryService from '../../services/categoryService.js';

const QuizForm = ({ quizId }) => {
  // Initialize React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [apiError, setApiError] = useState(null);

  const isEditMode = Boolean(quizId);

  // Fetch initial data on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const data = await categoryService.getAllCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setApiError("Could not load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    //If in Edit Mode, fetch the existing quiz data and populate the form
    if (isEditMode) {
      const loadQuizData = async () => {
        try {
          const quizData = await quizService.getQuizById(quizId);
          // Dynamically set form values based on fetched data
          Object.keys(quizData).forEach(key => {
            setValue(key, quizData[key]);
          });

        } catch (error) {
          setApiError("Failed to load quiz details.");
        }
      };
      loadQuizData();
    }
  }, [quizId, setValue, isEditMode]);

  // Form Submit Handler
  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    setApiError(null);
    try {
      if (isEditMode) {
        await quizService.updateQuiz(quizId, data);
      } else {
        await quizService.createQuiz(data);
      }
      reset(); // Clear the form
      navigate('/admin/quizzes'); // Trigger parent callback to close form/navigate
    } catch (error) {
      console.error("Error saving quiz:", error);
      setApiError(error.response?.data?.error || "An error occurred while saving the quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
      </h2>

      {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{apiError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quiz Title *</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              {...register("category_id", { required: "Category is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="text-red-500 text-xs">{errors.category_id.message}</span>}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty *</label>
            <select
              {...register("difficulty", { required: "Difficulty is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select difficulty...</option>
              <option value="EASY">Beginner</option>
              <option value="MEDIUM">Intermediate</option>
              <option value="HARD">Advanced</option>
            </select>
            {errors.difficulty && <span className="text-red-500 text-xs">{errors.difficulty.message}</span>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Minutes) *</label>
            <input
              type="number"
              {...register("duration_minutes", { required: "Duration is required", min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.duration_minutes && <span className="text-red-500 text-xs">{errors.duration_minutes.message}</span>}
          </div>

          {/* Passing Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Passing Percentage (%) *</label>
            <input
              type="number"
              {...register("passing_score", { required: "Passing percentage is required", min: 1, max: 100 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.passing_score && <span className="text-red-500 text-xs">{errors.passing_score.message}</span>}
          </div>

          {/* Max Attempts */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Attempts *</label>
            <input
              type="number"
              {...register("max_attempts", { required: "Max attempts is required", min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.max_attempts && <span className="text-red-500 text-xs">{errors.max_attempts.message}</span>}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail URL (Optional)</label>
            <input
              type="text"
              {...register("thumbnail_url")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/quizzes')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Quiz' : 'Create Quiz')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;