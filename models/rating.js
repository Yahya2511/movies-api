const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Rating = sequelize.define(
	"Rating",
	{
		rate: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 10,
			},
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		indexes: [{ unique: true, fields: ["UserId", "MovieId"] }],
	},
);

module.exports = Rating;
