import React from 'react'
import {usePageData} from '../../../contexts/PageDataContext'
import {humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'

export default function BlockPicker({
  set_block_to_insert,
  close,
  block_index,
}) {
  const ctx              = usePageData()
  const theme_ctx        = useThemeContext()
  const blocks           = ctx.blocks
  const block_group_keys = Object.keys(blocks)

  return (
    <div className="relative p-10 bg-white"
         style={{width: '95vw', maxWidth: '1200px'}}
    >
      {block_group_keys.map((k, i) => (
        <div key={i}
             className={classNames(
               i !== 0 && 'border-t pt-7',
               i === 0 && 'pb-7',
               theme_ctx.classes.skin.border_color,
             )}
        >
          <h3 className={classNames(
            'text-sm mb-4',
            theme_ctx.classes.typography.heading,
          )}
          >
            {blocks[k].name || k}
          </h3>

          <div className="grid grid-cols-4 gap-10">
            {blocks[k].blocks.map(block => (
              <figure className={classNames(
                'cursor-pointer',
              )}
                      key={block.type}
                      onClick={ev => {
                        set_block_to_insert({
                          type:  ev.currentTarget.getAttribute('data-block-type'),
                          index: block_index,
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
                  'text-xs pt-3',
                  theme_ctx.classes.typography.heading,
                )}
                >
                  {block.description || humanify_str(block.type)}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
