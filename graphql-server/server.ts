var express = require('express');
const cors = require('cors');

var {graphqlHTTP} = require('express-graphql');
const { GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString, } = require('graphql');
var fetch = require('node-fetch');

var { GraphQLSchema } = require('graphql');

const BASE_URL = 'https://swapi.dev/api';

const fetchResponseByURL=(relativeURL: String)=> fetch(`${BASE_URL}${relativeURL}`).then((res: any) => res.json());
const fetchPaginatedPeople=(relativeURL?:String)=> fetchResponseByURL(`/people/${relativeURL?relativeURL:""}`);
const fetchSearchPeople=(relativeURL?:String)=> fetchResponseByURL(`/people/${relativeURL?relativeURL:""}`).then((json: any) => json.results);
const fetchPersonByURL=(relativeURL: String)=> fetchResponseByURL(relativeURL);
const fetchResponseByRelativeURL=(relativeURL: String)=> fetch(`${relativeURL}`).then((res: any) => res.json());

  const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'Planet that a person ...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (planet: any) => planet.name,
          },
        rotation_period: {
            type: GraphQLString,
            resolve: (planet: any) => planet.rotation_period,
          },
        orbital_period: {
            type: GraphQLString,
            resolve: (planet: any) => planet.orbital_period,
          },
        diameter: {
            type: GraphQLString,
            resolve: (planet: any) => planet.diameter,
          },
        terrain: {
            type: GraphQLString,
            resolve: (planet: any) => planet.terrain,
          },
        population: {
            type: GraphQLString,
            resolve: (planet: any) => planet.population,
          },
    }),
  });

function getUserId(url: String){
  const urlArray = url.split("/");
  console.log(urlArray);
  return Number(urlArray[urlArray.length-2]); // return second last value
}

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Persons details',
    fields: () => ({
      id:{
        type: GraphQLInt,
        resolve: (person: any) => getUserId(person.url)
      },
        name: {
        type: GraphQLString,
        resolve: (person: any) => person.name,
      },
      height: {
        type: GraphQLString,
        resolve: (person: any) => person.height,
      },
      mass: {
        type: GraphQLString,
        resolve: (person: any) => person.mass,
      },
      gender: {
        type: GraphQLString,
        resolve: (person: any) => person.gender,
      },
      homeworld: {
        type: PlanetType,
        resolve: (person: any) => fetchResponseByRelativeURL(person.homeworld)
      },
    }),
  });

const PeoplePageType = new GraphQLObjectType({
  name: 'Page',
  description: 'People Page',
  fields: () => ({
      count: {
      type: GraphQLInt,
    },
    next: {
      type: GraphQLString,
      // resolve: (person: any) => person.height,
    },
    previous: {
      type: GraphQLString,
      // resolve: (person: any) => person.mass,
    },
    people: {
      type: new GraphQLList(PersonType),
      resolve: (page : any) => page.results
    },
  }),
});  

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
      peoplePage: {
        type: PeoplePageType,
        args: {
          page: {type: GraphQLInt}
        },
        resolve: (root : any, args: any) => fetchPaginatedPeople(`${args.page?"?page="+args.page:''}`) // Fetch the person with name `args.name`,
      },
      person: {
        type: PersonType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (root : any, args: any) => fetchPersonByURL(`/people/${args.id}/`) // Fetch the person with ID `args.id`,
      },
      searchPerson: {
        type: new GraphQLList(PersonType),
        args: {
          name: { type: GraphQLString },
        },
        resolve: (root : any, args: any) => fetchSearchPeople(`?search=${args.name}`) // Fetch the person with name `args.name`,
      }
    }),
});


const schema = new GraphQLSchema({
    query: QueryType,
});

// Create an express server and a GraphQL endpoint
var app = express();

//allow cross origin requests
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
