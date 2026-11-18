const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Movie = sequelize.define("Movie", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lengthMin: DataTypes.INTEGER,
	director: DataTypes.STRING,
	description: DataTypes.TEXT,
	posterUrl: {
		type: DataTypes.STRING,
		validate: { isUrl: true },
	},
});

module.exports = Movie;
