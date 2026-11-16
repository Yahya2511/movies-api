const { z } = require("zod");

exports.createMovieSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	lengthMin: z.number().int().positive().optional(),
	director: z.string().trim().optional(),
	description: z.string().trim().optional(),
});

exports.updateMovieSchema = exports.createMovieSchema.partial();
