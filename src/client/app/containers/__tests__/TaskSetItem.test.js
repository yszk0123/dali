import React from 'react';
import { shallow } from 'enzyme';
import { TaskSetItem } from '../TaskSetItem';

const relay = { environment: {} };
const taskSet = {
  title: 'foo',
};

test('renders', () => {
  const wrapper = shallow(<TaskSetItem relay={relay} taskSet={taskSet} />);

  expect(wrapper).toBeDefined();
});
