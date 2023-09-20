const {Router}= require('express');
const mongoose= require('mongoose');
const router= Router();
const authMiddleware= require('./authMiddleware.js');
const Notification= require('./notificationModel.js');
const linkedInUserConnection = mongoose.createConnection('mongodb://mongodb-service1:27017/linkedin-user');

router.get("/user/notification",authMiddleware.authenticate, async (req, res) => {
  try {
    const us= linkedInUserConnection.model('User');
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
  
