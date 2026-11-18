const bcrypt = require("bcrypt");
const sequelize = require("./config/db");
const { User, Movie, Rating, Playlist } = require("./models");

const MOVIE_COUNT = 40; // TMDB returns 20 per page

async function tmdb(path) {
	const res = await fetch(`https://api.themoviedb.org/3${path}`, {
		headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
	});
	if (!res.ok) throw new Error(`TMDB error ${res.status} on ${path}`);
	return res.json();
}

async function importMovies() {
	// 1. get the ids of the top rated movies
	const ids = [];
	for (let page = 1; ids.length < MOVIE_COUNT; page++) {
		const list = await tmdb(`/movie/top_rated?page=${page}`);
		ids.push(...list.results.map((m) => m.id));
	}

	// 2. get the details of each one (runtime, director, ...)
	const details = await Promise.all(
		ids
			.slice(0, MOVIE_COUNT)
			.map((id) => tmdb(`/movie/${id}?append_to_response=credits`)),
	);

	// 3. convert to your Movie shape
	return details.map((d) => ({
		name: d.title,
		lengthMin: d.runtime || null,
		director: d.credits.crew.find((p) => p.job === "Director")?.name || null,
		description: d.overview || null,
		posterUrl: d.poster_path
			? `https://image.tmdb.org/t/p/w500${d.poster_path}`
			: null,
	}));
}

// random whole number from min to max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
	try {
		if (!process.env.TMDB_TOKEN) {
			throw new Error("TMDB_TOKEN is missing in .env");
		}

		console.log("Downloading movies from TMDB...");
		const movieData = await importMovies();

		await sequelize.sync({ force: true });
		console.log("Old data deleted, tables recreated.");

		// users (kept)
		const hash = (p) => bcrypt.hash(p, 10);
		const admin = await User.create({
			name: "Admin",
			email: "admin@mail.com",
			passwordHash: await hash("admin123"),
			role: "admin",
		});
		const normalUsers = [];
		for (const name of ["Bob", "Sara", "Omar", "Lina"]) {
			normalUsers.push(
				await User.create({
					name,
					email: `${name.toLowerCase()}@mail.com`,
					passwordHash: await hash("123456"),
				}),
			);
		}

		// movies
		const movies = await Movie.bulkCreate(movieData);

		// random ratings: each user rates 15 different movies
		const comments = [
			null,
			null,
			"Loved it.",
			"A classic.",
			"Worth watching twice.",
			"Great story.",
		];
		const ratings = [];
		for (const user of [admin, ...normalUsers]) {
			const picked = [...movies].sort(() => Math.random() - 0.5).slice(0, 15);
			for (const movie of picked) {
				ratings.push({
					UserId: user.id,
					MovieId: movie.id,
					rate: random(6, 10),
					comment: comments[random(0, comments.length - 1)],
				});
			}
		}
		await Rating.bulkCreate(ratings);

		// one playlist for Bob
		const favorites = await Playlist.create({
			name: "Favorites",
			UserId: normalUsers[0].id,
		});
		await favorites.addMovies(movies.slice(0, 3));

		console.log(
			`Seed done: ${movies.length} movies, ${ratings.length} ratings.`,
		);
		console.log("Admin: admin@mail.com / admin123");
		console.log("Users: bob, sara, omar, lina @mail.com / 123456");
	} catch (error) {
		console.error("Seeding failed:", error.message);
	} finally {
		await sequelize.close();
	}
}

seed();
