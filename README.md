# Rocket_Elevators_GraphQL_API

this week we use GraphQl to use another more suitable technology to restore the data coming from two separate data sources in the same request.
https://glacial-fjord-41164.herokuapp.com/

The GraphQL Solution was to be able to respond to 3 main queries:
1. Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
query GetIntervention{
  intervention(id: 1) {
    id
    start_time_and_date
    end_time_and_date
    address {
      number_and_street
      city
      country
      postal_code
    }
  }
}

2. Retrieving customer information and the list of interventions that took place for a specific building
query GetBuilding{
  building(id: 2) {
    customer{
      id
      company_name
      company_email
      company_contact
    }
    id
    interventions {
      id
      start_time_and_date
      end_time_and_date
      address {
        number_and_street
        city
        country
        postal_code
      }
    }
    building_details {
      number_of_floors
      department
      year_of_construction
      maximum_number_of_occupants
      building_type
    }
  }
}

3. Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails) associated with these buildings.

query GetEmployee{
  employee(id: 4) {  
    interventions {
      id
      start_time_and_date
      end_time_and_date
      address {
        number_and_street
        city
        country
        postal_code
      }
    }
    buildings{
      building_details{
        number_of_floors
        department
        year_of_construction
        maximum_number_of_occupants
        building_type
      }
    } 
  }
}

