import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  },
];

const app = express();
const client = createClient();
const PORT = 1245;

// Promisify Redis commands
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

/**
 * Finds and returns an item by its itemId.
 * @param {number} id - The itemId to search for.
 * @returns {Object|undefined} The item object if found, undefined otherwise.
 */
const getItemById = (id) => {
  return listProducts.find(item => item.itemId === id);
};

/**
 * Sets the reserved stock for a given item.
 * @param {number} itemId - The itemId of the item.
 * @param {number} stock - The amount of stock to reserve.
 * @returns {Promise<string>} The result of the Redis set operation.
 */
const reserveStockById = async (itemId, stock) => {
  return setAsync(`item.${itemId}`, stock);
};

/**
 * Retrieves the reserved stock for a given item.
 * @param {number} itemId - The itemId of the item.
 * @returns {Promise<string>} The reserved stock amount from Redis.
 */
const getCurrentReservedStockById = async (itemId) => {
  return getAsync(`item.${itemId}`);
};

// Endpoint to get list of all products
app.get('/list_products', (_, res) => {
  res.json(listProducts.map(item => ({
    itemId: item.itemId,
    itemName: item.itemName,
    price: item.price,
    initialAvailableQuantity: item.initialAvailableQuantity
  })));
});

// Endpoint to get details of a specific product
app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = productItem.initialAvailableQuantity - parseInt(reservedStock || 0);

    res.json({
      itemId: productItem.itemId,
      itemName: productItem.itemName,
      price: productItem.price,
      initialAvailableQuantity: productItem.initialAvailableQuantity,
      currentQuantity: currentQuantity
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to reserve stock for a specific product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentReserved = parseInt(reservedStock || 0);

    if (currentReserved >= productItem.initialAvailableQuantity) {
      res.json({ status: 'Not enough stock available', itemId: itemId });
    } else {
      await reserveStockById(itemId, currentReserved + 1);
      res.json({ status: 'Reservation confirmed', itemId: itemId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to reset product stock in Redis
const resetProductsStock = async () => {
  await Promise.all(listProducts.map(item => setAsync(`item.${item.itemId}`, 0)));
};

// Start the server and reset product stock
app.listen(PORT, async () => {
  await resetProductsStock();
  console.log(`API available on localhost port ${PORT}`);
});

export default app;

