import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import {MemoryRouter} from 'react-router-dom';
import {act} from 'react-dom/test-utils';
import PersonsDetails, {GET_PERSONS_DETAILS} from '../Components/PersonsDetails';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

const mocks = {
    request: {
      query: GET_PERSONS_DETAILS,
      variables: {
        id: 2,
      },
    },
    result: {
      data: {
        person:{
            name: "Test Name",
            mass: 45,
            gender: "Male",
            height: 45,
            homeworld:{
                name: "Earth",
                population:590034,
                diameter:49033,
                terrain:"Desert",
                rotation_period: 573000
            }
        }
        },
    },
  }


  describe('test Persons Details component', () => {
    let wrapper;

    it('should render loading message', () => {  
      wrapper = mount(
        <MockedProvider mocks={[]} addTypename={false}>
            <MemoryRouter initialEntries={["/details/1"]}>
                <PersonsDetails />
          </MemoryRouter>
        </MockedProvider>,
      );
      
      expect(wrapper).toBeTruthy();
      expect(wrapper.text()).toContain("Loading...");
    });

    it('should render error message', async () => {   
        await act(async ()=>{
        wrapper = mount(
          <MockedProvider mocks={[]} addTypename={false}>
              <MemoryRouter initialEntries={["/details/1"]}>
                  <PersonsDetails />
            </MemoryRouter>
          </MockedProvider>,
        );
        });

        await act(()=>wait(0));
        wrapper.update();
        expect(wrapper).toBeTruthy();
        expect(wrapper.text()).toContain("Failed to fetch the data");
      });

});