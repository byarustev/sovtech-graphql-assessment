// import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme'
import TestRenderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { PageProvider } from '../PagesContext';
import gql from 'graphql-tag'
import ListPeople from '../Components/ListPeople';
import { render, screen } from '@testing-library/react';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import TableRow from '@material-ui/core/TableRow';
Enzyme.configure({ adapter: new Adapter() })

const GET_PAGE_PEOPLE_QUERY = gql`
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

const mocks = [
  {
    request: {
      query: GET_PAGE_PEOPLE_QUERY,
      variables: {
        page: 1,
      },
    },
    result: {
      data: {
        "peoplePage": {
          "pages": 9,
          "next": "https://www.swapi.tech/api/people?page=2&limit=10",
          "previous": null,
          "people": [
            {
              "id": 1,
              "name": "Luke Skywalker",
              "mass": "77",
              "gender": "male"
            },
            {
              "id": 2,
              "name": "C-3PO",
              "mass": "75",
              "gender": "n/a"
            },
            {
              "id": 3,
              "name": "R2-D2",
              "mass": "32",
              "gender": "n/a"
            },
            {
              "id": 4,
              "name": "Darth Vader",
              "mass": "136",
              "gender": "male"
            }
            
          ]
        }
        },
    },
  },
];


  describe('test People List component', () => {
    
    it('should render loading', () => {
          
      const wrapper = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <PageProvider>
          <ListPeople page={1} />
          </PageProvider>
        </MockedProvider>,
      );
      const loading = screen.getByText(/Loading.../i);
      expect(loading).toBeInTheDocument();
    });

    it('should render table rows equal', async () => {
      const wrapper = TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <PageProvider>
          <ListPeople page={1} />
          </PageProvider>
        </MockedProvider>,
      );
      
      await new Promise(resolve => setTimeout(resolve, 0));
      const tableRows = wrapper.root.findAllByType(TableRow);
      // const tableBody = screen.getAllByTestId("test-table-body");
      console.log(tableRows.length)
    });


});