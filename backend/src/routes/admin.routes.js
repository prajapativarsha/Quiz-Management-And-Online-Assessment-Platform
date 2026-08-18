const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware.js");
const verifyToken = require('../middleware/auth.middleware.js');
const { isAdmin } = require('../middleware/role.middleware.js');
const adminController = require("../controllers/admin.controller.js");
const { validate } = require("../middleware/validate.middleware.js");
const { updateRoleSchema } = require("../validators/admin.validator.js");
const { getPlatformAnalytics } = require("../controllers/admin.controller.js");

router.use(authMiddleware, isAdmin); // protect all admin routes

router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});
router.get("/stats", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/role", validate(updateRoleSchema), adminController.updateUserRole);
// Route: GET /api/admin/analytics
router.get("/analytics", verifyToken, isAdmin, getPlatformAnalytics);



module.exports = router;
