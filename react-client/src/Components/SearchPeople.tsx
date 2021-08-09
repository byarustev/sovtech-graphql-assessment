import React from 'react';
import { makeStyles,createStyles, Theme } from '@material-ui/core/styles';
import { gql, useLazyQuery } from '@apollo/client';
import Person from './ui/Person';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { useState } from 'react';

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
    searchBtn:{
        marginLeft: 5,
        backgroundColor:"#2d3436",
        color: "#ffffff",
    }
}));

const SEARCH_PEOPLE = gql`
    query searchPeople($name: String!){
        searchPeople(name: $name){
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

const SearchPeople = () => {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [ getPersonsDetails, {loading, error, data} ] = useLazyQuery(SEARCH_PEOPLE);

    const handleSubmit = (event: React.ChangeEvent<{}>) => {
        event.preventDefault();
        if(name !== ""){
            getPersonsDetails({variables: {name}});
        }
    };

    
    const mayBeRenderSearchResults = ()=>{
      if (loading) return <p>Loading ...</p>;
      if(error){
          return (<p>Could not find what you are looking for.</p>)
      }
      if(data){
          if(data.searchPeople.length===0){
              return <p>No results found</p>
          }
          
      return data.searchPeople.map((person: any, index: number)=>
        <Person 
            key={index}
            person = {person}
        />
        )
      
      }
      return;
    }

    return(
        <React.Fragment>
            <Input placeholder="Search text" value={name} onChange={(e)=>setName(e.target.value)} />
            <Button variant="contained" className={classes.searchBtn} onClick={(e)=>handleSubmit(e)}>
                Search
            </Button>
            {mayBeRenderSearchResults()}
        </React.Fragment>
         
    )
    
}


export default SearchPeople;