import { createClient, print } from 'redis';

// Create a Redis client
const client = createClient();

// Event listener for error event
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Function to update a hash in Redis
const updateHash = (hashName, fieldName, fieldValue) => {
  client.HSET(hashName, fieldName, fieldValue, print);
};

// Function to print a hash from Redis
const printHash = (hashName) => {
  client.HGETALL(hashName, (_err, reply) => {
    if (_err) {
      console.error('Error retrieving hash:', _err);
    } else {
      console.log(reply);
    }
  });
};

// Main function to run the sequence
function main() {
  const hashObj = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  
  // Update the hash with the provided values
  for (const [field, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', field, value);
  }
  
  // Display the hash
  printHash('HolbertonSchools');
}

// Event listener for connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});

// Connect to the Redis server
client.connect();
