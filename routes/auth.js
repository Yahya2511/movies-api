const express = require("express");

const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const { requireLogin } = require("../middleware/auth");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

router.get("/me", requireLogin, authController.me);

module.exports = router;
