import pkg from 'pg';
const { Pool } = pkg;

let _dbClientPool;

export const initDatabaseConnection = async () => {
  _dbClientPool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: true,
  });
};

export const disconnectDatabase = () => {
  _dbClientPool.end();
};

export const dbClientPool = {
  query: async (query, values) => {
    try {
      return await _dbClientPool.query(query, values);
    } catch (e) {
      throw e;
    }
  },

  queryWithTransaction: async (transactionFunction) => {
    if (!_dbClientPool) {
      await initDatabaseConnection();
    }
    const client = await _dbClientPool.connect();
    try {
      await client.query('BEGIN');
      const result = await transactionFunction(client);
      await client.query('COMMIT');
      console.log(`Database has been updated successfully`);
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
};
