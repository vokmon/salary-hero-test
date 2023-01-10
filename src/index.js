import HttpStatus from 'http-status-codes';

import dotenv from 'dotenv';
dotenv.config();
/**
 * Set up express rest api
 */
import express from 'express';
const app = express();
const port = process.env.PORT;

/**
 * Setup database
 */
import { initDatabaseConnection } from './database/DatabaseConnector.js';
await initDatabaseConnection();

/**
 * Setup routes
 */
import CompanyRoute from './routes/CompanyRoute.js';
import ClientAdminRoute from './routes/ClientAdminRoute.js';
import EmployeeRoute from './routes/EmployeeRoute.js';
import EmployeeMoneyTransferRoute from './routes/EmployeeMoneyTransferRoute.js';

import SuperUserMiddleware from './middlewares/SuperUserMiddleware.js';
import ClientAdminMiddleware from './middlewares/ClientAdminMiddleware.js';
import EmployeeMiddleware from './middlewares/EmployeeMiddleware.js';

import cors from 'cors';
app.use(express.json());
app.use(cors());


app.use('/companies', SuperUserMiddleware.validateSuperUser, CompanyRoute);
app.use('/client-admin', SuperUserMiddleware.validateSuperUser, ClientAdminRoute);
app.use('/employees', ClientAdminMiddleware.validateClientAdmin, EmployeeRoute);
app.use('/employee-transfer', EmployeeMiddleware.validateEmployee, EmployeeMoneyTransferRoute)
app.use('/', (_req, res) => {
  return res.status(HttpStatus.OK).send({
    status: 'ok',
  });
})

app.listen(port, () => {
  console.log(`Start app  ${port}`);
});
