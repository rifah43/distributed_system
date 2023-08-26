const mongoose = require('mongoose');
const User = require('./userModel');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

module.exports.getNotification = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.email });
      if (!user) {
        throw new Error('User not found.');
      }
      
      const userId = user._id;
  
      const notifications = await Notification.find({ userId:{ $ne: userId } }).sort({ createdAt: -1 }).exec();
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      res.status(500).json({ message: 'Error retrieving notifications' });
    }
  };

  module.exports.deleteNotification = async (req, res) => {
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
  };
  