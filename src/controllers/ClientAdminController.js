import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';
import { v4 as uuidv4 } from "uuid";

/**
 * Salary Hero can add a client admin for a company
 */
const ClientAdminController = {
  addClientAdminForCompany: async (req, res) => {
    const {
      companyId,
      username,
      firstName,
      lastName,
      password,
      salary,
    } = req.body;

    /**
     * Validate the input.
     * Improvement: use zod library to validate the data.
     */
    if (!username || !firstName || !lastName || !password || !salary) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide companyId, username, first name, last name, password and salary.'
      });
    }

    try {
      const {
        username: createdUsername,
      } = req.user;

      const id = uuidv4();
      // For the simplicity purpose, the password is plain text.
      // For real production code, the password should be encrypted by a library such as bcrypt
      // This code can be refactored
      console.log(`Start creating a new client admin for a company`, {
        companyId,
        username,
        firstName,
        lastName,
        password,
        salary,
      });

      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `INSERT INTO employees(username, first_name, last_name, password, salary, is_admin, company_id, created_by, created_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const result = await client.query(sql, [
          username,
          firstName,
          lastName,
          password,
          salary,
          true,
          companyId,
          createdUsername,
          new Date(),
        ]);
        return result;
      });

      const newRecord = {
        username,
        firstName,
        lastName,
        password,
        salary,
        isAdmin: true,
        companyId,
      };
      console.log('New record is created', newRecord);
      return res.status(HttpStatus.CREATED).send(newRecord);
    } catch (e) {
      console.log(`An error occurs while creating a new client admin for company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.detail
      });
    }
  }
}

export default ClientAdminController;