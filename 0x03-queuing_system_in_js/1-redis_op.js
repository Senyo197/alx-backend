import { createClient, print } from 'redis';

// Create a Redis client
const client = createClient();

// Event listener for error event
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event listener for connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to set a new school value in Redis
const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print);
};

// Function to display a school value from Redis
const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (_err, reply) => {
    console.log(reply);
  });
};

// Connect to the Redis server
client.connect();

// Call the functions with given arguments
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
