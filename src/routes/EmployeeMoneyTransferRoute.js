import express from 'express';
const router = express.Router();
import EmployeeMoneyTransferController from '../controllers/EmployeeMoneyTransferController.js';

router.post('/transfer', EmployeeMoneyTransferController.transferMoney);


export default router;