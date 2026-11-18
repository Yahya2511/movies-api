const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");
require("./models"); // loads all models and relationships

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is missing in .env");
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3001" }));

app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/movies", require("./routes/movies"));
app.use("/users", require("./routes/users"));
app.use("/playlists", require("./routes/playlists"));
app.use("/genres", require("./routes/genres"));

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	res.status(status).json({
		message: status === 500 ? "Server error" : err.message,
	});
});

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await sequelize.authenticate();
		console.log("Connected to the database");

		await sequelize.sync();
		console.log("Tables are ready");

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Startup failed:", error.message);
	}
}

start();
