const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {
	const { name, email, password } = req.body;

	// 1. is the email already used?
	const existing = await User.findOne({ where: { email } });
	if (existing) {
		return res.status(409).json({ message: "Email already in use" });
	}

	// 2. hash the password
	const passwordHash = await bcrypt.hash(password, 10);

	// 3. create the user
	const user = await User.create({ name, email, passwordHash });

	// 4. send back the user without the hash
	res.status(201).json({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	});
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	// 1. find the user
	const user = await User.findOne({ where: { email } });

	// 2. check the password (same message for both failures)
	const ok = user && (await bcrypt.compare(password, user.passwordHash));
	if (!ok) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	// 3. create the token
	const token = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" },
	);

	res.json({ token });
};

exports.me = async (req, res) => {
	const user = await User.findByPk(req.user.id, {
		attributes: ["id", "name", "email", "role"],
	});

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	res.json(user);
};