const { z } = require("zod");

exports.playlistSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(100),
});

exports.addMovieSchema = z.object({
	movieId: z.number().int().positive(),
});
