import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import {
    useParams
  } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';

const useStyles = makeStyles({
    root: {
      marginTop: 20,
      paddingTop: 5,
      paddingBottom: 20,
      width: '100%',
    },
    container: {
      marginTop: 10,
      marginBottom: 20,
      maxHeight: 500,
    },
  });

const GET_USER_DETAILS = gql`
    query getPerson($id: Int!){
        person(id:$id){
        name
        mass
        gender
        height
        homeworld{
            name
            population
            diameter
            terrain
            rotation_period
        }
        }
    }
`;

const PersonsDetails = () => {
    const classes = useStyles();
    let { id } = useParams<{ id: string }>();

    const { loading, error, data } = useQuery(GET_USER_DETAILS, {
        variables: { id: Number(id) },
      });
  
    const mayBeRenderDetails=()=>{
      if (loading) return <p>Loading ...</p>;
      if(error){
          return (<p>Failed to fetch the data</p>)
      }

      return <React.Fragment>
                    <h4>Personal Details</h4>
                    <p>Name: {data.person.name}</p>
                    <p>Mass: {data.person.mass} </p>
                    <p>Height: {data.person.height}</p>
                    <p>Gender: {data.person.gender}</p>
                    <h4>Home Planet Details </h4>
                    <p>Name: {data.person.homeworld.name}</p>
                    <p>Population: {data.person.homeworld.population}</p>
                    <p>Diameter: {data.person.homeworld.diameter}</p>
                    <p>Terrian: {data.person.homeworld.terrain}</p>
      </React.Fragment>
    }

    return(
            <Paper className={classes.root}>
                <Container className={classes.container}>
                    {mayBeRenderDetails()}
                </Container>
            </Paper>
    )
    
}


export default PersonsDetails;