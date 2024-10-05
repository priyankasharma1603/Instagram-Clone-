const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const keys = require('./keys'); // Import keys.js

const app = express();
const PORT = keys.PORT || 5000; // Use the PORT from keys.js

// Connect to MongoDB using the DB_URI from keys.js
mongoose.connect(keys.mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting", err);
});

// Import models
require('./models/user');
require('./models/post');

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

app.listen(PORT, () => {
    console.log("Server is running at", PORT);
});
