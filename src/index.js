const { ApolloServer } = require('apollo-server');
const mysql = require('../services/mysql');
const psql = require('../services/psql').psql;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    test() {
      const testQuery = `SELECT status FROM elevators`;
      return mysql.query(testQuery, 'status');
    },
    intervention: async (_, args) => {
      const id = args.id;
      const psql_response = await psql.manyOrNone(`SELECT * FROM factIntervention WHERE id = ${id}`)
      const building_id = psql_response[0].building_id   
      const building = await prisma.buildings.findUnique({ where: { id: building_id } });
      const address = await prisma.addresses.findUnique({ where:{ id: building.address_id } });
      const address_string = `${address.number_and_street}, ${address.city}, ${address.country}, ${address.postal_code}`
      const start_time_and_date = String(psql_response[0].intervention_start_date_time);
      const end_time_and_date = String(psql_response[0].intervention_end_date_time);
      return {id: id, start_time_and_date: start_time_and_date, end_time_and_date: end_time_and_date, address: address_string};
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

  
  
  