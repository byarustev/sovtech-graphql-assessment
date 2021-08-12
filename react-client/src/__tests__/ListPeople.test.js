import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { PageProvider } from '../PagesContext';
import {act} from 'react-dom/test-utils';
import ListPeople, {GET_PAGE_PEOPLE_QUERY} from '../Components/ListPeople';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

const mocks = {
    request: {
      query: GET_PAGE_PEOPLE_QUERY,
      variables: {
        page: 1,
      },
    },
    result: {
      data: {
        peoplePage: {
          pages: 9,
          next:"",
          previous: "",
          people: [
            {
              id: 1,
              name: "Polly Skywalker",
              mass: 77,
              height: 45,
              gender: "male"
            },
            {
              id: 2,
              name: "Tony Jack",
              mass: 77,
              height: 30,
              gender: "female"
            },
            {
              id: 3,
              name: "Mike Jos",
              mass: 77,
              height: 79,
              gender: "male"
            }
          ]
        }
        },
    },
  }

  describe('test People List component', () => {
    let wrapper;

    it('should render loading', () => {  
      wrapper = mount(
        <MockedProvider mocks={[]} addTypename={false}>
          <PageProvider>
          <ListPeople page={1} />
          </PageProvider>
        </MockedProvider>,
      );
      
      expect(wrapper).toBeTruthy();
      expect(wrapper.text()).toContain("Loading...");
    });

    it('should render table people rows', async () => {
      
      await act(async ()=>{
        wrapper = mount(
          <MockedProvider mocks={[mocks]} addTypename={false}>
            <PageProvider>
            <ListPeople page={1} />
            </PageProvider>
          </MockedProvider>,
        );
      })

      await act(()=>wait(0));
      wrapper.update();
      expect(wrapper).toBeTruthy();
      expect(wrapper.text()).toContain("Polly Skywalker");
    });

});