const { Rating, Movie, User } = require("../models");

exports.getMovieRatings = async (req, res) => {
	const movie = await Movie.findByPk(req.params.movieId);
	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	const ratings = await Rating.findAll({
		where: { MovieId: movie.id },
		include: { model: User, attributes: ["id", "name"] },
	});

	res.json(ratings);
};

exports.getUserRating = async (req, res) => {
	const rating = await Rating.findOne({
		where: {
			MovieId: req.params.movieId,
			UserId: req.params.userId,
		},
	});

	if (!rating) {
		return res.status(404).json({ message: "Rating not found" });
	}

	res.json(rating);
};

exports.createRating = async (req, res) => {
	const movie = await Movie.findByPk(req.params.movieId);
	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	const existing = await Rating.findOne({
		where: { MovieId: movie.id, UserId: req.user.id },
	});
	if (existing) {
		return res.status(409).json({ message: "You already rated this movie" });
	}

	const rating = await Rating.create({
		rate: req.body.rate,
		comment: req.body.comment,
		MovieId: movie.id,
		UserId: req.user.id,
	});

	res.status(201).json(rating);
};

exports.updateMyRating = async (req, res) => {
	const rating = await Rating.findOne({
		where: { MovieId: req.params.movieId, UserId: req.user.id },
	});
	if (!rating) {
		return res.status(404).json({ message: "Rating not found" });
	}

	await rating.update(req.body);
	res.json(rating);
};

exports.deleteMyRating = async (req, res) => {
	const rating = await Rating.findOne({
		where: { MovieId: req.params.movieId, UserId: req.user.id },
	});
	if (!rating) {
		return res.status(404).json({ message: "Rating not found" });
	}

	await rating.destroy();
	res.status(204).send();
};
