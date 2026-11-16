const { z } = require("zod");

exports.registerSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z.string().trim().toLowerCase().email("Invalid email"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(26, "Password must be at most 26 characters"),
});

exports.loginSchema = z.object({
	email: z.string().trim().toLowerCase().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});
