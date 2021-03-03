import Otter from '..';


const test_data = [
  { __type: 'B1', },
  {
    __type: 'B2',
    size:   'regular',
    text:   'Hello',
  },
  {
    __type: 'B3',
    content_item: { __type: 'AContentItem', f: 'F' },
  },
  {
    __type: 'B4',
    content_items: [
      { __type: 'AnotherContentItem' },
      { __type: 'OneMoreContentItem' },
    ],
  },
];


const test_data__block_with_invalid_field_type = [
  {
    __type: 'BlockWithInvalidFieldType',
    text:   'Hello',
  },
];


function get_test_data() {
  return Otter.Utils.copy(test_data);
}


get_test_data.with_invalid_field_type = function() {
  return Otter.Utils.copy(test_data__block_with_invalid_field_type);
};


export default get_test_data;

