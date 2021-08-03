import test from 'ava'
import test_data from './_test-data'
import test_blocks from './_test-blocks'
import Otter from '..'


// uid
// ------------------------------------

test('utils: uid provides uids', t => {
  Otter.Utils.uid.i = 0

  const uid1 = Otter.Utils.uid()
  const uid2 = Otter.Utils.uid()
  const uid3 = Otter.Utils.uid()

  t.deepEqual(['uid-0', 'uid-1', 'uid-2'], [uid1, uid2, uid3])
})


// retitle_field
// ------------------------------------

test('utils: retitle_field returns field with new name, description', t => {
  const f = {
    name: 'my_field',
    description: 'My field',
    type: Otter.Fields.TextInput,
  }

  const f__new_name = Otter.Utils.retitle_field(f, 'a_field')
  const f__new_desc = Otter.Utils.retitle_field(f, undefined, 'Enter a title')
  const f__new_both = Otter.Utils.retitle_field(f, 'content', 'Content')

  t.not(f, f__new_name)
  t.deepEqual(Object.assign({}, f, {name: 'a_field', description: undefined}),       f__new_name)
  t.deepEqual(Object.assign({}, f, {name: undefined, description: 'Enter a title'}), f__new_desc)
  t.deepEqual(Object.assign({}, f, {name: 'content', description: 'Content'}),       f__new_both)
})


// humanify_str
// ------------------------------------

test('utils: humanify_str removes -_, uppercases 1st letter and single-letter words', t => {
  t.is(
    'Hi there friendly person hello B',
    Otter.Utils.humanify_str('hi-there__friendlyPersonHelloB')
  )
})


// copy
// ------------------------------------

const nested_obj = {
  a: 'Text',
  b: 3.14159,
  c: {
    x: 7,
    y: true,
    z: { muffins: 100 },
  },
}

test('utils: copy: deep copies an object', t => {
  t.not(nested_obj, Otter.Utils.copy(nested_obj))
  t.deepEqual(nested_obj, Otter.Utils.copy(nested_obj))
})


// recursive_find
// ------------------------------------

test('utils: recursive_find: -> object matching callback', t => {
  const result = Otter.Utils.recursive_find(nested_obj, item => item.muffins === 100)
  t.is(nested_obj.c.z, result)
})

test('utils: recursive_find: -> null if not found', t => {
  const result = Otter.Utils.recursive_find(nested_obj, item => item.muffins === 600)
  t.is(null, result)
})

test('utils: recursive_find: can only be used to find objects', t => {
  const result = Otter.Utils.recursive_find(nested_obj, item => item === 7)
  t.is(null, result)
})


// find_block
// ------------------------------------

test('utils: find_block: finds block in block array given type', t => {
  t.is('B3', Otter.Utils.find_block(test_blocks(), 'B3').type)
})

test('utils: find_block: returns null if not found', t => {
  t.is(null, Otter.Utils.find_block(test_blocks(), 'Nonexistent'))
})

test('utils: find_block: handles nulls', t => {
  const o = {
    x: [
      { },  [ 6, 7, 8 ],  null,
    ],
  }
  t.is(null, Otter.Utils.find_block(o, 'X'))
})


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
]

test('utils: find_field: returns named field', t => {
  t.is(find_field__fields[1],        Otter.Utils.find_field(find_field__fields, 'field_2'))
  t.deepEqual(find_field__fields[0], Otter.Utils.find_field(find_field__fields, 'field_1'))
})

test('Utils.find_field: returns undefined if not found', t => {
  t.is(undefined, Otter.Utils.find_field(find_field__fields, 'another_field'))
})

test('Utils.find_field: copes with nulls', t => {
  t.is(undefined, Otter.Utils.find_field([ null ]))
})


// is_data_item
// ------------------------------------

test('utils: is_data_item fails if not object or has no __type', t => {
  t.is(false, Otter.Utils.is_data_item('x'))
  t.is(false, Otter.Utils.is_data_item(true))
  t.is(false, Otter.Utils.is_data_item({ lemurs: 6 }))
})

test('utils: is_data_item succeeds if is object with __type', t => {
  t.is(true, Otter.Utils.is_data_item({ __type: 'MyBlock' }))
})


// iterate
// ------------------------------------

test('utils: iterate iterates through nested object', t => {
  const obj = {
    a: [5, 'a', null],
    b: [false, { things: 3 }],
  }
  const exp = [obj, obj.a, 5, 'a', null, obj.b, false, {things: 3}, 3]
  const result = [ ]
  Otter.Utils.iterate(obj, item => result.push(item))
  t.deepEqual(exp, result)
})



// iterate_data
// ------------------------------------

test('utils: iterate_data does nothing on non-objects', t => {
  let calls = 0
  function counter(item) {
    calls += 1
  }
  Otter.Utils.iterate_data(7)
  t.is(0, calls)
})

