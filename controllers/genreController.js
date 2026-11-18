const { Genre } = require("../models");

exports.getAllGenres = async (req, res) => {
	const genres = await Genre.findAll({ order: [["name", "ASC"]] });
	res.json(genres);
};
