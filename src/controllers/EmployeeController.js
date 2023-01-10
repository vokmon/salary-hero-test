import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';

/**
 * A client admin can CRUD an employee for that company
 * Only client admin can perform the CRUD operation for the emplooyees in a company.
 */
const EmployeeController = {
  createEmployee: async (req, res) => {
    const {
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
        message: 'Please provide username, first name, last name, password and salary.'
      });
    }

    const {
      username: clientAdminUser,
      companyId,
    } = req.user;

    try {
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
        clientAdminUser,
      })

      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `INSERT INTO employees(username, first_name, last_name, password, salary, is_admin, company_id, created_by, created_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const result = await client.query(sql, [
          username,
          firstName,
          lastName,
          password,
          salary,
          false,
          companyId,
          clientAdminUser,
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
        companyId,
      };
      console.log('New record is created', newRecord);
      return res.status(HttpStatus.CREATED).send(newRecord);
    } catch (e) {
      console.log(`An error occurs while creating a new employee for company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }

  },

  updateEmployee: async (req, res) => {
    const {
      firstName,
      lastName,
      password,
      salary,
    } = req.body;

    const { username } = req.params;
    /**
     * Validate the input.
     * Improvement: use zod library to validate the data.
     */
    if (!username || !firstName || !lastName || !password || !salary) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide username, password, first name, last name and salary.'
      });
    }

    const {
      username: clientAdminUser,
      companyId,
    } = req.user;

    try {
      console.log(`Start updating an existing user`, {
        companyId,
        username,
        firstName,
        lastName,
        password,
        salary,
        clientAdminUser,
      })

      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `UPDATE employees SET first_name=$1, last_name=$2, password=$3, salary=$4, updated_by=$5, updated_date=$6 where username=$7 and company_id=$8`;

        const result = await client.query(sql, [
          firstName,
          lastName,
          password,
          salary,
          clientAdminUser,
          new Date(),
          username,
          companyId,
        ]);
        return result;
      });

      const updatedRecord = {
        username,
        companyId,
        firstName,
        lastName,
        password,
        salary,
      };
      console.log('Updated record', updatedRecord)
      return res.status(HttpStatus.OK).send(updatedRecord);
    } catch (e) {
      console.log(`An error occurs while updating the user ${username} in the company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },

  deleteEmployee: async (req, res) => {
    const { username } = req.params;
    /**
     * Validate the input.
     */
    if (!username) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide username.'
      });
    }
    try {
      const {
        username: clientAdminUser,
        companyId,
      } = req.user;

      console.log(`Start deleting an existing employee`, {
        clientAdminUser,
        companyId,
      })

      const result = await dbClientPool.queryWithTransaction(async (client) => {
        /**
         * Another option is to set active flag instead of permanently delete the record.
         */
        const sql = `DELETE from employees where username=$1 and company_id=$2`;

        const result = await client.query(sql, [username, companyId]);
        return result;
      });

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: `The employee ${username} in the company ${companyId} does not exist`,
        });
      }
      const deletedRecord = {
        username,
        companyId,
      };
      console.log('Deleted record', deletedRecord)
      return res.status(HttpStatus.OK).send();
    } catch (e) {
      console.log(`An error occurs while deleting employee ${username} in the company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },

  getEmployeeByUsername: async (req, res) => {
    const { username } = req.params;
    /**
     * Validate the input.
     */
    if (!username) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide username.'
      });
    }
    try {
      const {
        companyId,
      } = req.user;

      console.log(`Start getting an existing employee`, {
        username,
        companyId,
      })

      const sql = `Select username, company_id as companyId, first_name as firstName, last_name as lastName, salary from employees where username=$1 and company_id=$2`;

      const result = await dbClientPool.query(sql, [username, companyId]);

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: `The employee ${username} in the company ${companyId} does not exist`,
        });
      }


      const record = result.rows[0];
      console.log('Get record', record);
      return res.status(HttpStatus.OK).send(record);
    } catch (e) {
      console.log(`An error occurs while getting employee ${username} in the company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },

  importEmployees: async (req, res) => {
    const {
      username: clientAdminUser,
      companyId,
    } = req.user;

    try {
      const failedImport = [];
      const successfullImport = [];

      const employees = req.body;
      if (!Array.isArray(employees) || employees.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: `Please provide an array of employees. example: [{ "username": "employee1", "firstName": "empf1", "lastName": "empl1", "password": "11111", "salary": 10000 }]`,
        });
      }


      const passValidationList = [];

      // Validate the object and filter out the object that does not meet the criteria.
      employees.forEach((employee) => {
        const {
          username,
          firstName,
          lastName,
          password,
          salary,
        } = employee;

        if (!username || !firstName || !lastName || !password || !salary) {
          failedImport.push({
            data: employee,
            failedMessage: 'Please provide username, first name, last name, password and salary.',
          });
          // continue to the next element
          return;
        }
        passValidationList.push(employee);
      });

      // Perform bulk upsert for the objects pass the validation
      let results = [];
      const promises = [];
      await dbClientPool.queryWithTransaction(async (client) => {
        const sql = `
        INSERT INTO employees(username, first_name, last_name, password, salary, is_admin, company_id, created_by, created_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (company_id, username)
          DO UPDATE SET first_name=$10, last_name=$11, password=$12, salary=$13, updated_by=$14, updated_date=$15 where employees.username=$16 and employees.company_id=$17;
        `

        return passValidationList.map(async (emp) => {
          const {
            username,
            firstName,
            lastName,
            password,
            salary
          } = emp;

          const insertValue = [
            username,
            firstName,
            lastName,
            password,
            salary,
            false,
            companyId,
            clientAdminUser,
            new Date()
          ];

          const updateValue = [
            firstName,
            lastName,
            password,
            salary,
            clientAdminUser,
            new Date(),
            username,
            companyId,
          ];

          promises.push(client.query(sql, [...insertValue, ...updateValue]));

          results = await Promise.allSettled(promises);
        })
      });

      results.forEach((result, index) => {
        const resultData = passValidationList[index];
        if (result.status === 'fulfilled') {
          successfullImport.push(resultData);
        } else {
          failedImport.push({
            data: resultData,
            failedMessage: result.reason,
          })
        }
      })

      return res.status(HttpStatus.OK).send({
        successfullImport,
        failedImport,
      });
    } catch (e) {
      console.log(`An error occurs while importing employees for the company ${companyId}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },
}

export default EmployeeController;