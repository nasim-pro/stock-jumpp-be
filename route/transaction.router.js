import { Router } from 'express';
import { getLastProcessed, buy, sell, updateLastProcessed, listStocks } from '../controller/db.transaction.controller.js';
import { saveStock } from '../controller/dynamoDBController.js';

const router = Router();

router.get('/last-processed', getLastProcessed);
router.patch('/last-processed', updateLastProcessed);
router.post('/buy', buy);
router.post('/sell', sell);
router.post('/save-result', saveStock);
router.get('/list-result', listStocks);

export default router;
