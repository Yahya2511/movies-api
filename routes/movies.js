const express = require("express");

const movieController = require("../controllers/movieController");
const { requireLogin, requireAdmin } = require("../middleware/auth");
const ratingController = require("../controllers/ratingController");

const validate = require("../middleware/validate");
const {
	createRatingSchema,
	updateRatingSchema,
} = require("../validators/ratingValidator");

const validateId = require("../middleware/validateId");
const {
	createMovieSchema,
	updateMovieSchema,
} = require("../validators/movieValidator");

const router = express.Router();

router.param("id", validateId);
router.param("movieId", validateId);
router.param("userId", validateId);

router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);

router.post(
	"/",
	requireLogin,
	requireAdmin,
	validate(createMovieSchema),
	movieController.createMovie,
);
router.put(
	"/:id",
	requireLogin,
	requireAdmin,
	validate(updateMovieSchema),
	movieController.updateMovie,
);
router.delete("/:id", requireLogin, requireAdmin, movieController.deleteMovie);

router.get("/:movieId/ratings", ratingController.getMovieRatings);
router.get("/:movieId/ratings/:userId", ratingController.getUserRating);

router.post(
	"/:movieId/ratings",
	requireLogin,
	validate(createRatingSchema),
	ratingController.createRating,
);
router.put(
	"/:movieId/ratings",
	requireLogin,
	validate(updateRatingSchema),
	ratingController.updateMyRating,
);
router.delete(
	"/:movieId/ratings",
	requireLogin,
	ratingController.deleteMyRating,
);

module.exports = router;
