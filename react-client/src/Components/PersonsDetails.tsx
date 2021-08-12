import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    useParams
  } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import Person from './ui/Person';

const useStyles = makeStyles({
    root: {
      marginTop: 20,
      padding: 10,
      paddingBottom: 20,
      width: '100%',
    },
    container: {
      marginTop: 10,
      marginBottom: 20,
      maxHeight: 500,
    },
});

export const GET_PERSONS_DETAILS = gql`
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

const PersonsDetails = (): JSX.Element => {
    const classes = useStyles();
    let { id } = useParams<{ id: string }>();

    const { loading, error, data } = useQuery(GET_PERSONS_DETAILS, {
        variables: { id: Number(id) },
      });
  
    const mayBeRenderDetails = ()=>{
      if (loading) {
        return <p>Loading...</p>;
      };
      if(error){
          return <p>Failed to fetch the data</p>;
      }
      if(data){
        return <Person 
          person = {data.person}
      />
      }

      return;
    }

    return(
            <Paper className={classes.root}>
                    {mayBeRenderDetails()}
            </Paper>
    )    
}


export default PersonsDetails;