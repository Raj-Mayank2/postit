const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema
const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates a relationship with the User model
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  hashtags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);