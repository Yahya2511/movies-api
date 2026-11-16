const bcrypt = require("bcrypt");
const sequelize = require("./config/db");
const { User, Movie, Rating, Playlist } = require("./models");

const movies = [
	{
		name: "Inception",
		lengthMin: 148,
		director: "Christopher Nolan",
		description: "A thief enters people's dreams to steal secrets.",
	},
	{
		name: "The Godfather",
		lengthMin: 175,
		director: "Francis Ford Coppola",
		description: "The aging head of a crime family hands control to his son.",
	},
	{
		name: "The Dark Knight",
		lengthMin: 152,
		director: "Christopher Nolan",
		description: "Batman faces the Joker in Gotham City.",
	},
	{
		name: "Pulp Fiction",
		lengthMin: 154,
		director: "Quentin Tarantino",
		description: "Several crime stories in Los Angeles intertwine.",
	},
	{
		name: "Spirited Away",
		lengthMin: 125,
		director: "Hayao Miyazaki",
		description: "A girl enters a world of spirits to save her parents.",
	},
	{
		name: "Parasite",
		lengthMin: 132,
		director: "Bong Joon-ho",
		description: "A poor family slowly infiltrates a wealthy household.",
	},
	{
		name: "Interstellar",
		lengthMin: 169,
		director: "Christopher Nolan",
		description: "Astronauts travel through a wormhole to save humanity.",
	},
	{
		name: "The Matrix",
		lengthMin: 136,
		director: "The Wachowskis",
		description: "A hacker discovers reality is a simulation.",
	},
	{
		name: "Forrest Gump",
		lengthMin: 142,
		director: "Robert Zemeckis",
		description: "A kind man lives through decades of American history.",
	},
	{
		name: "Gladiator",
		lengthMin: 155,
		director: "Ridley Scott",
		description: "A betrayed Roman general seeks revenge as a gladiator.",
	},
];

async function seed() {
	try {
		// 1. delete all old data: drops every table and creates it again (ids restart at 1)
		await sequelize.sync({ force: true });
		console.log("Old data deleted, tables recreated.");

		// 2. users
		const admin = await User.create({
			name: "Admin",
			email: "admin@mail.com",
			passwordHash: await bcrypt.hash("admin123", 10),
			role: "admin",
		});
		const bob = await User.create({
			name: "Bob",
			email: "bob@mail.com",
			passwordHash: await bcrypt.hash("123456", 10),
		});

		// 3. movies
		const createdMovies = await Movie.bulkCreate(movies);

		// 4. ratings (one per user per movie)
		await Rating.bulkCreate([
			{
				UserId: bob.id,
				MovieId: createdMovies[0].id,
				rate: 9,
				comment: "Mind-bending, loved it.",
			},
			{
				UserId: bob.id,
				MovieId: createdMovies[1].id,
				rate: 10,
				comment: "A masterpiece.",
			},
			{ UserId: admin.id, MovieId: createdMovies[0].id, rate: 8 },
		]);

		// 5. a playlist for Bob
		const playlist = await Playlist.create({
			name: "Favorites",
			UserId: bob.id,
		});
		await playlist.addMovies([createdMovies[0], createdMovies[1]]);

		console.log("Seed done.");
		console.log("Admin login: admin@mail.com / admin123");
		console.log("User login:  bob@mail.com / 123456");
	} catch (error) {
		console.error("Seeding failed:", error.message);
	} finally {
		await sequelize.close();
	}
}

seed();
