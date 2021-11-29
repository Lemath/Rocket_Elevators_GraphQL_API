const { ApolloServer } = require('apollo-server');

const psql = require('../services/psql').psql;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  
  Query: {

    intervention: async (_, args) => {
      const { id } = args;
      const psql_response = await psql.manyOrNone(`SELECT * FROM fact_interventions WHERE id = ${id}`);
      const start_time_and_date = String(psql_response[0].intervention_start_date_time);
      const end_time_and_date = String(psql_response[0].intervention_end_date_time);
      return {
        id: id, 
        start_time_and_date: start_time_and_date, 
        end_time_and_date: end_time_and_date,
      };
    },

    building: async (_, args) => {
      const { id } = args;
      const interventions = await psql.manyOrNone(`SELECT * FROM fact_interventions WHERE building_id = ${id}`);
      const intervention_list = [];
      interventions.forEach( (intervention) => {
        intervention_list.push({
          id: intervention.id,
          start_time_and_date: String(intervention.intervention_start_date_time),
          end_time_and_date: String(intervention.intervention_end_date_time),
        });
      });
      return {id: Number(id), interventions: intervention_list};
    },

    employee: async (_, args) => {
      const { id } = args;
      const interventions = await psql.manyOrNone(`SELECT * FROM fact_interventions WHERE employee_id = ${id}`);
      const building_id_list = [];
      const intervention_list = await Promise.all(interventions.map( async (intervention) => {
        if (building_id_list.indexOf(intervention.building_id) === -1) {
          building_id_list.push(intervention.building_id);
        }
        return {
          id: intervention.id,
          start_time_and_date: String(intervention.intervention_start_date_time),
          end_time_and_date: String(intervention.intervention_end_date_time),
        };
      }));
      const building_list = await Promise.all(building_id_list.map( async (id) => {
        const building = await prisma.buildings.findUnique({ where: { id: Number(id) } });
          return { id: Number(building.id) };
      }));
      return {id: id, interventions: intervention_list, buildings: building_list};
    },
  },

  Intervention: {

    address: async (parent) => {
      const intervention = await psql.one(`SELECT * FROM fact_interventions WHERE id = ${parent.id}`);
      const building = await prisma.buildings.findUnique({ where: { id: Number(intervention.building_id)} });
      const address = await prisma.addresses.findUnique({ where:{ id: Number(building.address_id) } });
      return {number_and_street: address.number_and_street, city: address.city, country: address.country, postal_code: address.postal_code}; 
    },
  },

  Building: {

    building_details: async (parent) => {
      const buildingDetails = await prisma.building_details.findMany({ where: { building_id: parent.id } });
      return {
        number_of_floors: buildingDetails[0].number_of_floors,
        building_type: buildingDetails[0].building_type,
        department: buildingDetails[0].department,
        year_of_construction: buildingDetails[0].year_of_contruction,
        maximum_number_of_occupants: buildingDetails[0].maximum_number_of_occupants,
      };
    },

    customer: async (parent) => {
      const building = await prisma.buildings.findUnique({ where: { id: Number(parent.id) } });
      const customer = await prisma.customers.findUnique({ select: {id: true, company_name: true, company_email: true, company_contact: true}, where: { id: building.customer_id } });
      customer.id = Number(customer.id);
      return customer;
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

  
  
  