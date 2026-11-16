const express = require("express");

const playlistController = require("../controllers/playlistController");

const { requireLogin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");

const {
	playlistSchema,
	addMovieSchema,
} = require("../validators/playlistValidator");

const router = express.Router();

router.use(requireLogin);

router.param("id", validateId);
router.param("movieId", validateId);

router.post("/", validate(playlistSchema), playlistController.createPlaylist);
router.get("/", playlistController.getMyPlaylists);

router.get("/:id", playlistController.getPlaylist);
router.put("/:id", validate(playlistSchema), playlistController.renamePlaylist);
router.delete("/:id", playlistController.deletePlaylist);

router.post(
	"/:id/movies",
	validate(addMovieSchema),
	playlistController.addMovie,
);
router.delete("/:id/movies/:movieId", playlistController.removeMovie);

module.exports = router;
