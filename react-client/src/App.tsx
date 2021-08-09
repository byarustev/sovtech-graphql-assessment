import React from 'react';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ListPeople from './Components/ListPeople';
import PersonsDetails from './Components/PersonsDetails';
import { PageProvider } from './PagesContext';


const App = (): JSX.Element => (
  <PageProvider>
      <Router>
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/">
            <ListPeople />
          </Route>
          <Route exact path="/details/:id">
            <PersonsDetails />
          </Route>
        </Switch>
      </Container>
    </Router>
    </PageProvider>
);

export default App;
