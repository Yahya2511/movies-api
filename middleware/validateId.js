module.exports = (req, res, next, value) => {
	const isNumber = /^\d+$/.test(value);

	if (!isNumber || Number(value) < 1 || Number(value) > 2147483647) {
		return res.status(400).json({ message: "Invalid id" });
	}

	next();
};
