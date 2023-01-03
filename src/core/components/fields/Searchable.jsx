import React, {useCallback, useRef, useState} from 'react'
import SearchSolid from 'simple-react-heroicons/icons/SearchSolid'
import OInput from '../default-ui/OInput'
import PopupMenuAnimated from '../otter/PopupMenu'
import {usePageData} from '../../contexts/PageDataContext'
import {useThemeContext} from '../../contexts/ThemeContext'
import {debounce_promise} from '../../definitions/utils'
import {classNames} from '../../helpers/style'

export default function Searchable({field_def, parent_block_data}) {
  const ctx                                  = usePageData()
  const theme_ctx                            = useThemeContext()
  const [search_term, set_search_term]       = useState(null)
  const [search_results, set_search_results] = useState([])
  const [error, set_error]                   = useState(null)
  const value         = parent_block_data[field_def.name]
  const debounce_ms   = field_def.debounce_ms || 500
  const search_func   = useCallback(debounce_promise(field_def.search, debounce_ms), [])
  const input_ref = useRef(null)

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
    parent_block_data[field_def.name] = search_results[i]
    end_search()
  }

  function end_search() {
    set_search_term(parent_block_data[field_def.name]?.display || '')
    set_search_results([])
    ctx.value_updated()
    input_ref.current.blur()
  }

  return (
    <div className="relative">
      <OInput type="text"
              Icon={SearchSolid}
              value={value && search_term === null ? value?.display : search_term}
              onChange={cb__change}
              ref={input_ref} />


      <PopupMenuAnimated isOpen={search_results.length > 0}
                         items={search_results.map((item, i) => ({
                           label:   item.display,
                           onClick: () => cb__select(i),
                         }))}
                         close={end_search}
                         className="absolute left-0 w-full top-4 z-10"
                         classNameTypography={theme_ctx.classes.typography.input_label} />


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

