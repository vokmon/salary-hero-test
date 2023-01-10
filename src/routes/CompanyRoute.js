import express from 'express';
const router = express.Router();
import CompanyController from '../controllers/CompanyController.js';

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company Resources
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *      - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *              name: Company X1
 *              address: Company X1 address
 *              phone: 829387483
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
router.post('/', CompanyController.createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update an existing company
 *     tags: [Company]
 *     security:
 *      - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *              name: Company X1
 *              address: Company X1 address
 *              phone: 829387483
 *     responses:
 *       200:
 *         description: The updated company.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.put('/:id', CompanyController.updateCompany);
/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete an existing company
 *     tags: [Company]
 *     security:
 *      - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The company is deleted.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.delete('/:id', CompanyController.deleteCompany);
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a specific company
 *     tags: [Company]
 *     security:
 *      - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The specific company.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.get('/:id', CompanyController.getCompanyById);


export default router;