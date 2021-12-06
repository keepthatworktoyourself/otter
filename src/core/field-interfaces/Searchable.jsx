import React, {useCallback, useState, useRef} from 'react'
import {usePageData} from '../contexts/PageDataContext'
import {debounce_promise} from '../definitions/utils'
import components from '../definitions/components'
import PopupMenuAnimated from '../components/otter/PopupMenu'
import {classNames} from '../helpers/style'
import XCircleSolid from 'simple-react-heroicons/icons/XCircleSolid'
import {useThemeContext} from '../contexts/ThemeContext'

export default function Searchable({field_def, containing_data_item}) {
  const ctx                                  = usePageData()
  const theme_ctx                            = useThemeContext()
  const [search_term, set_search_term]       = useState(null)
  const [search_results, set_search_results] = useState([])
  const [error, set_error]                   = useState(null)
  const input_ref                            = useRef()
  const value         = containing_data_item[field_def.name]
  const debounce_ms   = field_def.debounce_ms || 500
  const search_func   = useCallback(debounce_promise(field_def.search, debounce_ms), [])

  function cb__change(ev) {
    const val = ev.target.value
    set_search_term(val)
    set_error(null)
    set_search_results([])

    if (val) {
      search_func(val)
        .then(set_search_results)
        .catch(set_error)
    }
  }

  function cb__select(i) {
    containing_data_item[field_def.name] = search_results[i]
    end_search()
  }

  function begin_search() {
    delete containing_data_item[field_def.name]
    set_search_term('')
    setTimeout(() => input_ref.current.focus())
  }

  function end_search() {
    set_search_term(null)
    set_search_results([])
    ctx.value_updated()
  }

  return (
    <div className="relative">
      {(search_term !== null || !value) && (
        <components.Input type="text"
                          value={search_term}
                          onChange={cb__change}
                          ref={input_ref} />
      )}

      {value && search_term === null && (
        <div className="flex items-start space-x-1">
          <div type="text"
               className={classNames(
                 'cursor-text inline-flex',
                 'text-xxs whitespace-nowrap',
                 'leading-none',
                 'outline-none',
                 'rounded-full',
                 'bg-gray-300',
                 theme_ctx.classes.typography.input_label,
               )}
               style={{padding: '0.7em 1.8em'}}
          >
            {value?.display || ''}
          </div>

          <div className={classNames(
            'svg-font',
            'text-xl cursor-pointer',
            theme_ctx.classes.skin.repeater_remove_item_btn,
          )}
               onClick={begin_search}
          >
            <XCircleSolid />
          </div>
        </div>
      )}


      <PopupMenuAnimated isOpen={search_results.length > 0}
                         items={search_results.map((item, i) => ({
                           label:   item.display,
                           onClick: () => cb__select(i),
                         }))}
                         className="absolute left-0 w-full -bottom-5" />


      {error && (
        <p className={classNames(
          'text-xs text-red-600 mt-1 pl-2',
          theme_ctx.classes.typography.copy,
        )}
        >
          {error}
        </p>
      )}
    </div>
  )
}

