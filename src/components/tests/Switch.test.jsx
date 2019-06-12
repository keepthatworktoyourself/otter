import React from 'react';
import Switch from '../generic/Switch';
import TestRenderer from 'react-test-renderer';

it('renders correctly', () => {
  // mocks
  const values = {
    content: '',
  };
  const data = {
    label: '',
  };
  const onChange = () => {
    return;
  }

  const tree = TestRenderer
    .create(<Switch action={onChange} data={data} values={values}></Switch>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});