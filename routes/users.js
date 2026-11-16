const express = require("express");

const userController = require("../controllers/userController");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const validateId = require("../middleware/validateId");

const router = express.Router();

router.param("id", validateId);

router.get("/", requireLogin, requireAdmin, userController.getAllUsers);
router.delete("/:id", requireLogin, requireAdmin, userController.deleteUser);

module.exports = router;
