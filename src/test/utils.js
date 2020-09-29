import test from 'ava';
import test_data from './_test-data';
import test_blocks from './_test-blocks';
import Otter from '..';


// is_data_item
// ------------------------------------

test('is_data_item: fails if not data object', t => {
  t.is(false, Otter.Utils.is_data_item('x'));
  t.is(false, Otter.Utils.is_data_item(true));
  t.is(false, Otter.Utils.is_data_item({ lemurs: 6 }));
});

test('is_data_item: succeeds if data object', t => {
  t.is(true, Otter.Utils.is_data_item({
    __type:  'MyBlock',
    content: 'Hi there',
  }));
});


// iterate_data
// ------------------------------------

test('iterate_data: does nothing on non-objects', t => {
  let calls = 0;
  function counter(item) {
    calls += 1;
  }
  Otter.Utils.iterate_data(7);
  t.is(0, calls);
});

test('iterate_data: iterates through nested data', t => {
  const results = [ ];
  function f(item) {
    results.push(item.__type);
  }
  Otter.Utils.iterate_data(test_data(), f);
  t.deepEqual(
    ['B1', 'B2', 'B3', 'AContentItem', 'B4', 'AnotherContentItem', 'OneMoreContentItem'],
    results
  );
});


// set_uids
// ------------------------------------

test('utils: set_uids sets uids recursively on data', t => {
  const data = Otter.Utils.copy(test_data(false));
  t.is(undefined, data[0].__uid);

  data[0].__uid = 'existing-uids-not-changed-7';
  Otter.Utils.set_uids(data);

  t.deepEqual([
    {
      __type: 'B1',
      __uid:  'existing-uids-not-changed-7',
    },
    {
      __type: 'B2',
      __uid:  'uid-0',
      size:   'regular',
      text:   'Hello',
    },
    {
      __type: 'B3',
      __uid:  'uid-1',
      content_item: {
        __type: 'AContentItem',
        __uid:  'uid-2',
      },
    },
    {
      __type: 'B4',
      __uid:  'uid-3',
      content_items: [
        {
          __type: 'AnotherContentItem',
          __uid:  'uid-4',
        },
        {
          __type: 'OneMoreContentItem',
          __uid:  'uid-5',
        },
      ],
    },
  ], data);
});


// check_display_if
// ------------------------------------

test('utils: check_display_if errors', t => {
  const b0 = Otter.Utils.copy(test_blocks)[1];
  const b1 = Otter.Utils.copy(test_blocks)[1];
  const b2 = Otter.Utils.copy(test_blocks)[1];
  const b3 = Otter.Utils.copy(test_blocks)[1];

  b0.fields[0].display_if = 'invalid type';
  b1.fields[0].display_if = [{ rule: 'invalid' }];
  b2.fields[0].display_if = [{ sibling: 'nonexistent', equal_to: 3.14 }];
  b3.fields[0].display_if = [{ sibling: b3.fields[0].name, equal_to: 3.14 }];

  const r0 = Otter.Utils.check_display_if(b0, b0.fields[0]);
  const r1 = Otter.Utils.check_display_if(b1, b1.fields[0]);
  const r2 = Otter.Utils.check_display_if(b2, b2.fields[0]);
  const r3 = Otter.Utils.check_display_if(b3, b3.fields[0]);

  t.deepEqual([`must be an array of rules or single rule object`], r0);
  t.deepEqual([`must have properties 'sibling', and either 'equal_to' or 'not_equal_to'`], r1);
  t.deepEqual([`sibling does not exist in the block`], r2);
  t.deepEqual([`sibling cannot refer to the self field`], r3);
});


test('utils: check_display_if valid -> empty array', t => {
  const b0 = Otter.Utils.copy(test_blocks)[1];
  const b1 = Otter.Utils.copy(test_blocks)[1];

  const display_if = {
    sibling: 'size',
    equal_to: 'something',
  };
  b0.fields[1].display_if = display_if;
  b1.fields[1].display_if = [display_if];

  const r0 = Otter.Utils.check_display_if(b0, b0.fields[1]);
  const r1 = Otter.Utils.check_display_if(b1, b1.fields[1]);

  t.deepEqual([], r0);
  t.deepEqual([], r1);
});


// display_if
// ------------------------------------

test('utils: display_if passes through errors from check_display_if', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  block.fields[0].display_if = 'invalid';

  const result = Otter.Utils.display_if(block, block.fields[0].name);
  t.deepEqual({
    errors: ['must be an array of rules or single rule object'],
  }, result);
});


test('utils: display_if rule matches sibling value -> negative', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  block.fields[1].display_if = {
    sibling: 'size',
    equal_to: 'something',
  };
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data(true)[1]);
  t.deepEqual({
    display: false,
    errors: [],
  }, result);
});


test('utils: display_if rule sibling has other value -> positive', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  block.fields[1].display_if = {
    sibling: 'size',
    equal_to: 'regular',
  };
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data(true)[1]);
  t.deepEqual({
    display: true,
    errors: [],
  }, result);
});


test('utils: display_if not set -> positive', t => {
  const block = Otter.Utils.copy(test_blocks)[1];
  const result = Otter.Utils.display_if(block, block.fields[0].name);
  t.deepEqual({
    display: true,
    errors: [],
  }, result);
});

