import express from 'express';
import transactionRouter from './route/transaction.router.js';
const app = express();
// JSON parser
app.use(express.json());
// Mount router at /api
app.use('/api', transactionRouter);
// Root route
app.get('/', (req, res) => res.send('Stock Backend Lambda running!'));
export default app;
