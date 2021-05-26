const basics = {
  button_bg: 'bg-gray-50',
  button_bg_hover: 'hover:bg-gray-200',
  button_bg_active: 'active:bg-gray-300',
}

const block_bg_color = {
  1: 'bg-gray-200',
  2: 'bg-gray-300',
  3: 'bg-gray-400',
}

export default {
  ...basics,
  button: `border ${basics.button_bg} cursor-pointer rounded-full`,
  button_hover_borders: 'hover:border-gray-400 active:border-gray-700',
  button_pad: `py-2 px-3`,
  button_pad_sm: `py-1 px-2`,
  dropdown_button: `border appearance-none ${basics.button_bg} cursor-pointer py-1 px-2 rounded hover:border-gray-400 active:border-gray-700`,
  button_dark_border: 'border-gray-400 hover:border-gray-600 active:border-gray-800',
  button_dark_border_static: 'border-gray-400',
  block_bg_color: 'bg-gray-50',
  block_title: 'text-xl font-semibold',
  nested_block: (depth) => `${block_bg_color[depth]} rounded p-4`,
  nested_block_border: 'border border-gray-400',
  field: 'mb-3',
}

