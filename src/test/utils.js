import test from 'ava'
import test_data from './_test-data'
import test_blocks from './_test-blocks'
import * as Utils from '../core/definitions/utils'
import Fields from '../core/definitions/fields'


// uid
// ------------------------------------

test('utils: uid provides uids', t => {
  Utils.uid.i = 0

  const uid1 = Utils.uid()
  const uid2 = Utils.uid()
  const uid3 = Utils.uid()

  t.deepEqual(['uid-0', 'uid-1', 'uid-2'], [uid1, uid2, uid3])
})


// retitle_field
// ------------------------------------

test('utils: retitle_field returns field with new name, description', t => {
  const field = {
    name:        'my_field',
    description: 'My field',
    type:        Fields.TextInput,
  }

  const f__new_name = Utils.retitle_field(field, 'a_field')
  const f__new_desc = Utils.retitle_field(field, undefined, 'Enter a title')
  const f__new_both = Utils.retitle_field(field, 'content', 'Content')

  t.not(field, f__new_name)
  t.deepEqual(Object.assign({}, field, {name: 'a_field', description: undefined}),       f__new_name)
  t.deepEqual(Object.assign({}, field, {name: undefined, description: 'Enter a title'}), f__new_desc)
  t.deepEqual(Object.assign({}, field, {name: 'content', description: 'Content'}),       f__new_both)
})


// humanify_str
// ------------------------------------

test('utils: humanify_str removes -_, uppercases 1st letter and single-letter words', t => {
  t.is(
    'Hi there friendly person hello B',
    Utils.humanify_str('hi-there__friendlyPersonHelloB'),
  )
})


// copy
// ------------------------------------

const nested_obj = {
  aa: 'Text',
  bb: 3.14159,
  cc: {
    xx: 7,
    yy: true,
    zz: {muffins: 100},
  },
}

test('utils: copy: deep copies an object', t => {
  t.not(nested_obj, Utils.copy(nested_obj))
  t.deepEqual(nested_obj, Utils.copy(nested_obj))
})


// recursive_find
// ------------------------------------

test('utils: recursive_find: -> object matching callback', t => {
  const result = Utils.recursive_find(nested_obj, item => item.muffins === 100)
  t.is(nested_obj.cc.zz, result)
})

test('utils: recursive_find: -> null if not found', t => {
  const result = Utils.recursive_find(nested_obj, item => item.muffins === 600)
  t.is(null, result)
})

test('utils: recursive_find: can only be used to find objects', t => {
  const result = Utils.recursive_find(nested_obj, item => item === 7)
  t.is(null, result)
})


// find_block
// ------------------------------------

test('utils: find_block: finds block in block array given type', t => {
  t.is('B3', Utils.find_block(test_blocks(), 'B3').type)
})

test('utils: find_block: returns null if not found', t => {
  t.is(null, Utils.find_block(test_blocks(), 'Nonexistent'))
})

test('utils: find_block: handles nulls', t => {
  const obj = {
    x: [
      { },  [6, 7, 8],  null,
    ],
  }
  t.is(null, Utils.find_block(obj, 'X'))
})


// find_field
// ------------------------------------

const find_field__fields = [
  {
    name: 'field_1',
    type: Fields.TextInput,
  },
  {
    name: 'field_2',
    type: Fields.Radios,
  },
]

test('utils: find_field: returns named field', t => {
  t.is(find_field__fields[1],        Utils.find_field(find_field__fields, 'field_2'))
  t.deepEqual(find_field__fields[0], Utils.find_field(find_field__fields, 'field_1'))
})

test('Utils.find_field: returns undefined if not found', t => {
  t.is(undefined, Utils.find_field(find_field__fields, 'another_field'))
})

test('Utils.find_field: copes with nulls', t => {
  t.is(undefined, Utils.find_field([null]))
})


// is_data_item
// ------------------------------------

test('utils: is_data_item fails if not object or has no __type', t => {
  t.is(false, Utils.is_data_item('x'))
  t.is(false, Utils.is_data_item(true))
  t.is(false, Utils.is_data_item({lemurs: 6}))
})

test('utils: is_data_item succeeds if is object with __type', t => {
  t.is(true, Utils.is_data_item({__type: 'MyBlock'}))
})


// iterate
// ------------------------------------

test('utils: iterate iterates through nested object', t => {
  const obj = {
    aa: [5, 'a', null],
    bb: [false, {things: 3}],
  }
  const exp = [obj, obj.aa, 5, 'a', null, obj.bb, false, {things: 3}, 3]
  const result = []
  Utils.iterate(obj, item => result.push(item))
  t.deepEqual(exp, result)
})



// iterate_data
// ------------------------------------

test('utils: iterate_data does nothing on non-objects', t => {
  Utils.iterate_data(7)
  t.is(1, 1)
})

