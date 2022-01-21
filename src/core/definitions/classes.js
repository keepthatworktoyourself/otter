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
    input_label: 'font-semibold text-zinc-500 tracking-tight',
  },
  skin: {
    border_color:         'border-zinc-200',
    border_color_lighter: 'border-zinc-100',
    border_focus:         'focus:border-zinc-500',
    switch:               {
      bg: {
        on:  'bg-zinc-800',
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
      bg:      'bg-zinc-900',
      heading: 'text-zinc-50',
      y_pad:   'py-[1em]',
    },
    block_header_icon: {
      always:           'text-zinc-400',
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
      primary:   'bg-zinc-800 border-zinc-800 text-white',
      negative:  'bg-red-500 border-red-500 text-white',
      secondary: 'border-zinc-300 hover:border-zinc-800 text-zinc-900',
    },
    selector_btn: {
      active:  'bg-zinc-300 text-zinc-600',
      default: 'bg-white',
    },
    pill: {
      bg:     'bg-zinc-200',
      border: 'border border-zinc-300',
    },
    popup_menu:  'bg-white hover:bg-zinc-50 border-zinc-100',
    text_editor: {
      bg: 'bg-zinc-50',
    },
    swatch_indicator_triangle: 'border-zinc-900',
  },
}
