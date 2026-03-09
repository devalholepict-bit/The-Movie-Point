const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const watchHistoryItemSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String, default: '' },
  mediaType: { type: String, enum: ['movie', 'tv', 'person'], default: 'movie' },
  watchedAt: { type: Date, default: Date.now },
});

const favoriteItemSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  releaseDate: { type: String, default: '' },
  mediaType: { type: String, enum: ['movie', 'tv', 'person'], default: 'movie' },
  addedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    banned: {
      type: Boolean,
      default: false,
    },
    favorites: [favoriteItemSchema],
    watchHistory: [watchHistoryItemSchema],
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
