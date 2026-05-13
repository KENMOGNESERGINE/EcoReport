const amqp = require('amqplib');

let instance = null;

const connect = async () => {
  if (instance) {
    return instance;
  }
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL
    );
    const channel = await connection.createChannel();
    console.log('RabbitMQ connection created');
    instance = channel;
    return instance;
  } catch (err) {
    console.error('RabbitMQ connection failed:', err);
    throw err;
  }
};

const getChannel = async () => {
  if (!instance) {
    await connect();
  }
  return instance;
};

const publishEvent = async (queue, message) => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
    );
    console.log(
      `Event published to ${queue}:`,
      message
    );
  } catch (err) {
    console.error('Failed to publish event:', err);
    throw err;
  }
};

const consumeEvent = async (queue, callback) => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(
          msg.content.toString()
        );
        callback(content);
        channel.ack(msg);
      }
    });
    console.log(`Listening for events on ${queue}`);
  } catch (err) {
    console.error('Failed to consume event:', err);
    throw err;
  }
};

module.exports = {
  connect,
  publishEvent,
  consumeEvent,
};