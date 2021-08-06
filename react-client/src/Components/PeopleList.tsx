import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';

interface Column {
  id: 'name' | 'gender' | 'height' | 'mass';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: Column[] = [
  { 
    id: 'name', 
    label: 'Name',
    minWidth: 170 
  },
  { 
    id: 'gender', 
    label: 'Gender', 
    minWidth: 100 
  },
  {
    id: 'height',
    label: 'Height',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'mass',
    label: 'Mass',
    minWidth: 170,
    align: 'right',
  }
];

const useStyles = makeStyles({
  root: {
    paddingBottom: 20,
    width: '100%',
  },
  container: {
    marginTop: 50,
    marginBottom: 20,
    maxHeight: 500,
  },
  pagination:{
    marginTop: 5,
    marginLeft: 5,
  },
  row:{
    cursor: 'pointer'
  }
});

const GET_PAGE_PEOPLE = gql`
  query getPeoplePage($page: Int!) {
    peoplePage(page:$page){
      pages
      next
      previous
      people{
        id
        name
        gender
        height
        mass
      }
    }
  }
`;


const PeopleList=() => {
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = React.useState(1);

  const { loading, error, data } = useQuery(GET_PAGE_PEOPLE, {
    variables: { page },
  });

  let totalPages = 0;
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const navigateTo=(id:number)=>{
    history.push(`/details/${id}`);
  }

  const  maybeRenderTableRows = () => {
    if(loading){
      return <TableRow>
              <TableCell colSpan={4}  align="center">
                Loading...
              </TableCell>
            </TableRow>;
    }

    if(error){
      return <TableRow>
      <TableCell colSpan={4}  align="center">
        Something went wrong
      </TableCell>
    </TableRow>;
    }

    const dataRows = data.peoplePage.people;
    totalPages = data.peoplePage.pages;

    return dataRows.map((row: any, index: any) => (
        <TableRow className={classes.row} hover tabIndex={-1} key={row.id} onClick={()=>navigateTo(row.id)}>
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell key={column.id}>
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      ));
    
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              {maybeRenderTableRows()}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination 
        className={classes.pagination} 
        count={totalPages} 
        page={page}
        onChange={handleChangePage}
        variant="outlined"
       />
    </Paper>
  );
};

export default PeopleList;