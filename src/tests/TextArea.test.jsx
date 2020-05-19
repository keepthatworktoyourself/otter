import React from 'react';
import TextArea from '../generic/TextArea';
import TestRenderer from 'react-test-renderer';

it('renders correctly', () => {
  // mocks
  const values = {
    content: '',
  };
  const onChange = () => {
    return;
  }

  const tree = TestRenderer
    .create(<TextArea action={onChange} values={values}></TextArea>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});