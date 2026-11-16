const jwt = require("jsonwebtoken");

exports.requireLogin = (req, res, next) => {
	const header = req.headers.authorization;

	if (!header || !header.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Login required" });
	}

	const token = header.split(" ")[1];

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

exports.requireAdmin = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ message: "Admin only" });
	}
	next();
};
