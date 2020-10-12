import test from 'ava';
import test_data from './_test-data';
import test_blocks from './_test-blocks';
import Otter from '..';


// uid
// ------------------------------------

test('utils: uid provides uids', t => {
  Otter.Utils.uid.i = 0;

  const uid1 = Otter.Utils.uid();
  const uid2 = Otter.Utils.uid();
  const uid3 = Otter.Utils.uid();

  t.deepEqual(['uid-0', 'uid-1', 'uid-2'], [uid1, uid2, uid3]);
});


// retitle_field
// ------------------------------------

test('utils: retitle_field returns field with new name, description', t => {
  const f = {
    name: 'my_field',
    description: 'My field',
    type: Otter.Fields.TextInput,
  };

  const f__new_name = Otter.Utils.retitle_field(f, 'a_field');
  const f__new_desc = Otter.Utils.retitle_field(f, null, 'Enter a title');
  const f__new_both = Otter.Utils.retitle_field(f, 'content', 'Content');

  t.not(f, f__new_name);
  t.deepEqual(Object.assign({}, f, {name: 'a_field'}), f__new_name);
  t.deepEqual(Object.assign({}, f, {description: 'Enter a title'}), f__new_desc);
  t.deepEqual(Object.assign({}, f, {name: 'content', description: 'Content'}), f__new_both);
});


// copy
// ------------------------------------

const nested_obj = {
  a: 'Text',
  b: 3.14159,
  c: {
    x: 7,
    y: true,
    z: { },
  },
};

test('utils: copy: deep copies an object', t => {
  t.not(nested_obj, Otter.Utils.copy(nested_obj));
  t.deepEqual(nested_obj, Otter.Utils.copy(nested_obj));
});


// recursive_find
// ------------------------------------

test('utils: recursive_find: -> item matching callback', t => {
  t.is(7, Otter.Utils.recursive_find(nested_obj, item => item === 7));
  t.is(nested_obj.c, Otter.Utils.recursive_find(nested_obj, item => item && item.y === true));
});

test('utils: recursive_find: -> null if not found', t => {
  t.is(null, Otter.Utils.recursive_find(nested_obj, item => item && item.lemons === 6));
});


// find_block
// ------------------------------------

test('utils: find_block: finds block in block array given type', t => {
  t.is('B3', Otter.Utils.find_block(test_blocks(), 'B3').type);
});

test('utils: find_block: returns null if not found', t => {
  t.is(null, Otter.Utils.find_block(test_blocks(), 'Nonexistent'));
});


// find_field
// ------------------------------------

const find_field__fields = [
  {
    name: 'field_1',
    type: Otter.Fields.TextInput,
  },
  {
    name: 'field_2',
    type: Otter.Fields.Radios,
  },
];

test('utils: find_field: returns named field', t => {
  t.is(find_field__fields[1],        Otter.Utils.find_field(find_field__fields, 'field_2'));
  t.deepEqual(find_field__fields[0], Otter.Utils.find_field(find_field__fields, 'field_1'));
});

test('Utils.find_field: returns undefined if not found', t => {
  t.is(undefined, Otter.Utils.find_field(find_field__fields, 'another_field'));
});


// is_data_item
// ------------------------------------

test('utils: is_data_item fails if not object or has no __type', t => {
  t.is(false, Otter.Utils.is_data_item('x'));
  t.is(false, Otter.Utils.is_data_item(true));
  t.is(false, Otter.Utils.is_data_item({ lemurs: 6 }));
});

test('utils: is_data_item succeeds if is object with __type', t => {
  t.is(true, Otter.Utils.is_data_item({ __type: 'MyBlock' }));
});


// iterate_data
// ------------------------------------

test('utils: iterate_data does nothing on non-objects', t => {
  let calls = 0;
  function counter(item) {
    calls += 1;
  }
  Otter.Utils.iterate_data(7);
  t.is(0, calls);
});

test('utils: iterate_data iterates through nested data', t => {
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


// check_display_if
// ------------------------------------

test('utils: check_display_if errors', t => {
  const b0 = Otter.Utils.copy(test_blocks())[1];
  const b1 = Otter.Utils.copy(test_blocks())[1];
  const b2 = Otter.Utils.copy(test_blocks())[1];
  const b3 = Otter.Utils.copy(test_blocks())[1];

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
  const b0 = Otter.Utils.copy(test_blocks())[1];
  const b1 = Otter.Utils.copy(test_blocks())[1];

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
  const block = Otter.Utils.copy(test_blocks())[1];
  block.fields[0].display_if = 'invalid';

  const result = Otter.Utils.display_if(block, block.fields[0].name);
  t.deepEqual({
    errors: ['must be an array of rules or single rule object'],
  }, result);
});


test('utils: display_if rule matches sibling value -> negative', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  block.fields[1].display_if = {
    sibling: 'size',
    equal_to: 'something',
  };
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data()[1]);
  t.deepEqual({
    display: false,
    errors: [],
  }, result);
});


