const env = process.env;

const config = {
  db: { /* don't expose password or any sensitive info, done only for demo */
    host: env.DB_HOST || 'codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
    user: env.DB_USER || 'codeboxx',
    password: env.DB_PASSWORD || 'Codeboxx1!',
    database: env.DB_NAME || 'SamaelTessier',
    port: env.DB_PORT || '3306'
  },
};


module.exports = config;