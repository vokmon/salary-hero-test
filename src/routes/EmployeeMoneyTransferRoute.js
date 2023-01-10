import express from 'express';
const router = express.Router();
import EmployeeMoneyTransferController from '../controllers/EmployeeMoneyTransferController.js';

/**
 * @swagger
 * tags:
 *   name: EmployeeMoneyTransfer
 *   description: Employees resource of a company
 */

/**
 * @swagger
 * /employee-money-transfer/transfer:
 *   post:
 *     summary: Employee can request for a money transfer
 *     tags: [EmployeeMoneyTransfer]
 *     security:
 *      - basicAuth: []
 *     parameters: [
 *        { name: "companyId", in: "header", type: "string", description: "Company Id" }
 *     ]
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 example:
 *                  transferAmount: 10
 *     responses:
 *       200:
 *         description: Success. The transaction is completed.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.post('/transfer', EmployeeMoneyTransferController.transferMoney);


export default router;