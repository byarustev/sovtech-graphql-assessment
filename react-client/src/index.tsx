import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

// Todo: make this an env variable
// const apiServerUrl = "https://swapi-graphql-api-node.herokuapp.com/graphql";
const apiServerUrl = "http://localhost:4000/graphql";

const client = new ApolloClient({
  uri: apiServerUrl,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

