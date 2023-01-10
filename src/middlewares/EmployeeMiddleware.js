import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';

const EmployeeMiddleware = {
  validateEmployee: async (req, res, next) => {
    console.log(`Start validating user: ${req.headers.authorization}`);
    const companyId = req.headers.companyid;
    if (!companyId) {
      return res.status(HttpStatus.BAD_REQUEST).send('Please specify companyId in the header');
    }

    const auth = req.headers.authorization.replace('Basic ', '');
    // create a buffer
    const buff = Buffer.from(auth, 'base64');
    // decode buffer as UTF-8
    const authString = buff.toString('utf-8');
    const [authStringUsername, authStringPassword] = authString.split(':');

    const sql = `Select username, company_id, salary from employees where username=$1 and password=$2 and company_id=$3`;
    const result = await dbClientPool.query(sql, [authStringUsername, authStringPassword, companyId]);
  
    if (result.rowCount === 0) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: `The user ${authStringUsername} from company ${companyId} is not authorized for the request.`,
      });
    }

    const record = result.rows[0];
    req.user = {
      username: record.username,
      companyId: record.company_id,
      salary: record.salary,
    }
    next();
  }
}

export default EmployeeMiddleware;