test('utils: iterate_data iterates through nested data', t => {
  const results = [ ]
  function f(item) {
    results.push(item.__type)
  }
  Otter.Utils.iterate_data(test_data(), f)
  t.deepEqual(
    ['B1', 'B2', 'B3', 'AContentItem', 'B4', 'AnotherContentItem', 'OneMoreContentItem'],
    results
  )
})


// check_display_if
// ------------------------------------

test('utils: check_display_if errors', t => {
  const b0 = Otter.Utils.copy(test_blocks())[1]
  const b1 = Otter.Utils.copy(test_blocks())[1]
  const b2 = Otter.Utils.copy(test_blocks())[1]
  const b3 = Otter.Utils.copy(test_blocks())[1]
  const b4 = Otter.Utils.copy(test_blocks())[1]
  const b5 = Otter.Utils.copy(test_blocks())[1]

  b0.fields[0].display_if = 'invalid type'
  b1.fields[0].display_if = [{ rule: 'invalid' }]
  b2.fields[0].display_if = [{ sibling: 'nonexistent', equal_to: 3.14 }]
  b3.fields[0].display_if = [{ sibling: b3.fields[0].name, equal_to: 3.14 }]
  b4.fields[0].display_if = [{ sibling: b4.fields[0].name, matches: 394857 }]
  b5.fields[0].display_if = [{ sibling: b5.fields[0].name, doesnt_match: '*&^GBIO' }]

  const r0 = Otter.Utils.check_display_if(b0, b0.fields[0])
  const r1 = Otter.Utils.check_display_if(b1, b1.fields[0])
  const r2 = Otter.Utils.check_display_if(b2, b2.fields[0])
  const r3 = Otter.Utils.check_display_if(b3, b3.fields[0])
  const r4 = Otter.Utils.check_display_if(b4, b4.fields[0])
  const r5 = Otter.Utils.check_display_if(b5, b5.fields[0])

  t.deepEqual([`display_if must be an object or array of objects`], r0)
  t.deepEqual([`must have properties sibling, and equal_to|not_equal_to|matches|doesnt_match`], r1)
  t.deepEqual([`sibling does not exist in the block`], r2)
  t.deepEqual([`sibling cannot refer to the self field`], r3)
  t.deepEqual([`matches or doesnt_match must be a string that compiles to a regex`], r4)
  t.deepEqual([`matches or doesnt_match must be a string that compiles to a regex`], r5)
})


test('utils: check_display_if valid -> empty array', t => {
  const b = Otter.Utils.copy(test_blocks())[1]

  b.fields[1].display_if = [{
    sibling: 'size',
    equal_to: 'something',
  }]

  const r0 = Otter.Utils.check_display_if(b, b.fields[1])

  t.deepEqual([], r0)
})


// display_if
// ------------------------------------

test('utils: display_if passes through errors from check_display_if', t => {
  const block = Otter.Utils.copy(test_blocks())[1]
  block.fields[0].display_if = 'invalid'

  const result = Otter.Utils.display_if(block, block.fields[0].name)
  t.deepEqual({
    errors: ['display_if must be an object or array of objects'],
  }, result)
})


test('utils: display_if rule matches sibling value -> negative', t => {
  const block = Otter.Utils.copy(test_blocks())[1]
  block.fields[1].display_if = [{
    sibling: 'size',
    equal_to: 'something',
  }]
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data()[1])
  t.deepEqual({
    display: false,
    errors: [],
  }, result)
})


test('utils: display_if rule sibling has other value -> positive', t => {
  const block = Otter.Utils.copy(test_blocks())[1]
  block.fields[1].display_if = [{
    sibling: 'size',
    equal_to: 'regular',
  }]
  const result = Otter.Utils.display_if(block, block.fields[1].name, test_data()[1])
  t.deepEqual({
    display: true,
    errors: [],
  }, result)
})


test('utils: display_if not set -> positive', t => {
  const block = Otter.Utils.copy(test_blocks())[1]
  const result = Otter.Utils.display_if(block, block.fields[0].name)
  t.deepEqual({
    display: true,
    errors: [],
  }, result)
})


// item_has_data
// ------------------------------------

test('utils: all_items_exist_in: true if all items are in array', t => {
  t.falsy(Otter.Utils.all_items_exist_in([1, 2, 3], [2, 3, 4, 5, 6]))
  t.truthy(Otter.Utils.all_items_exist_in([1, 2, 3], [2, 3, 4, 5, 6, 1]))
})

test('utils: item_has_data: true if the item has more than just a __type property', t => {
  const item__null = null
  const item__string = 'string'
  const item__empty_obj = { }
  const item__only_type = { __type: 'X' }
  const item__type_and_uid = { __uid: 'a-uid' }
  const item__with_data = { __type: 'X', x: 'y' }

  t.falsy(Otter.Utils.item_has_data(item__null))
  t.falsy(Otter.Utils.item_has_data(item__string))
  t.falsy(Otter.Utils.item_has_data(item__empty_obj))
  t.falsy(Otter.Utils.item_has_data(item__only_type))
  t.falsy(Otter.Utils.item_has_data(item__type_and_uid))
  t.truthy(Otter.Utils.item_has_data(item__with_data))
})


