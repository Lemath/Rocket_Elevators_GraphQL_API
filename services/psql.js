const env = process.env;
const pgPromise = require('pg-promise');

const connConfig = {
  host: env.PSQL_HOST,
  user: env.PSQL_USERNAME,
  password: env.PSQL_PASSWORD,
  database: env.PSQL_DATABASE,
  port: 5432
};
const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connConfig); // get connection to your db instance

exports.psql = psql;