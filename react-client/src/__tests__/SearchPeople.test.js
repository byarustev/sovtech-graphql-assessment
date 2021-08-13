import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import SearchPeople from '../Components/SearchPeople';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

  describe('test SearchPeople  component', () => {
    let wrapper;

    it('should render Search button', () => {  
      wrapper = mount(
        <MockedProvider mocks={[]} addTypename={false}>
          <SearchPeople />
        </MockedProvider>,
      );
      
      expect(wrapper).toBeTruthy();
      expect(wrapper.text()).toContain("Search");
    });


});