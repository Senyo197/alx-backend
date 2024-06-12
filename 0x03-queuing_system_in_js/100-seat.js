import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

const app = express();
const client = createClient();
const queue = createQueue();
const INITIAL_SEATS_COUNT = 50;
let reservationEnabled = true;
const PORT = 1245;

const reserveSeat = async (number) => {
  return promisify(client.SET).bind(client)('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  return promisify(client.GET).bind(client)('available_seats');
};

app.get('/available_seats', async (_, res) => {
  try {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: parseInt(numberOfAvailableSeats) });
  } catch (error) {
    console.error('Error fetching available seats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/reserve_seat', async (_, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  try {
    const job = queue.create('reserve_seat');

    job.on('failed', (err) => {
      console.log('Seat reservation job', job.id, 'failed:', err.message || err.toString());
    });

    job.on('complete', () => {
      console.log('Seat reservation job', job.id, 'completed');
    });

    job.save();
    res.json({ status: 'Reservation in process' });
  } catch (error) {
    console.error('Error creating reservation job:', error);
    res.status(500).json({ status: 'Reservation failed' });
  }
});

app.get('/process', (_, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      const currentAvailableSeats = parseInt(availableSeats);

      if (currentAvailableSeats === 0) {
        reservationEnabled = false;
        throw new Error('Not enough seats available');
      }

      await reserveSeat(currentAvailableSeats - 1);

      if (currentAvailableSeats - 1 === 0) {
        reservationEnabled = false;
      }

      done();
    } catch (error) {
      console.error('Error processing reservation job:', error);
      done(error);
    }
  });
});

const resetAvailableSeats = async (initialSeatsCount) => {
  return promisify(client.SET).bind(client)('available_seats', initialSeatsCount);
};

app.listen(PORT, async () => {
  try {
    await resetAvailableSeats(INITIAL_SEATS_COUNT);
    reservationEnabled = true;
    console.log(`API available on localhost port ${PORT}`);
  } catch (error) {
    console.error('Error initializing available seats:', error);
  }
});

export default app;

