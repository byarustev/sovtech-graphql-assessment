var { GraphQLSchema } = require('graphql');
const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
  } = require('graphql');

const BASE_URL = 'https://myapp.com/';

const fetchResponseByURL=(relativeURL)=> fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
const fetchAllPeople=()=> fetchResponseByURL('/people/').then(json => json.people);
const fetchPersonByURL=(relativeURL)=> fetchResponseByURL(relativeURL).then(json => json.person);

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Somebody that you used to know',
    fields: () => ({
      firstName: {
        type: GraphQLString,
        resolve: person => person.first_name,
      },
      lastName: {
        type: GraphQLString,
        resolve: person => person.last_name,
      },
      email: {type: GraphQLString},
      id: {type: GraphQLString},
      username: {type: GraphQLString},
      friends: {
        type: new GraphQLList(PersonType),
        resolve: person => person.friends.map(fetchPersonByURL)// Fetch the friends with the URLs `person.friends`,
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
          id: { type: GraphQLString },
        },
        resolve: (root, args) => fetchPersonByURL(`/people/${args.id}/`)// Fetch the person with ID `args.id`,
      },
    }),
});


export default new GraphQLSchema({
    query: QueryType,
});


