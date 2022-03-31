export default {
  typography: {
    heading:     'font-bold tracking-tight text-slate-700',
    sub_heading: 'font-semibold tracking-tight text-slate-700',
    copy:        'font-normal text-slate-500',
    input:       'font-formal text-slate-700',
    input_label: 'font-semibold text-slate-500 tracking-tight',
  },
  skin: {
    border_radius_default: 'rounded-[3px]',
    border_color:          'border-slate-200',
    border_color_lighter:  'border-slate-100',
    border_focus:          'focus:border-blue-500',
    switch:                {
      bg: {
        on:  'bg-blue-500',
        off: 'bg-slate-300',
      },
      btn: 'bg-white shadow-lg',
    },
    block: {
      border:        'border',
      border_radius: 'rounded-md',
      bg:            'bg-white',
      shadow:        'shadow-md',
    },
    block_header: {
      bg:      'bg-slate-50',
      border:  '',
      heading: '',
      y_pad:   'py-[1em]',
    },
    block_header_icon: {
      always:           'text-slate-400 text-[1.2em]',
      default:          'hover:text-slate-500',
      negative:         'hover:text-red-500',
      active:           'text-blue-600 hover:text-blue-600',
      active_indicator: {
        bg:            '',
        opacity:       'opacity-0',
        border_radius: '',
      },
    },
    add_block_btn: {
      bg:   'bg-blue-600',
      text: 'text-white',
    },
    input: {
      bg: 'bg-slate-50',
    },
    tab_btn: {
      default: 'bg-slate-100',
      active:  'bg-white',
    },
    add_repeater_item_btn: {
      bg: 'bg-slate-300 hover:bg-slate-400',
    },
    repeater_remove_item_btn: 'text-slate-400 hover:text-red-500',
    repeater_item:            {
      border_radius: 'rounded-md',
      bg:            'bg-white',
      shadow:        'hover:shadow-md',
    },
    repeater_item_header: {
      bg:      'bg-slate-50',
      border:  '',
      heading: '',
      y_pad:   'py-[1em]',
    },
    repeater_item_header_icon: {
      always:           'text-slate-400 text-[1.2em]',
      default:          'hover:text-slate-500',
      negative:         'hover:text-red-500',
      active:           'text-blue-600 hover:text-blue-600',
      active_indicator: {
        bg:            '',
        opacity:       'opacity-0',
        border_radius: '',
      },
    },
    clear_selection_btn: 'text-slate-600 hover:text-slate-400',
    modal:               {
      bg:        'bg-zinc-900',
      close_btn: 'text-blue-600',
    },
    btns: {
      primary:   'bg-blue-600 border-blue-600 text-white',
      negative:  'bg-red-500 border-red-500 text-white',
      secondary: 'border-slate-300 hover:border-blue-500 text-slate-900 hover:text-blue-800',
    },
    selector_btn: {
      active:  'bg-blue-500 text-white',
      default: 'bg-white',
    },
    pill: {
      bg:     'bg-slate-200',
      border: 'border border-slate-300',
    },
    popup_menu: {
      border_radius: 'rounded-md',
      shadow:        'shadow-xl',
    },
    popup_menu_item: {
      bg:           'bg-white hover:bg-slate-50',
      border_color: 'border-slate-100',
    },
    text_editor: {
      bg: 'bg-slate-50',
    },
    swatch_indicator_triangle: 'border-slate-900',
    media_picker:              {
      bg:              'bg-slate-100',
      remove_item_btn: 'text-slate-400 hover:text-red-500',
      add_btn:         {
        bg: 'bg-slate-300 hover:bg-slate-400',
      },
    },
  },
}
