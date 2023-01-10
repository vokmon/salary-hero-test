import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';
import { v4 as uuidv4 } from "uuid";

/**
 * An employee can request for a money transfer (as long as the sum of requested amount
 * for that month is not going to be over 50% of his salary)
 */
const EmployeeMoneyTransferController = {
  transferMoney: async (req, res) => {
    const {
      transferAmount,
    } = req.body;

    const {
      username,
      companyId,
      salary,
    } = req.user;

    /**
     * Validate the input.
     * Improvement: use zod library to validate the data.
     */
    if (!transferAmount) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Please provide transferAmount in the payload.'
      });
    }

    try {
      const currentDate = new Date();
      const id = uuidv4();
      const salaryNum = Number(salary);

      console.log(`Start transfering money`, {
        username,
        companyId,
        salaryNum,
        transferAmount,
      });

      let month = String(currentDate.getMonth() + 1);
      month = month.padStart(2, '0')

      const year = currentDate.getFullYear();
      console.log(month, year);

      const tranferedMoneySql = `
      select sum(transferred_amount) as transfered
      from money_transfer
      where
        company_id = $1 
        and employee_username =$2
        and to_char(transfer_date, 'YYYY-MM') = $3;
      `

      const alreadyTransferredAmountFromDb = await dbClientPool.query(tranferedMoneySql, [
        companyId,
        username,
        `${year}-${month}`
      ]);

      let alreadyTransferredAmount = 0;
      if (alreadyTransferredAmountFromDb && alreadyTransferredAmountFromDb.rows.length > 0) {
        alreadyTransferredAmount = Number(alreadyTransferredAmountFromDb.rows[0].transfered);
      }

      const transferLimit = salaryNum / 2;

      if (alreadyTransferredAmount + transferAmount > transferLimit) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: `Sum of requested amount for month ${month} is over 50% of the salary.`,
          data: {
            salary: salaryNum,
            transferLimit,
            alreadyTransferredAmount,
            requestedTransferAmount: transferAmount,
          }
        });
      }
      await dbClientPool.queryWithTransaction(async (client) => {
        const sql =
          `INSERT INTO money_transfer(id, company_id, employee_username, transferred_amount, transfer_date) VALUES($1, $2, $3, $4, $5)`;

        const result = await client.query(sql, [
          id,
          companyId,
          username,
          transferAmount,
          currentDate,
        ]);
        return result;
      });

      const newRecord = {
        id,
        companyId,
        username,
        transferAmount,
        transferDate: currentDate,
      };
      console.log('Transfer success', newRecord);

      return res.status(HttpStatus.CREATED).send(newRecord);
    } catch (e) {
      console.log(`An error occurs while transfering money for user ${username} in company ${companyId} with amount of ${transferAmount}`, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.detail
      });
    }
  }
}

export default EmployeeMoneyTransferController;