const broker = require('../broker');

const startNotificationConsumer = async () => {
  console.log('Notification consumer starting...');

  await broker.consumeEvent(
    'report.submitted',
    async (event) => {
      console.log('New waste report received:', event);

      // Simulate sending notification
      // to nearby associations
      console.log(`
        NOTIFICATION SENT:
        New waste report #${event.reportId}
        submitted by user #${event.userId}
        at location:
        lat: ${event.latitude}
        lng: ${event.longitude}
        waste type: ${event.wasteType}
        Notifying nearby associations...
      `);

      // In production this would:
      // → find associations near GPS location
      // → send SMS via Twilio
      // → send push notification via FCM
      // → send email via SendGrid
    }
  );

  console.log('✅ Notification consumer ready');
};

module.exports = startNotificationConsumer;