const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/:id/role", authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;
