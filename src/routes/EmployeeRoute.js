import express from 'express';
const router = express.Router();
import EmployeeController from '../controllers/EmployeeController.js';

router.post('/', EmployeeController.createEmployee);
router.put('/:username', EmployeeController.updateEmployee);
router.delete('/:username', EmployeeController.deleteEmployee);
router.get('/:username', EmployeeController.getEmployeeByUsername);
router.post('/import', EmployeeController.importEmployees);


export default router;