export default {
  layout: {
    block_headers: {
      wrapper: 'text-xs',
      x_pad:   'px-4',
    },
  },
  typography: {
    heading:     'font-bold tracking-tighter',
    sub_heading: 'font-semibold tracking-tight',
    copy:        'font-normal',
    input_label: 'font-semibold text-gray-500 tracking-tight',
  },
  skin: {
    border_color:         'border-gray-200',
    border_color_lighter: 'border-gray-100',
    border_focus:         'focus:border-gray-500',
    switch:               {
      bg: {
        on:  'bg-gray-800',
        off: 'bg-gray-200',
      },
      btn: 'bg-white shadow-lg',
    },
    block: {
      bg: 'bg-white',
    },
    input: {
      bg: 'bg-gray-50',
    },
    block_headers: {
      bg:      'bg-gray-900',
      heading: 'text-gray-50 font-medium tracking-tight',
    },
    block_header_icon: {
      always:           'text-gray-400',
      default:          'hover:text-gray-200',
      negative:         'hover:text-red-500',
      active:           'text-white',
      active_indicator: {
        bg:      'bg-gray-700',
        opacity: 'opacity-60',
      },
    },
    add_block_btn: {
      bg:   'bg-gray-900',
      text: 'text-white',
    },
    add_repeater_item_btn: {
      bg: 'bg-gray-300 hover:bg-gray-400',
    },
    repeater_remove_item_btn: 'text-gray-300 hover:text-red-500',
    repeater_item:            {
      bg:        'bg-white',
      header_bg: 'bg-gray-50',
    },
    clear_selection_btn: 'text-gray-600 hover:text-gray-400',
    modal:               {
      bg:        'bg-gray-900',
      close_btn: 'text-gray-900',
    },
    btns: {
      primary:   'bg-gray-800 border-gray-800 text-white',
      negative:  'bg-red-500 border-red-500 text-white',
      secondary: 'border-gray-300 hover:border-gray-800 text-gray-900',
    },
    selector_btn: {
      active:  'bg-gray-300',
      default: 'bg-white',
    },
    popup_menu:  'bg-white hover:bg-gray-50 border-gray-100',
    text_editor: {
      bg: 'bg-gray-50',
    },
    swatch_indicator_triangle: 'border-gray-900',
  },
}

