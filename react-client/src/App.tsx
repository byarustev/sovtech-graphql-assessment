import React from 'react';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import PeopleList from './Components/PeopleList';
import PersonsDetails from './Components/PersonsDetails';
import SearchPerson from './Components/SearchPeople';
import { PageProvider } from './PagesContext';


const App = (): JSX.Element => (
  <PageProvider>
      <Router>
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/">
            <PeopleList />
          </Route>
          <Route exact path="/details/:id">
            <PersonsDetails />
          </Route>
          <Route exact path="/search">
            <SearchPerson />
          </Route>
        </Switch>
      </Container>
    </Router>
    </PageProvider>
);

export default App;
