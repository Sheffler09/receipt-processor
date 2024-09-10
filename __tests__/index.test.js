const http = require('http');
const request = require('supertest');

const { DEFAULT_PORT } = require('../constants');
const app = require('../index');

const exampleReceipt1 = require('./data/example-receipt-1.json');
const exampleReceipt2 = require('./data/example-receipt-2.json');

let server;
let receiptId1;
let receiptId2;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen({ port: DEFAULT_PORT }, done);
})

afterAll((done) => {
  server.close(done);
})

describe('POST /receipts/process', () => {
  it('should process example-receipt-1 successfully and return a uuid', async () => {
    receiptId1 = await processReceipt(exampleReceipt1);
  });

  it('should process example-receipt-2 successfully and return a uuid', async () => {
    receiptId2 = await processReceipt(exampleReceipt2);
  });
});

describe('GET /receipts/:id/points', () => {
  it('should return valid points for example-receipt-1', async () => {
    await checkReceiptPoints(receiptId1, 28); // Value provided in the exercise.
  });

  it('should return valid points for example-receipt-2', async () => {
    await checkReceiptPoints(receiptId2, 109); // Value provided in the exercise.
  });

  it('should return a 404 status code for IDs without a matching receipt', async () => {
    const res = await request(app).get('/receipts/fake-id/points');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'No receipt found for that id');
  });
});

async function processReceipt(receiptData) {
  const res = await request(app)
    .post('/receipts/process')
    .send(receiptData);

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('id');
  expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/); // UUID v4.

  return res.body.id;
}

async function checkReceiptPoints(receiptId, expectedPoints) {
  const res = await request(app).get(`/receipts/${receiptId}/points`);

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('points', expectedPoints);
}