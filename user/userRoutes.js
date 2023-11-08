const express = require('express');
const router = express.Router();
const User= require('./userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const user= new User({
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

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

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

router.get('/create-post', async (req, res) => {
    try {
      const otherUsers = await User.find({ _id: { $nin: req._id } });
      res.status(200).json(otherUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching other users' });
    }
  });

  router.get('/get-user', async (req, res) => {
    try {
      console.log(req.body);
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
          throw new Error('User not found.');
        }
        const userId = user._id;
        console.log(userId, 'hi');
      res.status(200).json({ userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching other users' });
    }
  });

  router.get('/g', async (req, res) => {
    res.status(200).json({message:"ok"})
  });

module.exports = router;
