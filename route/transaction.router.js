import { Router } from 'express';
import { getLastProcessed, buy, sell, updateLastProcessed } from '../controller/db.transaction.controller.js';

const router = Router();

router.get('/last-processed', getLastProcessed);
router.patch('/last-processed', updateLastProcessed);
router.post('/buy', buy);
router.post('/sell', sell);
router.post('/dump')

export default router;
