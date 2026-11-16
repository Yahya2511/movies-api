const { Playlist, Movie } = require("../models");

// POST /playlists
exports.createPlaylist = async (req, res) => {
	const playlist = await Playlist.create({
		name: req.body.name,
		UserId: req.user.id,
	});
	res.status(201).json(playlist);
};

exports.getMyPlaylists = async (req, res) => {
	const playlists = await Playlist.findAll({
		where: { UserId: req.user.id },
	});
	res.json(playlists);
};

exports.getPlaylist = async (req, res) => {
	const playlist = await Playlist.findOne({
		where: { id: req.params.id, UserId: req.user.id },
		include: {
			model: Movie,
			through: { attributes: [] }, // hides the PlaylistMovie join data
		},
	});

	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found" });
	}

	res.json(playlist);
};

exports.renamePlaylist = async (req, res) => {
	const playlist = await Playlist.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found" });
	}

	await playlist.update({ name: req.body.name });
	res.json(playlist);
};

exports.deletePlaylist = async (req, res) => {
	const playlist = await Playlist.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found" });
	}

	await playlist.destroy();
	res.status(204).send();
};

exports.addMovie = async (req, res) => {
	const playlist = await Playlist.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});
	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found" });
	}

	const movie = await Movie.findByPk(req.body.movieId);
	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	if (await playlist.hasMovie(movie)) {
		return res.status(409).json({ message: "Movie already in this playlist" });
	}

	await playlist.addMovie(movie);
	res.status(201).json({ message: "Movie added" });
};

exports.removeMovie = async (req, res) => {
	const playlist = await Playlist.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});
	if (!playlist) {
		return res.status(404).json({ message: "Playlist not found" });
	}

	const movie = await Movie.findByPk(req.params.movieId);
	if (!movie || !(await playlist.hasMovie(movie))) {
		return res.status(404).json({ message: "Movie is not in this playlist" });
	}

	await playlist.removeMovie(movie);
	res.status(204).send();
};
