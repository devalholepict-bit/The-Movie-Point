const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'Description not available.',
    },
    movieId: {
      type: String,
      required: [true, 'Please provide a TMDB movie ID'],
      unique: true,
    },
    releaseDate: {
      type: String,
      default: '',
    },
    trailerLink: {
      type: String,
      default: '',
    },
    genre: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['trending', 'popular', 'movie', 'tv', 'people'],
      default: 'movie',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
