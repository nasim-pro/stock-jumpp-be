import { Router } from 'express';
import { getLastProcessed, buy, sell, updateLastProcessed, listStocks, topGrowers } from '../controller/db.transaction.controller.js';
import { saveStock } from '../controller/dynamoDBController.js';
import { saveFcmToken, getAllFcmTokens } from '../controller/user.controller.js'

const router = Router();

router.get('/last-processed', getLastProcessed);
router.patch('/last-processed', updateLastProcessed);
router.post('/buy', buy);
router.post('/sell', sell);
router.post('/save-result', saveStock);
router.get('/list-result', listStocks);
router.get('/top-growers', topGrowers);
router.post("/save-fcm-token", saveFcmToken);
router.get("/list-fcm-tokens", getAllFcmTokens);

export default router;
