
const pgPromise = require('pg-promise');

const connStr = 'postgresql://codeboxx@codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com:5432/SamaelTessier'; // add your psql details
const connConfig = {
  host: 'codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
  user: 'codeboxx',
  password: 'Codeboxx1!',
  database: 'SamaelTessier',
  port: 5432
}
const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connConfig); // get connection to your db instance

exports.psql = psql;