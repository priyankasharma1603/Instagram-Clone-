const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requiredLogin');
const {
    JWT_SECRET
} = require('../keys');
// Access JWT_SECRET from environment variables


// Basic route for testing
router.get('/', (req, res) => {
    res.send("Hello");
});

// Protected route
router.get('/protected', requireLogin, (req, res) => {
    res.send("Hello user");
});

// Sign up route
router.post('/signup', (req, res) => {
    const {
        name,
        email,
        password,
        pic
    } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({
            error: "Please add all fields"
        });
    }

    User.findOne({
            email: email
        })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    error: "User already exists with that email"
                });
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic: pic
                    });
                    user.save()
                        .then(() => {
                            res.json({
                                message: "Saved successfully"
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({
                                error: "Failed to save user"
                            });
                        });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({
                        error: "Error hashing password"
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                error: "Error finding user"
            });
        });
});

// Sign in route
router.post('/signin', (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            error: "Please add email and password"
        });
    }

    User.findOne({
            email: email
        })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({
                    error: "Invalid email or password"
                });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({
                            _id: savedUser._id
                        }, JWT_SECRET);
                        const {
                            _id,
                            name,
                            email,
                            followers,
                            following,
                            pic
                        } = savedUser;
                        res.json({
                            token,
                            user: {
                                _id,
                                name,
                                email,
                                followers,
                                following,
                                pic
                            }
                        });
                    } else {
                        return res.status(422).json({
                            error: "Invalid email or password"
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({
                        error: "Error comparing password"
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                error: "Error finding user"
            });
        });
});

// Export the router
module.exports = router;
