import React from 'react';
import FileInput from '../generic/FileInput';
import TestRenderer from 'react-test-renderer';

it('renders correctly', () => {
  // mocks
  const value = '';

  const tree = TestRenderer
    .create(<FileInput value={value}></FileInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});