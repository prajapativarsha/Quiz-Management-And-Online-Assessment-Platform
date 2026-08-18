import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import questionService from '../../services/questionService.js'; 

const QuestionManagement = () => {
  const { quizId } = useParams(); // Extract quizId from the URL
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  // Initialize React Hook Form with 4 default options
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      marks: 1,
      difficulty: 'INTERMEDIATE',
      options: [
        { option_text: '', is_correct: false }, 
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "options"
  });

  useEffect(() => {
    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getQuestionsByQuiz(quizId);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Ensure marks is an integer
      const formattedData = {
        ...data,
        marks: parseInt(data.marks, 10),
      };

      if (isEditing) {
        await questionService.updateQuestion(currentQuestionId, formattedData);
        alert('Question updated successfully!');
      } else {
        await questionService.createQuestion(quizId, formattedData);
        alert('Question created successfully!');
      }
      
      handleCancelEdit();
      fetchQuestions(); 
    } catch (error) {
      console.error("Failed to save question:", error);
      alert('Error saving question.');
    }
  };

  const handleEdit = (question) => {
    setIsEditing(true);
    setCurrentQuestionId(question.id);
    setValue('question_text', question.question_text);
    setValue('marks', question.marks);
    setValue('explanation', question.explanation || '');
    setValue('difficulty', question.difficulty || 'Medium');
    setValue('options', question.options); // Populates the nested options array
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert('Error deleting question.');
      }
    }
  };

  const handleCancelEdit = () => {
    reset(); // Resets form to defaultValues (including the 4 blank options)
    setIsEditing(false);
    setCurrentQuestionId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin/quizzes')}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to Quizzes
      </button>
      <h1 className="text-3xl font-bold mb-8">Manage Questions</h1>

      {/* QUESTION BUILDER FORM */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Question' : 'Create New Question'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Main Question Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea 
                {...register("question_text", { required: "Question text is required" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
              {errors.question_text && <p className="text-red-500 text-sm mt-1">{errors.question_text.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Marks</label>
              <input 
                type="number" 
                {...register("marks", { required: true, min: 1 })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select 
                {...register("difficulty")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="EASY">Easy</option>
                <option value="INTERMEDIATE">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
              <textarea 
                {...register("explanation")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
                placeholder="Show this explanation after the quiz is submitted..."
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Options Array */}
          <div>
            <h3 className="text-lg font-medium mb-3">Answers / Options</h3>
            <p className="text-sm text-gray-500 mb-4">Select the radio button next to the correct answer.</p>
            
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <input
                    type="radio"
                    value="true"
                    {...register(`options.${index}.is_correct`)} // Standard HTML radio logic within React Hook Form
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    {...register(`options.${index}.option_text`, { required: "Option text is required" })}
                    placeholder={`Option ${index + 1}`}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* QUESTION LIST */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q.id} className="border p-4 rounded-md bg-gray-50 flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Q{index + 1}: {q.question_text}</h4>
                  <p className="text-sm text-gray-500 mt-1">Marks: {q.marks} | Difficulty: {q.difficulty}</p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {q.options?.map((opt, i) => (
                      <li key={opt.id} className={opt.is_correct ? 'text-green-600 font-semibold' : ''}>
                        {String.fromCharCode(65 + i)}. {opt.option_text} {opt.is_correct && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(q)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions added to this quiz yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;