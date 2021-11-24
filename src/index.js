const { ApolloServer } = require('apollo-server');
const mysql = require('../services/mysql');
const psql = require('../services/psql').psql;
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

psql.manyOrNone(`SELECT "Email" FROM fact_contacts LIMIT 1`)
.then(function (patate) {
  console.log(patate[0]['Email'])
})

mysql.query(`SELECT status FROM elevators`, 'status')
.then(function(results) {
  console.log(results);
})



const resolvers = {
  Query: {
    test() {
      const testQuery = `SELECT status FROM elevators`;
      return mysql.query(testQuery, 'status')
    }
    intervention(id) {
      const start = 
    }
    
    
  },
};



const fs = require('fs');
const path = require('path');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );

  
  
  