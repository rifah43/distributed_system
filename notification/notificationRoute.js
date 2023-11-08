const { Router } = require('express');
const mongoose = require('mongoose');
const router = Router();
const authenticateJWT = require('./authMiddleware.js')
const Notification = require('./notificationModel.js');
const axios = require('axios');

router.get('/notification',authenticateJWT.authenticate, async (req, res) => {
  try {
    console.log(req.body);
    const userId = await axios.get('http://user:3001/user/get-user');
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).exec();
    console.log(userId, "hihihi");
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});

router.delete('/notification/:id', async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedNotification) {
      return res.status(404).send({
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
      deletedNotification: deletedNotification,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/notification/get-notifications', async (req, res) => {
  try {
    const notifications = req.body;
    console.log(notifications);
    await Notification.insertMany(notifications);
    res.status(200).json({ message: "Stored" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting notifications' });
  }
});

module.exports = router;
