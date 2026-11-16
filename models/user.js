const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true,
		},
	},
	passwordHash: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM("user", "admin"),
		allowNull: false,
		defaultValue: "user",
	},
});

module.exports = User;
