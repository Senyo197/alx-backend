import { createClient } from 'redis';

const client = createClient();

// Event listener for error event
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event listener for connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to publish messages after a specified time
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
};

// Connect to the Redis server
client.connect();

// Publish messages at specified intervals
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
