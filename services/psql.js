
const pgPromise = require('pg-promise');

const connConfig = {
  host: process.env.PSQL_HOST,
  user: process.env.PSQL_USERNAME,
  password: process.env.PSQL_PASSWORD,
  database: process.env.PSQL_DATABASE,
  port: 5432
};
const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connConfig); // get connection to your db instance

exports.psql = psql;