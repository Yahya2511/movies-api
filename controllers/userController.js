const { User } = require("../models");

exports.getAllUsers = async (req, res) => {
	const users = await User.findAll({
		where: { role: "user" },
		attributes: { exclude: ["passwordHash"] },
	});
	res.json(users);
};

exports.deleteUser = async (req, res) => {
	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	if (user.role === "admin") {
		return res.status(403).json({ message: "Admins cannot be deleted" });
	}

	await user.destroy();
	res.status(204).send();
};
