import React from 'react';
import { shallow } from 'enzyme';
import { TaskUnitItem } from '../TaskUnitItem';

const relay = { environment: {} };
const taskUnit = {
  title: 'foo',
};

test('renders', () => {
  const wrapper = shallow(<TaskUnitItem relay={relay} taskUnit={taskUnit} />);

  expect(wrapper).toBeDefined();
});
