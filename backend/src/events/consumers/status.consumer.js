const broker = require('../broker');

const startStatusConsumer = async () => {
  console.log('Status consumer starting...');

  await broker.consumeEvent(
    'report.status_changed',
    async (event) => {
      console.log(`
        STATUS NOTIFICATION:
        Report #${event.reportId}
        status changed to: ${event.status}
        Notifying citizen #${event.userId}...
      `);
    }
  );

  console.log('✅ Status consumer ready');
};

module.exports = startStatusConsumer;