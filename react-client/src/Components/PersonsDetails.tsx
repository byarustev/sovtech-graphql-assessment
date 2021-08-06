import React from 'react';
import { makeStyles,createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    useParams
  } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    avator:{
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: '#353b48',
      width: theme.spacing(7),
      height: theme.spacing(7),
      padding:10,
      marginLeft: 20,
      marginTop: 15,
    }
}));

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
  
    const mayBeRenderDetails = ()=>{
      if (loading) return <p>Loading ...</p>;
      if(error){
          return (<p>Failed to fetch the data</p>)
      }

      return <Grid container spacing={2} >
          <Grid item xs={12} >
          <Avatar className={classes.avator}>{data.person.name.substring(0,1)}</Avatar>
          </Grid>
          <Grid item xs={6} direction="column">
               
                <Typography gutterBottom variant="subtitle1">
                  Personal Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {data.person.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Gender: {data.person.gender}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mass: {data.person.mass}, Height: {data.person.height}
                </Typography>
              </Grid>
            <Grid item xs={6} direction="column">
            
            <Typography gutterBottom variant="subtitle1">
                Home Planet Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Planet: {data.person.homeworld.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Population: {data.person.homeworld.population}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                Diameter: {data.person.homeworld.diameter}, Terrian: {data.person.homeworld.terrain}
                </Typography>
            </Grid>
        </Grid>
    }

    return(
            <Paper className={classes.root}>
                    {mayBeRenderDetails()}
            </Paper>
    )
    
}


export default PersonsDetails;