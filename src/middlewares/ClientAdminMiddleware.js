import HttpStatus from 'http-status-codes';
import { dbClientPool } from '../database/DatabaseConnector.js';

const ClientAdminMiddleware = {
  validateClientAdmin: async (req, res, next) => {
    console.log(`Start validating user: ${req.headers.authorization}`);
    const companyId = req.headers.companyid;
    if (!companyId) {
      return res.status(HttpStatus.BAD_REQUEST).send('Please specify companyId in the header');
    }

    const auth = req.headers.authorization.replace('Basic ', '');
    const buff = Buffer.from(auth, 'base64');
    const authString = buff.toString('utf-8');
    const [authStringUsername, authStringPassword] = authString.split(':');

    const sql = `Select username, company_id from employees where username=$1 and password=$2 and company_id=$3 and is_admin=$4`;
    const result = await dbClientPool.query(sql, [authStringUsername, authStringPassword, companyId, true]);
  
    if (result.rowCount === 0) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: `The user ${authStringUsername} from company ${companyId} is not authorized for the request.`,
      });
    }

    const record = result.rows[0];
    req.user = {
      username: record.username,
      companyId: record.company_id,
    }
    next();
  }
}

export default ClientAdminMiddleware;