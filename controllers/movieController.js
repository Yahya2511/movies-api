const { Op } = require("sequelize");

const { Movie } = require("../models");

exports.getAllMovies = async (req, res, next) => {
	const { name } = req.query;
	const where = {};

	if (name) {
		where.name = { [Op.iLike]: `%${name}%` };
	}

	const movies = await Movie.findAll({ where });
	res.json(movies);
};

exports.getMovieById = async (req, res, next) => {
	const movie = await Movie.findByPk(req.params.id);

	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	res.json(movie);
};

exports.createMovie = async (req, res) => {
	const movie = await Movie.create(req.body);
	res.status(201).json(movie);
};

exports.updateMovie = async (req, res) => {
	const movie = await Movie.findByPk(req.params.id);

	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	await movie.update(req.body);
	res.json(movie);
};

exports.deleteMovie = async (req, res) => {
	const movie = await Movie.findByPk(req.params.id);

	if (!movie) {
		return res.status(404).json({ message: "Movie not found" });
	}

	await movie.destroy();
	res.status(204).send();
};
