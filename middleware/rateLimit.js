const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // 5 failed attempts per email
	skipSuccessfulRequests: true, // only failed logins count
	keyGenerator: (req) => req.body.email,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: "Too many attempts, try again in 15 minutes" },
});
