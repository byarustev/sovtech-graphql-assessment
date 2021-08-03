"use strict";
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const { GraphQLList, GraphQLInt, GraphQLObjectType, GraphQLString, } = require('graphql');
var fetch = require('node-fetch');
var { GraphQLSchema } = require('graphql');
const BASE_URL = 'https://swapi.dev/api';
const fetchResponseByURL = (relativeURL) => fetch(`${BASE_URL}${relativeURL}`).then((res) => {
    console.log(res);
    console.log(`${BASE_URL}${relativeURL}`);
    return res.json();
});
const fetchPaginatedPeople = (relativeURL) => fetchResponseByURL(`/people/${relativeURL ? relativeURL : ""}`);
const fetchSearchPeople = (relativeURL) => fetchResponseByURL(`/people/${relativeURL ? relativeURL : ""}`).then((json) => json.results);
const fetchPersonByURL = (relativeURL) => fetchResponseByURL(relativeURL);
const fetchResponseByRelativeURL = (relativeURL) => fetch(`${relativeURL}`).then((res) => res.json());
const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'Planet that a person ...',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (planet) => planet.name,
        },
        rotation_period: {
            type: GraphQLString,
            resolve: (planet) => planet.rotation_period,
        },
        orbital_period: {
            type: GraphQLString,
            resolve: (planet) => planet.orbital_period,
        },
        diameter: {
            type: GraphQLString,
            resolve: (planet) => planet.diameter,
        },
        terrain: {
            type: GraphQLString,
            resolve: (planet) => planet.terrain,
        },
        population: {
            type: GraphQLString,
            resolve: (planet) => planet.population,
        },
    }),
});
const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Persons details',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (person) => person.name,
        },
        height: {
            type: GraphQLString,
            resolve: (person) => person.height,
        },
        mass: {
            type: GraphQLString,
            resolve: (person) => person.mass,
        },
        gender: {
            type: GraphQLString,
            resolve: (person) => person.gender,
        },
        homeworld: {
            type: PlanetType,
            resolve: (person) => fetchResponseByRelativeURL(person.homeworld)
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
            resolve: (page) => page.results
        },
    }),
});
const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
        allPeople: {
            type: PeoplePageType,
            args: {
                page: { type: GraphQLInt }
            },
            resolve: (root, args) => fetchPaginatedPeople(`${args.page ? "?page=" + args.page : ''}`) // Fetch the person with name `args.name`,
        },
        person: {
            type: PersonType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => fetchPersonByURL(`/people/${args.id}/`) // Fetch the person with ID `args.id`,
        },
        searchPerson: {
            type: new GraphQLList(PersonType),
            args: {
                name: { type: GraphQLString },
            },
            resolve: (root, args) => fetchSearchPeople(`?search=${args.name}`) // Fetch the person with name `args.name`,
        }
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
