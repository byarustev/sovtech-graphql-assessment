import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import PeopleList from './Components/PeopleList';

const App = (): JSX.Element => (
      <Router>
      <Container maxWidth="md">
        <Switch>
          <Route path="/">
            <PeopleList />
          </Route>
        </Switch>
      </Container>
    </Router>
);

export default App;
