var express = require('express');
const cors = require('cors');

var {graphqlHTTP} = require('express-graphql');
const { GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString, } = require('graphql');
var fetch = require('node-fetch');

var { GraphQLSchema } = require('graphql');

const BASE_URL = 'https://www.swapi.tech/api';

const fetchResponseByURL=(relativeURL)=> fetch(`${BASE_URL}${relativeURL}`).then((res) => res.json());
const fetchPaginatedPeople=(relativeURL)=> fetchResponseByURL(`/people/${relativeURL?relativeURL:""}`);
const fetchSearchPeople=(relativeURL)=> fetchResponseByURL(`/people/${relativeURL}`).then((json) => {
  if(json.result.length>0){
    return json.result.map(item=>item.properties)
  }
  return json.result;
});
const fetchPersonByURL=(relativeURL)=> fetchResponseByURL(relativeURL).then((json)=>json.result.properties);
const fetchResponseByCompleteURL=(completeURL)=> fetch(completeURL).then((res) => res.json()).then((json)=>json.result.properties);

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

function getUserId(url){
  const urlArray = url.split("/");
  return Number(urlArray[urlArray.length-1]); // return second last value
}

/**
 * The new api call for paginated people only returns a few attributes about a person
 * {
 * "uid": "...",
 * "name": "....",
 * "url": "url"
 * }
 * hence, there is need to fetch the other information that regards to a person 
 * 
 */

const users = {};
function getUserAttributeValue(url, attr){
  const uid = `${getUserId(url)}`;
  if(uid in users){
    return users[uid][attr];
  }else{
    return fetchPersonByURL(`/people/${uid}`).then(result=>{
      users[uid] = result;
      return users[uid][attr];
    });
  }
}

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Persons details',
    fields: () => ({
      id:{
        type: GraphQLInt,
        resolve: (person) => getUserId(person.url)
      },
        name: {
        type: GraphQLString,
        resolve: (person) => person.name? person.name : getUserAttributeValue(person.url, 'name'),
      },
      height: {
        type: GraphQLString,
        resolve: (person) => person.height? person.height : getUserAttributeValue(person.url, 'height'),
      },
      mass: {
        type: GraphQLString,
        resolve: (person) => person.mass ? person.mass : getUserAttributeValue(person.url, 'mass'),
      },
      gender: {
        type: GraphQLString,
        resolve: (person) => person.gender? person.gender : getUserAttributeValue(person.url, 'gender'),
      },
      homeworld: {
        type: PlanetType,
        resolve: (person) => fetchResponseByCompleteURL(person.homeworld)
      },
    }),
  });

const PeoplePageType = new GraphQLObjectType({
  name: 'Page',
  description: 'People Page',
  fields: () => ({
      pages: {
      type: GraphQLInt,
      resolve: (page) => page.total_pages
    },
    next: {
      type: GraphQLString,
    },
    previous: {
      type: GraphQLString,
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
      peoplePage: {
        type: PeoplePageType,
        args: {
          page: {type: GraphQLInt}
        },
        resolve: (root, args) => fetchPaginatedPeople(`?page=${args.page}&limit=10`)
      },
      person: {
        type: PersonType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (root, args) => fetchPersonByURL(`/people/${args.id}`) // Fetch the person with ID `args.id`,
      },
      searchPeople: {
        type: new GraphQLList(PersonType),
        args: {
          name: { type: GraphQLString },
        },
        resolve: (root, args) => fetchSearchPeople(`?name=${args.name}`) // Fetch the people with name `args.name`,
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
app.listen(process.env.PORT || 4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
