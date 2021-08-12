import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Person from '../Components/ui/Person';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

const personData = {
    id: 1,
    name: "Test name",
    height: 30,
    mass: 60,
    gender: 23,
    homeworld: {
        name: "Earth",
        rotation_period: 34524,
        orbital_period: 324,
        diameter: 424,
        terrain: "Desert",
        population: 5000000
    }
}

  describe('test Person component', () => {
    it('should render Personal Details', () => {
      const wrapper=shallow(
          <Person person={personData} />
      );
      expect(wrapper.text()).toContain("Personal Details");
    });

});