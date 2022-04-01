import React from 'react'
import TrashSolid from 'simple-react-heroicons/icons/TrashSolid'
import OBtn from '../../default-ui/OBtn'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'

export default function BlockDeleteConfirmPanel({set_show_confirm_deletion, delete_func}) {
  const theme_ctx = useThemeContext()

  return (
    <div className={classNames(
      theme_ctx.classes.block.theme.bg,
      'absolute-fill text-center',
    )}
    >
      <div className="absolute-center px-8">
        <div className={classNames(
          theme_ctx.classes.typography.sub_heading,
          'text-xs leading-none',
        )}
        >Delete block?</div>
        <div className="mt-3 flex space-x-2 text-xxxs">
          <OBtn label="Cancel"
                onClick={() => set_show_confirm_deletion(false)} />
          <OBtn label="Delete"
                TrailingIcon={TrashSolid}
                buttonStyle="negative"
                onClick={delete_func} />
        </div>
      </div>
    </div>
  )
}