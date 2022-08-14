import React from 'react'
import {usePageData} from '../../../contexts/PageDataContext'
import {humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'

export default function BlockPicker({
  set_block_to_insert,
  insert_at_index,
  close,
}) {
  const ctx              = usePageData()
  const theme_ctx        = useThemeContext()
  const block_defs       = ctx.block_defs
  const block_group_keys = Object.keys(block_defs)

  return (
    <div className="relative p-10 bg-white"
         style={{width: '95vw', maxWidth: '1200px'}}
    >
      {block_group_keys.map((k, i) => {
        const isLast = block_group_keys.length - 1 === i

        return (
          <div key={i}
               className={classNames(
                 i !== 0 && 'border-t pt-9',
                 !isLast && 'pb-9',
                 theme_ctx.classes.skin.border_color,
               )}
          >
            <h3 className={classNames(
              'text-sm mb-4 leading-none',
              theme_ctx.classes.typography.heading,
            )}
            >
              {block_defs[k].name || k}
            </h3>

            <div className="grid grid-cols-4 gap-10">
              {block_defs[k].blocks.map(block => (
                <figure className="cursor-pointer"
                        key={block.type}
                        onClick={ev => {
                          set_block_to_insert({
                            type: ev.currentTarget.getAttribute('data-block-type'),
                            insert_at_index,
                          })
                          close?.()
                        }}
                        data-block-type={block.type}
                >
                  <div className={classNames(
                    'bg-center bg-cover aspect-16x10 border',
                    theme_ctx.classes.skin.border_color,
                  )}
                       style={{
                         backgroundImage: 'url(' + (block.thumbnail || 'https://res.cloudinary.com/drtjqpz13/image/upload/v1636189866/Wombat/hero-b.png') + ')',
                       }} />

                  <figcaption className={classNames(
                    'text-xs pt-2',
                    theme_ctx.classes.typography.sub_heading,
                  )}
                  >
                    {block.description || humanify_str(block.type)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
