var express = require('express');
var {graphqlHTTP} = require('express-graphql');
const { GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString, } = require('graphql');
var fetch = require('node-fetch');

var { GraphQLSchema } = require('graphql');

const BASE_URL = 'https://swapi.dev/api';

const fetchResponseByURL=(relativeURL)=> fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
const fetchAllPeople=()=> fetchResponseByURL('/people/').then(json => json.results);
const fetchPersonByURL=(relativeURL)=> fetchResponseByURL(relativeURL);
const fetchResponseByRelativeURL=(relativeURL)=> fetch(`${relativeURL}`).then(res => res.json());

const FilmType = new GraphQLObjectType({
    name: 'Film',
    description: 'Films that a person ...',
    fields: () => ({ 
        title: {
            type: GraphQLString,
            resolve: film => film.title,
          },
          episode_id: {
            type: GraphQLString,
            resolve: film => film.episode_id,
          },
          opening_crawl: {
            type: GraphQLString,
            resolve: film => film.opening_crawl,
          },
          director: {
            type: GraphQLString,
            resolve: film => film.director,
          },
          producer: {
            type: GraphQLString,
            resolve: film => film.producer,
          },
          release_date: {
            type: GraphQLString,
            resolve: film => film.release_date,
          }
    }),
  });

  const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'Planet that a person ...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: planet => planet.name,
          },
        rotation_period: {
            type: GraphQLString,
            resolve: planet => planet.rotation_period,
          },
        orbital_period: {
            type: GraphQLString,
            resolve: planet => planet.orbital_period,
          },
        diameter: {
            type: GraphQLString,
            resolve: planet => planet.diameter,
          },
        terrain: {
            type: GraphQLString,
            resolve: planet => planet.terrain,
          },
        population: {
            type: GraphQLString,
            resolve: planet => planet.population,
          },
    }),
  });

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Persons details',
    fields: () => ({
        name: {
        type: GraphQLString,
        resolve: person => person.name,
      },
      height: {
        type: GraphQLString,
        resolve: person => person.height,
      },
      mass: {
        type: GraphQLString,
        resolve: person => person.mass,
      },
      gender: {
        type: GraphQLString,
        resolve: person => person.gender,
      },
      homeworld: {
        type: PlanetType,
        resolve: person => fetchResponseByRelativeURL(person.homeworld)
      },
    }),
  });


const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
      allPeople: {
        type: new GraphQLList(PersonType),
        resolve: fetchAllPeople
      },
      person: {
        type: PersonType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (root, args) => fetchPersonByURL(`/people/${args.id}/`) // Fetch the person with ID `args.id`,
      },
    }),
});


const schema = new GraphQLSchema({
    query: QueryType,
});

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
