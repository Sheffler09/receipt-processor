import express, { json } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Express app and listen on the specified port.
const app = express();
app.use(json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Receipt processor is running on port ${PORT}`);
});

// For the exercise, we'll store receipt IDs and their points in memory.
const receipts = {};

// Endpoint to process receipts, generate their IDs, and store their points.
app.post('/receipts/process', (req, res) => {
  const receipt = req.body;
  const id = uuidv4();
  const points = calculatePoints(receipt);

  receipts[id] = points;
  res.json({ id });
});

// Endpoint to retrieve the points for a receipt by its ID.
app.get('/receipts/:id/points', (req, res) => {
  const id = req.params.id;
  const points = receipts[id];

  if (points !== undefined) {
    res.json({ points });
  } else {
    res.status(404).json({ error: 'No receipt found for that id' });
  }
});

// Helper function to calculate points for a given receipt object.
function calculatePoints(receipt) {
  let points = 0;

  // 1 point is given for every alphanumeric character in the retailer name.
  const numAlphanumericCharacters = receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;
  points += numAlphanumericCharacters;

  // 50 points are given if the total is a round dollar amount with no cents.
  const receiptTotal = parseFloat(receipt.total);
  const receiptTotalIsWholeNumber = receiptTotal % 1 === 0;
  if (receiptTotalIsWholeNumber) {
    points += 50;
  }

  // 25 points are given if the total is a multiple of 0.25.
  const receiptTotalIsMultipleOfQuarter = receiptTotal % 0.25 === 0;
  if (receiptTotalIsMultipleOfQuarter) {
    points += 25;
  }

  // 5 points are given for every two items on the receipt.
  const receiptItems = receipt.items;
  const numItemPairs = Math.floor(receiptItems.length / 2);
  points += numItemPairs * 5;

  // If the trimmed length of the item description is a multiple of 3,
  // multiply the price by 0.2 and round up to the nearest integer.
  // The result is the number of points earned.
  for (const item of receiptItems) {
    if (item.shortDescription.trim().length % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2);
    }
  }

  // 6 points are given if the day in the purchase date is odd (format: YYYY-MM-DD).
  const purchaseDay = parseInt(receipt.purchaseDate.split('-')[2]);
  if (purchaseDay % 2 !== 0) {
    points += 6;
  }

  // 10 points are given if 2:00 PM < time of purchase < 4:00 PM. (format: HH:MM (24-hour)).
  // Note: with this format, we can strip out the ':' and compare 1400 < stripped "time" < 1600.
  const CONVERTED_2_PM = 1400;
  const CONVERTED_4_PM = 1600;
  const convertedPurchaseTime = parseInt(receipt.purchaseTime.replace(/:/g, ''));
  if (CONVERTED_2_PM < convertedPurchaseTime && convertedPurchaseTime < CONVERTED_4_PM) {
    points += 10;
  }

  return points;
}