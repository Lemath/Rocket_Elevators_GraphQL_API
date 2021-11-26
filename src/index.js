const { ApolloServer } = require('apollo-server');

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
      const { id } = args;
      const psql_response = await psql.manyOrNone(`SELECT * FROM factIntervention WHERE id = ${id}`);
      const building_id = psql_response[0].building_id;
      const building = await prisma.buildings.findUnique({ where: { id: building_id } });
      const address = await prisma.addresses.findUnique({ where:{ id: building.address_id } });
      const address_string = `${address.number_and_street}, ${address.city}, ${address.country}, ${address.postal_code}`;
      const start_time_and_date = String(psql_response[0].intervention_start_date_time);
      const end_time_and_date = String(psql_response[0].intervention_end_date_time);
      return {
        id: id, 
        start_time_and_date: start_time_and_date, 
        end_time_and_date: end_time_and_date, 
        address: address_string
      };
    }, 
    building: async (_, args) => {
      const { id } = args;
      const building = await prisma.buildings.findUnique({ where: { id: Number(id) } });
      const customer = await prisma.customers.findUnique({ select: {id: true, company_name: true, company_email: true, company_contact: true}, where: { id: building.customer_id } });
      customer.id = Number(customer.id);
      const interventions = await psql.manyOrNone(`SELECT * FROM factIntervention WHERE building_id = ${id}`);
      const address = await prisma.addresses.findUnique({ where:{ id: building.address_id } });
      const address_string = `${address.number_and_street}, ${address.city}, ${address.country}, ${address.postal_code}`;
      const intervention_list = [];
      interventions.forEach( (intervention) => {
        intervention_list.push({
          id: intervention.id,
          start_time_and_date: String(intervention.intervention_start_date_time),
          end_time_and_date: String(intervention.intervention_end_date_time),
          address: address_string
        });
      });
      return {id: Number(id), customer: customer, interventions: intervention_list};
    },
    employee: async (_, args) => {
      const { id } = args;
      const interventions = await psql.manyOrNone(`SELECT * FROM factIntervention WHERE employee_id = ${id}`);
      const intervention_list = [];
      const building_id_list = [];
      interventions.forEach( (intervention) => {
        intervention_list.push({
          id: intervention.id,
          start_time_and_date: String(intervention.intervention_start_date_time),
          end_time_and_date: String(intervention.intervention_end_date_time),
          address: `address_string`
        });
        console.log(`building id : ${intervention.building_id}`)
        if (building_id_list.indexOf(intervention.building_id) === -1) {
          building_id_list.push(intervention.building_id);
        }
      });
      console.log(building_id_list);
      console.log(`building ids : ` + building_id_list);
      const building_list = await Promise.all(building_id_list.map( async (id) => {
        const building = await prisma.buildings.findUnique({ where: { id: Number(id) } });
        const building_details = await prisma.building_details.findMany({ where: { building_id: id } });
        console.log(building_details);
        return {
          id: Number(building.id), 
          building_details: {
            number_of_floors: building_details.number_of_floors,
            type: building_details.type,
            department: building_details.department,
            year_of_contruction: building_details.year_of_contruction,
            maximum_number_of_occupants: building_details.maximum_number_of_occupants,
          }
        };
      }));
      console.log(intervention_list);
      console.log(building_list);
      building_list.forEach((building) => {

      });
      return {id: id, interventions: intervention_list, buildings: building_list};
    },
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
  introspection: true,
  playground: true,
});

server
  .listen(process.env.PORT)
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );

  
  
  