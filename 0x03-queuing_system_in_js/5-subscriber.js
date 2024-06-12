import { createClient } from 'redis';

const client = createClient();
const EXIT_MSG = 'KILL_SERVER';

// Event listener for error event
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event listener for connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Subscribe to the channel
client.subscribe('holberton school channel');

// Event listener for message event
client.on('message', (_err, msg) => {
  console.log(msg);
  if (msg === EXIT_MSG) {
    client.unsubscribe();
    client.quit();
  }
});

// Connect to the Redis server
client.connect();
