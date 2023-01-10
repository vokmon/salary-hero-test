import express from 'express';
const router = express.Router();
import ClientAdminController from '../controllers/ClientAdminController.js';

/**
 * @swagger
 * tags:
 *   name: ClientAdmin
 *   description: Client Admin of a company
 */
/**
 * @swagger
 * /client-admin:
 *   post:
 *     summary: Create a new client admin for a company
 *     tags: [ClientAdmin]
 *     security:
 *      - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *              companyId: 397d70d6-dfae-4082-9a19-a30de62be9b3
 *              username: userx1
 *              firstName: ufx1
 *              lastName: ulx1
 *              password: 11111
 *              salary: 10000
 *     responses:
 *       201:
 *         description: The created company.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.post('/', ClientAdminController.addClientAdminForCompany);


export default router;