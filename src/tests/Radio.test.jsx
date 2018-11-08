import React from 'react';
import Radio from '../generic/Radio';
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
    .create(<Radio action={onChange} data={data} values={values}></Radio>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});