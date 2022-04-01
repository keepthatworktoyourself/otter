export default {
  typography: {
    heading:     'font-bold tracking-tight text-zinc-800',
    sub_heading: 'font-semibold tracking-tight text-zinc-700',
    copy:        'font-normal text-zinc-500',
    input:       'font-formal text-zinc-700',
    input_label: 'font-semibold text-zinc-500 tracking-tight',
  },
  skin: {
    border_radius_default: 'rounded-none',
    border_color:          'border-zinc-200',
    border_color_lighter:  'border-zinc-100',
    border_focus:          'focus:border-zinc-500',
    switch:                {
      bg: {
        on:  'bg-zinc-700',
        off: 'bg-zinc-400',
      },
      btn: 'bg-white shadow-lg',
    },
    block: {
      border:        'border',
      border_radius: 'rounded-none',
      bg:            'bg-white',
      shadow:        'shadow-xl',
    },
    block_header: {
      bg:      'bg-zinc-800',
      border:  '',
      heading: '!text-zinc-50',
      y_pad:   'py-[1em]',
    },
    block_header_icon: {
      always:           '',
      default:          'text-zinc-400 hover:text-zinc-200',
      negative:         'text-zinc-400 hover:text-red-500',
      active:           'text-white',
      active_indicator: {
        bg:            'bg-zinc-700',
        opacity:       'opacity-60',
        border_radius: 'rounded-full',
      },
    },
    add_block_btn: {
      bg:   'bg-zinc-800',
      text: 'text-white',
    },
    add_repeater_item_btn: {
      bg: 'bg-zinc-300 hover:bg-zinc-400',
    },
    repeater_remove_item_btn: 'text-zinc-400 hover:text-red-500',
    repeater_item:            {
      border_radius: 'rounded-none',
      bg:            'bg-white',
      shadow:        'shadow-xl',
    },
    repeater_item_header: {
      bg:      'bg-white',
      border:  'border-b',
      heading: '',
      y_pad:   'py-[1em]',
    },
    repeater_item_header_icon: {
      always:           '',
      default:          'text-zinc-400 hover:text-zinc-500',
      negative:         'text-zinc-400 hover:text-red-500',
      active:           'text-zinc-800',
      active_indicator: {
        bg:            '',
        opacity:       'opacity-0',
        border_radius: '',
      },
    },
    input: {
      bg: 'bg-zinc-50',
    },
    tab_btn: {
      default: 'bg-zinc-100',
      active:  'bg-white',
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
      active:  'bg-zinc-300',
      default: 'bg-white',
    },
    pill: {
      bg:     'bg-zinc-200',
      border: 'border border-zinc-300',
    },
    popup_menu: {
      border_radius: '',
      shadow:        'shadow-xl',
    },
    popup_menu_item: {
      bg:           'bg-white hover:bg-zinc-50',
      border_color: 'border-zinc-100',
    },
    text_editor: {
      bg: 'bg-zinc-50',
    },
    swatch_indicator_triangle: 'border-zinc-900',
    media_picker:              {
      bg:              'bg-zinc-100',
      remove_item_btn: 'text-zinc-400 hover:text-red-500',
      add_btn:         {
        bg: 'bg-zinc-300 hover:bg-zinc-400',
      },
    },
  },
}
