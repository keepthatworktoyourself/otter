import React from 'react';
import TextInput from '../generic/TextInput';
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
    .create(<TextInput action={onChange} data={data} values={values}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});