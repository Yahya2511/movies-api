const { z } = require("zod");

exports.createRatingSchema = z.object({
	rate: z.number().int().min(1).max(10),
	comment: z.string().trim().optional(),
});

exports.updateRatingSchema = z.object({
	rate: z.number().int().min(1).max(10).optional(),
	comment: z.string().trim().optional(),
});
