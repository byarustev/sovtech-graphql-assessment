import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import SearchPeople, {SEARCH_PEOPLE} from '../Components/SearchPeople';
import {act} from 'react-dom/test-utils';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

const mocks = {
    request: {
      query: SEARCH_PEOPLE,
    },
    result: {
      data: {
        searchPeople:[
            {
                name:"Polly Skywalker",
                mass: 34,
                gender: "Male",
                height: 23,
                homeworld:{
                    name: "Home World",
                    population: 34098034,
                    diameter: 48934,
                    terrain:"Desert",
                    rotation_period: 23798034
                }
            }
          ]
        },
    },
  }


  describe('test SearchPeople  component', () => {
    
    it('should render Search button', () => {  
      const wrapper = mount(
        <MockedProvider mocks={[]} addTypename={false}>
          <SearchPeople />
        </MockedProvider>,
      );
      
      expect(wrapper).toBeTruthy();
      expect(wrapper.text()).toContain("Search");
    });

    it('should update input value', async () => {
        let wrapper;
        await act(async ()=>{
        wrapper = mount(
            <MockedProvider mocks={[mocks]} addTypename={false}>
              <SearchPeople />
            </MockedProvider>,
          );
        });
        const value = "Polly Skywalker";
        const searchInputTextID = '[data-testid="search-input"]';
        const textField = wrapper.find(searchInputTextID).first();

        act(() => {
            textField.props().onChange({ target: { value } })
            textField.simulate('change');
        });
        wrapper.update()
        expect(wrapper.find(searchInputTextID).first().props()['value']).toBe(value);

      });

      it('should update search data on submit', async () => {
        let wrapper;
        await act(async ()=>{
        wrapper = mount(
            <MockedProvider mocks={[mocks]} addTypename={false}>
              <SearchPeople />
            </MockedProvider>,
          );
        });
        const value = "Polly Skywalker";
        const searchInputIdText = '[data-testid="search-input"]';
        const searchButtonIdText = '[data-testid="search-button"]';
        const textField = wrapper.find(searchInputIdText).first();
        const searchButton = wrapper.find(searchButtonIdText).first();

        act(() => {
            textField.props().onChange({ target: { value } })
            textField.simulate('change');
        });
        wrapper.update()

        act(() => {
            searchButton.props().onClick({preventDefault: jest.fn()})
            searchButton.simulate('click');
        });
        await act(()=>wait(0));
        wrapper.update() 
        
        expect(wrapper.text()).toContain("Loading...");
      });

});