import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import {PageContext} from '../PagesContext';
import SearchPerson from './SearchPeople';

interface Column {
  id: 'name' | 'gender' | 'height' | 'mass';
  label: string;
  minWidth?: number;
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
  },
  {
    id: 'mass',
    label: 'Mass',
    minWidth: 170,
  }
];

const useStyles = makeStyles({
  root: {
    marginTop: 10,
    paddingBottom: 20,
    width: '100%',
  },
  container: {
    marginTop: 15,
    marginBottom: 20,
    maxHeight: 500,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
    maxHeight: 500,
    overflowY: "scroll"
  },
  appBar:{
    background:"#2d3436",
  },
  pagination:{
    marginTop: 5,
    marginLeft: 5,
  },
  row:{
    cursor: 'pointer'
  }
});

export const GET_PAGE_PEOPLE_QUERY = gql`
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel=(props: TabPanelProps) =>{
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
          children
      )}
    </div>
  );
}

const a11yProps=(index: any)=> {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

interface LinkTabProps {
  label?: string;
  href?: string;
}

const LinkTab=(props: LinkTabProps) =>{
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const ListPeople=(): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useContext(PageContext);

  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const { loading, error, data } = useQuery(GET_PAGE_PEOPLE_QUERY, {
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

    if(data){
    const dataRows = data.peoplePage.people;
    totalPages = data.peoplePage.pages;

    return dataRows.map((row: any) => (
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

    return;
  }

  return (
    <Paper className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={handleTabChange}
          data-testid="home-page-tab"
          TabIndicatorProps={{ style: { background: "#ffffff" } }}
        >
          <LinkTab label="Home"  {...a11yProps(0)} />
          <LinkTab label="Search" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
      {/* start home content */}
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
          <TableBody id="people-table-body">
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
      {/* end home content */}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Container className={classes.searchContainer}>
          <SearchPerson />
        </Container>
      </TabPanel>
      
    </Paper>
  );
};

export default ListPeople;