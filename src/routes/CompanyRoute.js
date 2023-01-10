import express from 'express';
const router = express.Router();
import CompanyController from '../controllers/CompanyController.js';

router.post('/', CompanyController.createCompany);
router.put('/:id', CompanyController.updateCompany);
router.delete('/:id', CompanyController.deleteCompany);
router.get('/', CompanyController.getAllCompany);
router.get('/:id', CompanyController.getCompanyById);


export default router;