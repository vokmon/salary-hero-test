import express from 'express';
const router = express.Router();
import ClientAdminController from '../controllers/ClientAdminController.js';

router.post('/', ClientAdminController.addClientAdminForCompany);


export default router;