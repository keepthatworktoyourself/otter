import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Editor from '../core/Editor';
import Block from '../core/Block';
import test_blocks from './_test-blocks';
import test_data from './_test-data';
import Otter from '..';

configure({ adapter: new Adapter() });


test('Editor: uid', t => {
  Otter.Utils.uid.i = 0;
  const e = new Editor();

  const uid1 = Otter.Utils.uid();
  const uid2 = Otter.Utils.uid();
  const uid3 = Otter.Utils.uid();

  t.deepEqual(['uid-0', 'uid-1', 'uid-2'], [uid1, uid2, uid3]);
});


test('Editor: blog_toggled calls delegate if present', t => {
  const e = new Editor();
  const f = new Editor();

  let called = 0;

  e.props = { delegate: { block_toggled() { called += 1; } } };
  f.props = { };

  e.block_toggled();
  t.is(1, called);

  f.block_toggled();
  t.is(1, called);
});


test('Editor: do_save_on_input saves if Save is OnInput', t => {
  const [e, f] = [new Editor(), new Editor()];
  let [e_saved, f_saved] = [false, false];

  e.save = () => e_saved = true;
  f.save = () => f_saved = true;

  e.props = { save: Otter.Save.OnInput               };
  f.props = { save: Otter.Save.WhenSaveButtonClicked };

  e.do_save_on_input();
  f.do_save_on_input();

  t.is(true, e_saved);
  t.is(false, f_saved);
});


test('Editor: save calls delegate', t => {
  const e = new Editor();
  let saved = false;
  e.props = { delegate: { save() { saved = true } } };
  e.save();
  t.is(true, saved);
});


test('Editor: msg on load_state error or unset', t => {
  const wrapper = shallow(<Editor />);
  const exp = <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>Error loading post data</div>
  t.is(true, wrapper.contains(exp));
  t.is(false, wrapper.contains('.container'));
});


test ('Editor: msg on load_state loading', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loading} />);
  const exp = <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>Loading...</div>
  t.is(true, wrapper.contains(exp));
  t.is(false, wrapper.contains('.container'));
});


test('Editor: msg on unknown load_state', t => {
  const wrapper = shallow(<Editor load_state='hello' />);
  const exp = <div className="bg-solid has-text-centered" style={{ padding: '1rem' }}>Unknown load state: hello</div>
  t.is(true, wrapper.contains(exp));
  t.is(false, wrapper.contains('.container'));
});


test('Editor: renders inner on load_state loaded', t => {
  const wrapper = shallow(<Editor load_state={Otter.State.Loaded} />);
  t.is(true, wrapper.exists('.container'));
});


test('Editor: renders save button when Save is WhenSaveButtonClicked (also by default)', t => {
  const e0 = shallow(<Editor load_state={Otter.State.Loaded} />);
  const e1 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.WhenSaveButtonClicked} />);
  const e2 = shallow(<Editor load_state={Otter.State.Loaded} save={Otter.Save.OnInput} />);
  t.is(true, e0.exists('.save-button'));
  t.is(true, e1.exists('.save-button'));
  t.is(false, e2.exists('.save-button'));
});


test('Editor: renders a Block for each data item', t => {
  const data         = test_data(false);
  const wrapper      = shallow(<Editor load_state={Otter.State.Loaded} blocks={test_blocks} data={data} />);
  const drop_wrapper = wrapper.find('Connect(Droppable)');
  const drop_inner   = shallow(drop_wrapper.prop('children')(
    {
      innerRef: '',
      droppableProps: [ ],
    },
    null
  ));

  t.is(data.length, drop_inner.at(0).children().length);
});

