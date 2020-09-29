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
    content_item: { __type: 'AContentItem' },
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


function get_data_set(data_set, with_uids) {
  const data = Otter.Utils.copy(data_set);
  if (with_uids) {
    Otter.Utils.uid.i = 0;
    Otter.Utils.set_uids(data);
  }
  return data;
}


function get_data(with_uids) {
  return get_data_set(test_data, with_uids);
}


get_data.with_invalid_field_type = function(with_uids) {
  return get_data_set(test_data__block_with_invalid_field_type, with_uids);
};


export default get_data;

