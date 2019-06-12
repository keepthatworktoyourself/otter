import React from 'react';
import Select from '../generic/Select';
import TestRenderer from 'react-test-renderer';

it('renders correctly', () => {
  // mocks
  const values = {
    content: '',
  };
  const data = {
    label: '',
    options: [],
  };
  const onChange = () => {
    return;
  }

  const tree = TestRenderer
    .create(<Select action={onChange} data={data} values={values}></Select>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});