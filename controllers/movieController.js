const { Op, Sequelize } = require("sequelize");

const { Movie, Rating } = require("../models");

const withAverage = {
	attributes: {
		include: [
			[
				Sequelize.literal(
					`(SELECT ROUND(AVG("rate"), 1) FROM "Ratings" WHERE "Ratings"."MovieId" = "Movie"."id")`,
				),
				"averageRating",
			],
		],
	},
};

const sortOptions = {
	name: [["name", "ASC"]],
	newest: [["id", "DESC"]],
	length: [["lengthMin", "ASC"]],
	rating: [[Sequelize.literal('"averageRating"'), "DESC NULLS LAST"]],
};

exports.getAllMovies = async (req, res) => {
	const { name, director, sort } = req.query;
	const page = Math.max(parseInt(req.query.page) || 1, 1);
	const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 5);

	const where = {};
	if (name) {
		where.name = { [Op.iLike]: `%${name}%` };
	}
	if (director) {
		where.director = { [Op.iLike]: `%${director}%` };
	}

	const { rows, count } = await Movie.findAndCountAll({
		where,
		...withAverage,
		order: sortOptions[sort] || [["id", "ASC"]],
		limit,
		offset: (page - 1) * limit,
	});

	res.json({
		data: rows,
		page,
		limit,
		total: count,
		totalPages: Math.ceil(count / limit),
	});
};

exports.getMovieById = async (req, res) => {
	const movie = await Movie.findByPk(req.params.id, withAverage);

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
