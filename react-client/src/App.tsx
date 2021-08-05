import React from 'react';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import PeopleList from './Components/PeopleList';
import PersonsDetails from './Components/PersonsDetails';

const App = (): JSX.Element => (
      <Router>
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/">
            <PeopleList />
          </Route>
          <Route exact path="/details/:id">
            <PersonsDetails />
          </Route>
        </Switch>
      </Container>
    </Router>
);

export default App;
