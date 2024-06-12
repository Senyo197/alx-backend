import { promisify } from 'util';
import { createClient, print } from 'redis';

// Create a Redis client
const client = createClient();

// Event listener for error event
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Function to set a new school value in Redis
const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print);
};

// Function to display a school value from Redis using async/await
const displaySchoolValue = async (schoolName) => {
  const getAsync = promisify(client.GET).bind(client);
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error('Error retrieving value:', err);
  }
};

// Main function to run the sequence
async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

// Event listener for connect event
client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});

// Connect to the Redis server
client.connect();
