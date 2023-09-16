const {Router}= require('express');
const mongoose= require('mongoose');
const otherDbConnection = mongoose.createConnection('mongodb://localhost/linkedin-user');
const router= Router();
const authMiddleware= require('./authMiddleware.js');
const Notification= require('./notificationModel.js');
const User= require('../user/userModel.js');

router.get("/user/notification",authMiddleware.authenticate, async (req, res) => {
  try {
    const us= User.User;
    const user = await us.findOne({ email: req.email });
    if (!user) {
      throw new Error('User not found.');
    }
    
    const userId = user._id;
    const no= Notification.Notification;
    const notifications = await no.find({ userId }).sort({ createdAt: -1 }).exec();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});

router.delete('/user/notification/:id',authMiddleware.authenticate, async (req, res) => {
  try {
    const no= Notification.Notification;
    const deletedNotification = await no.findByIdAndDelete(req.params.id);
    
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
module.exports= router;
  