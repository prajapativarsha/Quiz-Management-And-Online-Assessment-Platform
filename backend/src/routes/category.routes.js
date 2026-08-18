const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const verifyToken = require('../middleware/auth.middleware.js');
const { isAdmin } = require('../middleware/role.middleware.js');

// Fetch all categories
// GET /api/categories
router.get('/', verifyToken, isAdmin, categoryController.getAllCategories); 

// Fetch a single category by its id
// GET /api/categories/:id
router.get('/:id', verifyToken, isAdmin, categoryController.getCategoryById);


// Create a category
// POST /api/categories
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

// Update a category
// PUT /api/categories/:id
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);

// Delete a category
// DELETE /api/categories/:id
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;