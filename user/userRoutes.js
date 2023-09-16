const express = require('express');
const router = express.Router();
const User= require('./userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/user/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const us= User.User;
        const user = new us({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashed
        });

        const result = await user.save();

        res.status(201).json({
            message: 'Registration successful'
        });
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error });
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const us= User.User;
        const user = await us.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'No user found'
            });
        }

        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }

        const accessToken = jwt.sign(user.toJSON(), 'secret', { expiresIn: '1h' });

        res.json({
            token: accessToken,
            _id: user._id,
            message: 'Login successful',
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        });
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error });
    }
});

module.exports = router;
