const { ApolloServer } = require('apollo-server');
const mysql = require('../services/mysql');
const psql = require('../services/psql').psql;

psql.manyOrNone(`SELECT "Email" FROM fact_contacts LIMIT 1`)
.then(function (patate) {
  console.log(patate)
})

mysql.query(`SELECT status FROM elevators`)
.then(function(results) {
  console.log(results);
})



const resolvers = {
  Query: {
    test: ()=> `patate`
    
    
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

  
  
  