test('utils: display_if rule sibling has other value -> positive', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  block.fields[1].display_if = {
    sibling: 'size',
    equal_to: 'regular',
  };
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data()[1]);
  t.deepEqual({
    display: true,
    errors: [],
  }, result);
});


test('utils: display_if not set -> positive', t => {
  const block = Otter.Utils.copy(test_blocks())[1];
  const result = Otter.Utils.display_if(block, block.fields[0].name);
  t.deepEqual({
    display: true,
    errors: [],
  }, result);
});


// optional_subblock__is_enabled
// ------------------------------------

test('utils: optional_subblock__is_enabled: returns presence of field data, if not present in __enabled_subblocks', t => {
  const data_item__no_enabled_subblocks__field_null = { my_subblock: null };
  const data_item__no_enabled_subblocks__field_data = { my_subblock: { __type: 'X' } };
  const data_item__not_set_in_enabled_subblocks__field_null = { __enabled_subblocks: { }, my_subblock: null };
  const data_item__not_set_in_enabled_subblocks__field_data = { __enabled_subblocks: { }, my_subblock: { __type: 'X' } };

  t.falsy(Otter.Utils.optional_subblock__is_enabled('my_subblock',  data_item__no_enabled_subblocks__field_null));
  t.truthy(Otter.Utils.optional_subblock__is_enabled('my_subblock', data_item__no_enabled_subblocks__field_data));
  t.falsy(Otter.Utils.optional_subblock__is_enabled('my_subblock',  data_item__not_set_in_enabled_subblocks__field_null));
  t.truthy(Otter.Utils.optional_subblock__is_enabled('my_subblock', data_item__not_set_in_enabled_subblocks__field_data));
});

test('utils: optional_subblock__is_enabled: returns value from __enabled_subblocks if present', t => {
  const data_item__enabled_true = {
    __enabled_subblocks: { my_subblock: true },
    my_subblock: { },
  };
  const data_item__enabled_false = {
    __enabled_subblocks: { my_subblock: false },
    my_subblock: { },
  };

  t.truthy(Otter.Utils.optional_subblock__is_enabled('my_subblock', data_item__enabled_true));
  t.falsy(Otter.Utils.optional_subblock__is_enabled('my_subblock',  data_item__enabled_false));
});


// optional_subblock__set_enabled
// ------------------------------------

test('utils: optional_subblock__set_enabled -> sets entry if value true', t => {
  const data_item = {
    __enabled_subblocks: {
      subblock1: true,
    },
  };
  const exp = Otter.Utils.copy(data_item);
  exp.__enabled_subblocks.subblock2 = true;
  Otter.Utils.optional_subblock__set_enabled('subblock2', data_item, true);
  t.deepEqual(exp, data_item);
});

test('utils: optional_subblock__set_enabled -> creates __enabled_subblocks if not present', t => {
  const data_item = { };
  const exp = {
    __enabled_subblocks: {
      subblock1: true,
    },
  };
  Otter.Utils.optional_subblock__set_enabled('subblock1', data_item, true)
  t.deepEqual(exp, data_item);
});

test('utils: optional_subblock__set_enabled -> deletes entry if value false', t => {
  const data_item = {
    __enabled_subblocks: {
      subblock1: true,
    },
  };
  const exp = {
    __enabled_subblocks: {
      subblock1: false,
    },
  };
  Otter.Utils.optional_subblock__set_enabled('subblock1', data_item, false)
  t.deepEqual(exp, data_item);
});


// blocks_are_grouped
// ------------------------------------

test('utils: blocks_are_grouped -> false if no blocks', t => {
  t.is(false, Otter.Utils.blocks_are_grouped([ ]));
});

test('utils: blocks_are_grouped -> false if top-level items have type prop', t => {
  t.is(false, Otter.Utils.blocks_are_grouped([{ type: 'ABlock' }]));
});

test('utils: blocks_are_grouped -> false if top-level items missing name or blocks props', t => {
  t.is(false, Otter.Utils.blocks_are_grouped([{ property: 'irrelevant' }]));
});

test('utils: blocks_are_grouped -> true if top-level items has name and blocks props', t => {
  t.is(true, Otter.Utils.blocks_are_grouped([{ name: 'Headers', blocks: [ ] }]));
});


// rnd_str
// ------------------------------------

test('utils: rnd_str -> string of correct length', t => {
  t.is(52, Otter.Utils.rnd_str(52).length);
});


// upto
// ------------------------------------

test('utils: upto -> array of consecutive integers', t => {
  t.deepEqual([0, 1, 2, 3, 4], Otter.Utils.upto(5));
});