test('utils: iterate_data iterates through nested data', t => {
  const results = []
  function func(item) {
    results.push(item.__type)
  }
  Utils.iterate_data(test_data(), func)
  t.deepEqual(
    ['B1', 'B2', 'B3', 'AContentItem', 'B4', 'AnotherContentItem', 'OneMoreContentItem'],
    results,
  )
})


// check_display_if
// ------------------------------------

test('utils: check_display_if errors', t => {
  const b0 = Utils.copy(test_blocks())[1]
  const b1 = Utils.copy(test_blocks())[1]
  const b2 = Utils.copy(test_blocks())[1]
  const b3 = Utils.copy(test_blocks())[1]
  const b4 = Utils.copy(test_blocks())[1]
  const b5 = Utils.copy(test_blocks())[1]

  b0.fields[0].display_if = 'invalid type'
  b1.fields[0].display_if = [{rule: 'invalid'}]
  b2.fields[0].display_if = [{sibling: 'nonexistent', equal_to: 3.14}]
  b3.fields[0].display_if = [{sibling: b3.fields[0].name, equal_to: 3.14}]
  b4.fields[0].display_if = [{sibling: b4.fields[0].name, matches: 394857}]
  b5.fields[0].display_if = [{sibling: b5.fields[0].name, doesnt_match: '*&^GBIO'}]

  const r0 = Utils.check_display_if(b0, b0.fields[0])
  const r1 = Utils.check_display_if(b1, b1.fields[0])
  const r2 = Utils.check_display_if(b2, b2.fields[0])
  const r3 = Utils.check_display_if(b3, b3.fields[0])
  const r4 = Utils.check_display_if(b4, b4.fields[0])
  const r5 = Utils.check_display_if(b5, b5.fields[0])

  t.deepEqual([`display_if must be an object or array of objects`], r0)
  t.deepEqual([`must have properties sibling, and equal_to|not_equal_to|matches|doesnt_match`], r1)
  t.deepEqual([`'sibling' does not exist in the block`], r2)
  t.deepEqual([`'sibling' cannot refer to same field`], r3)
  t.deepEqual([`matches or doesnt_match must be a string that compiles to a regex`], r4)
  t.deepEqual([`matches or doesnt_match must be a string that compiles to a regex`], r5)
})


test('utils: check_display_if valid -> empty array', t => {
  const block = Utils.copy(test_blocks())[1]

  block.fields[1].display_if = [{
    sibling:  'size',
    equal_to: 'something',
  }]

  const r0 = Utils.check_display_if(block, block.fields[1])
  t.deepEqual([], r0)
})


// display_if
// ------------------------------------

test('utils: display_if passes through errors from check_display_if', t => {
  const block = Utils.copy(test_blocks())[1]
  block.fields[0].display_if = 'invalid'

  const result = Utils.display_if(block, block.fields[0].name)
  t.deepEqual({
    errors: ['display_if must be an object or array of objects'],
  }, result)
})


test('utils: display_if rule matches sibling value -> negative', t => {
  const block = Utils.copy(test_blocks())[1]
  block.fields[1].display_if = [{
    sibling:  'size',
    equal_to: 'something',
  }]
  const result = Utils.display_if(block, block.fields[1].name, test_data()[1])
  t.deepEqual({
    display: false,
    errors:  [],
  }, result)
})


test('utils: display_if rule sibling has other value -> positive', t => {
  const block = Utils.copy(test_blocks())[1]
  block.fields[1].display_if = [{
    sibling:  'size',
    equal_to: 'regular',
  }]
  const result = Utils.display_if(block, block.fields[1].name, test_data()[1])
  t.deepEqual({
    display: true,
    errors:  [],
  }, result)
})


test('utils: display_if not set -> positive', t => {
  const block = Utils.copy(test_blocks())[1]
  const result = Utils.display_if(block, block.fields[0].name)
  t.deepEqual({
    display: true,
    errors:  [],
  }, result)
})


// blocks_are_grouped
// ------------------------------------

test('utils: blocks_are_simple -> true if array', t => {
  t.is(false, Utils.blocks_are_simple({ }))
  t.is(true,  Utils.blocks_are_simple([]))
})

test('utils: blocks_are_grouped -> true if object', t => {
  t.is(false, Utils.blocks_are_grouped([]))
  t.is(true,  Utils.blocks_are_grouped({ }))
})


// rnd_str
// ------------------------------------

test('utils: rnd_str -> string of correct length', t => {
  t.is(52, Utils.rnd_str(52).length)
})


// upto
// ------------------------------------

test('utils: upto -> array of consecutive integers', t => {
  t.deepEqual([0, 1, 2, 3, 4], Utils.upto(5))
})


// evaluate
// ------------------------------------

test('utils: evaluate -> result', t => {
  t.is(7, Utils.evaluate(7))
  t.is(7, Utils.evaluate(() => 7))
  t.is(undefined, Utils.evaluate(undefined))
})

