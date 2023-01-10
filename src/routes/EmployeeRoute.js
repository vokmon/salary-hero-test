import express from 'express';
const router = express.Router();
import EmployeeController from '../controllers/EmployeeController.js';

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employees resource of a company
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employee]
 *     security:
 *      - basicAuth: []
 *     parameters: [{ name: "companyId", in: "header", type: "string", description: "Company Id" }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *              username: employeeX1
 *              firstName: empXf1,
 *              lastName: empXl1,
 *              password: 11111,
 *              salary: 10000
 *     responses:
 *       201:
 *         description: The created employee.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.post('/', EmployeeController.createEmployee);

/**
 * @swagger
 * /employees/{employeeUsername}:
 *   put:
 *     summary: Update an existing employee
 *     tags: [Employee]
 *     security:
 *      - basicAuth: []
 *     parameters: [
 *        { name: "companyId", in: "header", type: "string", description: "Company Id" },
 *        { name: "employeeUsername", in: "path", type: "string", description: "Employee username" }
 *     ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *              firstName: empXf1
 *              lastName: empXl1
 *              password: 11111
 *              salary: 10000
 *     responses:
 *       200:
 *         description: The updated employee.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.put('/:username', EmployeeController.updateEmployee);

/**
 * @swagger
 * /employees/{employeeUsername}:
 *   delete:
 *     summary: Delete an existing employee
 *     tags: [Employee]
 *     security:
 *      - basicAuth: []
 *     parameters: [
 *        { name: "companyId", in: "header", type: "string", description: "Company Id" },
 *        { name: "employeeUsername", in: "path", type: "string", description: "Employee username" }
 *     ]
 *     responses:
 *       200:
 *         description: The deleted employee.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.delete('/:username', EmployeeController.deleteEmployee);

/**
 * @swagger
 * /employees/{employeeUsername}:
 *   get:
 *     summary: Get an existing employee
 *     tags: [Employee]
 *     security:
 *      - basicAuth: []
 *     parameters: [
 *        { name: "companyId", in: "header", type: "string", description: "Company Id" },
 *        { name: "employeeUsername", in: "path", type: "string", description: "Employee username" }
 *     ]
 *     responses:
 *       200:
 *         description: The employee by username.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.get('/:username', EmployeeController.getEmployeeByUsername);

/**
 * @swagger
 * /employees/import:
 *   get:
 *     summary: Import employees
 *     tags: [Employee]
 *     security:
 *      - basicAuth: []
 *     parameters: [
 *        { name: "companyId", in: "header", type: "string", description: "Company Id" }
 *     ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example: [{
 *                username: "employee3",
 *                firstName: "empf3",
 *                lastName: "empl3",
 *                password: "11111"
 *                salary: 10000
 *            }]
 *     responses:
 *       200:
 *         description: The employee by username.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 */
router.post('/import', EmployeeController.importEmployees);


export default router;