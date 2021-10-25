import React, {useCallback, useState, useRef} from 'react'
import XOutline from 'simple-react-heroicons/icons/XOutline'
import {usePageData} from '../PageDataContext'
import Icons from '../other/Icons'
import FieldLabel from '../other/FieldLabel'
import PopupMenu from '../other/PopupMenu'
import {humanify_str, debounce_promise} from '../definitions/utils'
import styles from '../definitions/styles'

export default function Searchable({field_def, containing_data_item, is_top_level}) {
  const ctx = usePageData()
  const [search_term, set_search_term]       = useState(null)
  const [search_results, set_search_results] = useState([])
  const [error, set_error]                   = useState(null)
  const input_ref                            = useRef()
  const value         = containing_data_item[field_def.name]
  const label         = field_def.description || humanify_str(field_def.name)
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
    <div className={`${styles.field}`}>
      <FieldLabel label={label} is_top_level={is_top_level} />

      {(search_term !== null || !value) && (
        <input type="text"
               value={search_term}
               onChange={cb__change}
               ref={input_ref}
               className={`
                 w-full
                 outline-none rounded
                 ${styles.button_pad} ${styles.control_bg} ${styles.control_border}
                 ${styles.control_border__focus}
               `} />
      )}

      {value && search_term === null && (
        <div type="text"
             className={`
               w-full
               cursor-text
               text-xs leading-tight
               outline-none rounded
               ${styles.button_pad} ${styles.control_bg} ${styles.control_border}
               py-1
               ${styles.control_border__focus}
             `}
        >
          <span className="inline-block bg-gray-300 py-1 px-2 rounded">
            {value?.display || ''}
            <Icons.Icon Which={XOutline}
                        onClick={begin_search}
                        style={{
                          display:       'inline-block',
                          lineHeight:    '1',
                          marginLeft:    '0.35rem',
                          cursor:        'pointer',
                          verticalAlign: 'bottom',
                          position:      'relative',
                          bottom:        '1px',
                        }} />
          </span>
        </div>
      )}

      {search_results.length > 0 && (
        <div>
          <PopupMenu items={search_results.map(item => item.display)}
                     cb={cb__select} />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-semibold mt-1 pl-2">
          {error}
        </p>
      )}
    </div>
  )
}

