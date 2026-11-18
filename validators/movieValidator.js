const { z } = require("zod");

exports.createMovieSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	lengthMin: z.number().int().positive().optional(),
	director: z.string().trim().optional(),
	description: z.string().trim().optional(),
	posterUrl: z.string().trim().url("Invalid URL").optional(),
});

exports.updateMovieSchema = exports.createMovieSchema.partial();