// optional_nested_block__is_enabled
// ------------------------------------

test('utils: optional_nested_block__is_enabled: returns presence of field data, if not present in __enabled_nested_blocks', t => {
  const data_item__no_enabled_nested_blocks__field_null      = { my_nested_block: null }
  const data_item__no_enabled_nested_blocks__field_only_type = { my_nested_block: { __type: 'X' } }
  const data_item__no_enabled_nested_blocks__field_data      = { my_nested_block: { __type: 'X', x: 'y' } }
  const data_item__not_set_in_enabled_nested_blocks__field_null      = { __enabled_nested_blocks: { }, my_nested_block: null }
  const data_item__not_set_in_enabled_nested_blocks__field_only_type = { __enabled_nested_blocks: { }, my_nested_block: { __type: 'X' } }
  const data_item__not_set_in_enabled_nested_blocks__field_data      = { __enabled_nested_blocks: { }, my_nested_block: { __type: 'X', x: 'y' } }

  t.false(Otter.Utils.optional_nested_block__is_enabled('my_nested_block',  data_item__no_enabled_nested_blocks__field_null))
  t.false(Otter.Utils.optional_nested_block__is_enabled('my_nested_block',  data_item__no_enabled_nested_blocks__field_only_type))
  t.true(Otter.Utils.optional_nested_block__is_enabled('my_nested_block', data_item__no_enabled_nested_blocks__field_data))
  t.false(Otter.Utils.optional_nested_block__is_enabled('my_nested_block',  data_item__not_set_in_enabled_nested_blocks__field_null))
  t.false(Otter.Utils.optional_nested_block__is_enabled('my_nested_block',  data_item__not_set_in_enabled_nested_blocks__field_only_type))
  t.true(Otter.Utils.optional_nested_block__is_enabled('my_nested_block', data_item__not_set_in_enabled_nested_blocks__field_data))
})

test('utils: optional_nested_block__is_enabled: returns value from __enabled_nested_blocks if present', t => {
  const data_item__enabled_true = {
    __enabled_nested_blocks: { my_nested_block: true },
    my_nested_block: { },
  }
  const data_item__enabled_false = {
    __enabled_nested_blocks: { my_nested_block: false },
    my_nested_block: { },
  }

  t.true(Otter.Utils.optional_nested_block__is_enabled('my_nested_block', data_item__enabled_true))
  t.false(Otter.Utils.optional_nested_block__is_enabled('my_nested_block',  data_item__enabled_false))
})


// optional_nested_block__set_enabled
// ------------------------------------

test('utils: optional_nested_block__set_enabled -> sets entry if value true', t => {
  const data_item = {
    __enabled_nested_blocks: {
      nested_block1: true,
    },
  }
  const exp = Otter.Utils.copy(data_item)
  exp.__enabled_nested_blocks.nested_block2 = true
  Otter.Utils.optional_nested_block__set_enabled('nested_block2', data_item, true)
  t.deepEqual(exp, data_item)
})

test('utils: optional_nested_block__set_enabled -> creates __enabled_nested_blocks if not present', t => {
  const data_item = { }
  const exp = {
    __enabled_nested_blocks: {
      nested_block1: true,
    },
  }
  Otter.Utils.optional_nested_block__set_enabled('nested_block1', data_item, true)
  t.deepEqual(exp, data_item)
})

test('utils: optional_nested_block__set_enabled -> deletes entry if value false', t => {
  const data_item = {
    __enabled_nested_blocks: {
      nested_block1: true,
    },
  }
  const exp = {
    __enabled_nested_blocks: {
      nested_block1: false,
    },
  }
  Otter.Utils.optional_nested_block__set_enabled('nested_block1', data_item, false)
  t.deepEqual(exp, data_item)
})


// blocks_are_grouped
// ------------------------------------

test('utils: blocks_are_simple -> true if array', t => {
  t.is(false, Otter.Utils.blocks_are_simple({ }))
  t.is(true,  Otter.Utils.blocks_are_simple([ ]))
})

test('utils: blocks_are_grouped -> true if object', t => {
  t.is(false, Otter.Utils.blocks_are_grouped([ ]))
  t.is(true,  Otter.Utils.blocks_are_grouped({ }))
})


// rnd_str
// ------------------------------------

test('utils: rnd_str -> string of correct length', t => {
  t.is(52, Otter.Utils.rnd_str(52).length)
})


// upto
// ------------------------------------

test('utils: upto -> array of consecutive integers', t => {
  t.deepEqual([0, 1, 2, 3, 4], Otter.Utils.upto(5))
})

