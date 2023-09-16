const cron = require('node-cron');
const Notification = require('./notificationModel.js');

  function scheduleNotificationCleanupJob() {
    cron.schedule('0 */4 * * *', async () => { 
      try {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        const no = Notification.Notification
        await no.deleteMany({ createdAt: { $lt: oneHourAgo } });
        console.log('Notification cleanup job completed.');
      } catch (error) {
        console.error('Error cleaning notifications:', error);
      }
    });
  }
module.exports = scheduleNotificationCleanupJob;
