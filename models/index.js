const User = require("./user");
const Movie = require("./movie");
const Rating = require("./rating");
const Playlist = require("./playlist");
const Genre = require("./genre");

// User and Rating
User.hasMany(Rating, { onDelete: "CASCADE" });
Rating.belongsTo(User, { onDelete: "CASCADE" });

// Movie and Rating
Movie.hasMany(Rating, { onDelete: "CASCADE" });
Rating.belongsTo(Movie, { onDelete: "CASCADE" });

// User and Playlist
User.hasMany(Playlist, { onDelete: "CASCADE" });
Playlist.belongsTo(User, { onDelete: "CASCADE" });

// Playlist and Movie (many-to-many)
Playlist.belongsToMany(Movie, { through: "PlaylistMovie" });
Movie.belongsToMany(Playlist, { through: "PlaylistMovie" });

Movie.belongsToMany(Genre, { through: "MovieGenre" });
Genre.belongsToMany(Movie, { through: "MovieGenre" });

module.exports = { User, Movie, Rating, Playlist, Genre };
