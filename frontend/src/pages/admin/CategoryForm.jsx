import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService.js';

const CategoryForm = ({ categoryId }) => {
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const isEditMode = Boolean(categoryId);

  // Initialize React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEditMode) {
      const loadCategoryData = async () => {
        try {
          const categoryData = await categoryService.getCategoryById(categoryId);
          // Dynamically set form values based on fetched data
          Object.keys(categoryData).forEach(key => {
            setValue(key, categoryData[key]);
          });
        } catch (error) {
          setApiError("Failed to load category details.");
        }
      };
      loadCategoryData();
    }
  }, [categoryId, setValue, isEditMode]);

  // Handle Form Submission (Create or Update)
  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await categoryService.updateCategory(categoryId, data);
        alert('Category updated successfully!');
      } else {
        await categoryService.createCategory(data);
        alert('Category created successfully!');
      }

      // Reset form and state, then refresh the list
      reset();
      navigate('/admin/categories');
    } catch (error) {
      console.error("Failed to save category:", error);
      alert('Error saving category.');
    }
  };

  // Cancel Edit mode
  const handleCancelEdit = () => {
    reset();
    navigate('/admin/categories');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Category' : 'Create New Category'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            {...register("name", { required: "Category name is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., JavaScript"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the category..."
            rows="3"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isEditMode ? 'Update Category' : 'Save Category'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;