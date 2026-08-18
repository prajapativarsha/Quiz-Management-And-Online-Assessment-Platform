const prisma = require('../config/prisma');

// Fetch all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Fetch a single category by its id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await prisma.categories.create({
      data: { name, description },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.categories.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};