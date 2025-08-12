const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import the routers
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the routers for handling API requests
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
