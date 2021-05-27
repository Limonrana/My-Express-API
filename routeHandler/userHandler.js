const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userSchema = require('../schemas/userSchema');

const User = mongoose.model('User', userSchema);

// Signup all the users
router.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashPassword,
        });
        newUser.save();
        res.status(200).json({
            meassge: 'User singup was succusfull!',
        });
    } catch {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// Login all user and generate auth token
router.post('/login', async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });
        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPassword) {
                // Token Generate
                const userData = {
                    id: user[0]._id,
                    name: user[0].name,
                    username: user[0].username,
                };
                const token = await jwt.sign(userData, process.env.JWT_SECRETKEY, {
                    expiresIn: '1h',
                });
                res.status(200).json({
                    access_token: token,
                    message: 'Login Successful!',
                });
            } else {
                res.status(401).json({
                    error: 'Autheticaion failed!',
                });
            }
        } else {
            res.status(401).json({
                error: 'Autheticaion failed!',
            });
        }
    } catch {
        res.status(401).json({
            error: 'Autheticaion failed!',
        });
    }
});

// POST A Todo
// router.post('/', (req, res) => {});

// PUT Todo
// router.put('/:id', (req, res) => {});

// DELETE Todo
// router.delete('/:id', (req, res) => {});

module.exports = router;
