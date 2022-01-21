export default {
  layout: {
    block_headers: {
      wrapper: 'text-xs',
      x_pad:   'px-4',
    },
  },
  typography: {
    heading:     'font-bold tracking-tight',
    sub_heading: 'font-semibold tracking-tight',
    copy:        'font-normal',
    input_label: 'font-semibold text-zinc-500 tracking-tight',
  },
  skin: {
    border_color:         'border-pink-200',
    border_color_lighter: 'border-zinc-100',
    border_focus:         'focus:border-zinc-500',
    switch:               {
      bg: {
        on:  'bg-pink-500',
        off: 'bg-zinc-200',
      },
      btn: 'bg-white shadow-lg',
    },
    block: {
      bg: 'bg-white',
    },
    input: {
      bg: 'bg-zinc-50',
    },
    block_headers: {
      bg:      'bg-pink-600',
      heading: 'text-zinc-50',
    },
    block_header_icon: {
      always:           'text-pink-300',
      default:          'hover:text-zinc-200',
      negative:         'hover:text-red-500',
      active:           'text-white',
      active_indicator: {
        bg:      'bg-zinc-700',
        opacity: 'opacity-60',
      },
    },
    add_block_btn: {
      bg:   'bg-zinc-900',
      text: 'text-white',
    },
    add_repeater_item_btn: {
      bg: 'bg-zinc-300 hover:bg-zinc-400',
    },
    repeater_remove_item_btn: 'text-zinc-300 hover:text-red-500',
    repeater_item:            {
      bg:        'bg-white',
      header_bg: 'bg-zinc-50',
    },
    clear_selection_btn: 'text-zinc-600 hover:text-zinc-400',
    modal:               {
      bg:        'bg-zinc-900',
      close_btn: 'text-zinc-900',
    },
    btns: {
      primary:   'bg-pink-600 border-pink-600 text-white',
      negative:  'bg-pink-600 border-pink-600 text-white',
      secondary: 'border-zinc-300 hover:border-zinc-800 text-zinc-900',
    },
    selector_btn: {
      active:  'bg-pink-600 text-white',
      default: 'bg-white text-pink-600',
    },
    pill: {
      bg:     'bg-pink-200',
      border: 'border border-pink-300',
    },
    popup_menu:  'bg-white hover:bg-zinc-50 border-zinc-100',
    text_editor: {
      bg: 'bg-zinc-50',
    },
    swatch_indicator_triangle: 'border-zinc-900',
  },
}
