import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';
import { v4 as uuidv4 } from "uuid";

/**
 * Salary Hero can create/read/update/delete (CRUD) a company
 */
const CompanyController = {
  createCompany: async (req, res) => {
    const {
      name,
      address,
      phone,
    } = req.body;

    /**
     * Validate the input.
     * Improvement: use zod library to validate the data.
     */
    if (!name || !address) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide name and adress. phone can be optional.'
      });
    }
    try {
      const {
        username
      } = req.user;

      const id = uuidv4();
      console.log(`Start creating a new company`, {
        name,
        address,
        phone,
        username,
      })

      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `INSERT INTO company(id, "name", address, phone, created_by, created_date) VALUES($1, $2, $3, $4, $5, $6)`;

        const result = await client.query(sql, [
          id,
          name,
          address,
          phone,
          username,
          new Date(),
        ]);
        return result;
      });

      const newRecord = {
        id,
        name,
        address,
        phone
      };
      console.log('New record is created', newRecord);
      return res.status(HttpStatus.CREATED).send(newRecord);
    } catch (e) {
      console.log('An error occurs while creating a company', e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }

  },

  updateCompany: async (req, res) => {
    const {
      name,
      address,
      phone,
    } = req.body;

    const { id } = req.params;
    /**
     * Validate the input.
     * Improvement: use zod library to validate the data.
     */
    if (!id || !name || !address) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide id, name and adress. phone can be optional.'
      });
    }
    try {
      const {
        username
      } = req.user;

      console.log(`Start updating an existing company`, {
        name,
        address,
        phone,
        username,
      })

      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `UPDATE company SET name=$1, address=$2, phone=$3, updated_by=$4, updated_date=$5 where id=$6`;

        const result = await client.query(sql, [
          name,
          address,
          phone,
          username,
          new Date(),
          id,
        ]);
        return result;
      });

      const updatedRecord = {
        id,
        name,
        address,
        phone
      };
      console.log('Updated record', updatedRecord)
      return res.status(HttpStatus.OK).send(updatedRecord);
    } catch (e) {
      console.log(`An error occurs while updating the company ${id}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },

  deleteCompany: async (req, res) => {
    const { id } = req.params;
    /**
     * Validate the input.
     */
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide id of the company.'
      });
    }
    try {
      const {
        username
      } = req.user;

      console.log(`Start deleting an existing company`, {
        id,
        username,
      })

      const result = await dbClientPool.queryWithTransaction(async (client) => {
        /**
         * Another option is to set active flag instead of permanently delete the record.
         */
        const sql = `DELETE from company where id=$1`;

        const result = await client.query(sql, [id]);
        return result;
      });

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: `The company with id ${id} does not exist`,
        });
      }
      const deletedRecord = {
        id,
      };
      console.log('Deleted record', deletedRecord)
      return res.status(HttpStatus.OK).send();
    } catch (e) {
      console.log(`An error occurs while deleting the company ${id}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },

  getCompanyById: async (req, res) => {
    const { id } = req.params;
    /**
     * Validate the input.
     */
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide id of the company.'
      });
    }
    try {
      const {
        username
      } = req.user;

      console.log(`Start getting an existing company`, {
        id,
        username,
      })

      const sql = `Select id, name, address, phone from company where id=$1`;

      const result = await dbClientPool.query(sql, [id]);

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: `The company with id ${id} does not exist`,
        });
      }


      const record = result.rows[0];
      console.log('Get record', record);
      return res.status(HttpStatus.OK).send(record);
    } catch (e) {
      console.log(`An error occurs while getting the company ${id}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    }
  },
}

export default CompanyController;