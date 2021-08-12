import React from 'react';
import { makeStyles,createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Avatar } from '@material-ui/core';

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
      color: "#FFFFFF",
      backgroundColor: '#353b48',
      width: theme.spacing(7),
      height: theme.spacing(7),
      padding:10,
      marginLeft: 20,
      marginTop: 15,
    }
}));

export interface Planet{
    name: string,
    rotation_period: number,
    orbital_period: number,
    diameter: number,
    terrain: string,
    population: number
}

export interface PersonType{
    id: number,
    name: string,
    height: number,
    mass: number,
    gender: number,
    homeworld: Planet
  }

const PersonComponent = (prop: {person: PersonType}): JSX.Element =>{
    const classes = useStyles();
    const { person } = prop;

    return <Grid container spacing={2} >
    <Grid item xs={12} >
    <Avatar className={classes.avator}>{person.name.substring(0,1)}</Avatar>
    </Grid>
    <Grid container item xs={6} direction="column">
          <Typography gutterBottom variant="subtitle1">
            Personal Details
          </Typography>
          <Typography variant="body2" gutterBottom>
            {person.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Gender: {person.gender}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Mass: {person.mass}, Height: {person.height}
          </Typography>
        </Grid>
      <Grid container item xs={6} direction="column">
          <Typography gutterBottom variant="subtitle1">
            Home Planet Details
          </Typography>
          <Typography variant="body2" gutterBottom>
            Planet: {person.homeworld.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Population: {person.homeworld.population}
          </Typography>
          <Typography variant="body2" color="textSecondary">
          Diameter: {person.homeworld.diameter}, Terrian: {person.homeworld.terrain}
          </Typography>
      </Grid>
  </Grid>
}


export default PersonComponent;