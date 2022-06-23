import React, {useState} from 'react'
import {usePageData} from '../../../contexts/PageDataContext'
import {humanify_str} from '../../../definitions/utils'
import {classNames} from '../../../helpers/style'
import {useThemeContext} from '../../../contexts/ThemeContext'
import OInput from '../../default-ui/OInput'
import SearchSolid from 'simple-react-heroicons/icons/SearchSolid'

const TagPill = ({className_text, className_bg_color, name, opts, active, onClick}) => {
  return (
    <li className={classNames(
      'select-none',
      'cursor-pointer',
      'rounded-full',
      'mb-1 mr-2',
      'leading-none',
      'px-[1em] pt-[0.5em] pb-[0.6em]',
      className_text,
      className_bg_color,
    )}
        onClick={onClick}
        style={active ? {backgroundColor: opts.colors.bg, color: opts.colors.text} : {}}
    >{name}</li>
  )
}

export default function BlockPicker({
  set_block_to_insert,
  insert_at_index,
  close,
  block_index,
  initial_selected_tags = {},
}) {
  const ctx                                = usePageData()
  const theme_ctx                          = useThemeContext()
  const blocks                             = ctx.blocks
  const block_group_keys                   = Object.keys(blocks)
  const design_tags                        = theme_ctx?.design_tags
  const cls                                = theme_ctx.classes
  const [selected_tags, set_selected_tags] = useState(initial_selected_tags)

  const do_set_selected_tag = tag_key => {
    const new_selected = {...selected_tags}
    new_selected[tag_key] = !selected_tags[tag_key]
    set_selected_tags(new_selected)
  }

  return (
    <div className="relative bg-white"
         style={{width: '95vw', maxWidth: '1600px', height: '100%'}}
    >
      <div className="flex max-h-full">
        <div className={classNames(
          'sticky top-0',
          'w-1/4 border-r',
          'px-10 pt-10',
          cls.skin.border_color,
          cls.skin.block_header.bg,
        )}
        >
          <div className="mb-3">
            <h4 className={classNames(
              cls.typography.heading,
              'text-lg mb-1',
            )}
            >
              Insert Block
            </h4>

            <p className={classNames(
              cls.typography.copy,
            )}
            >
              Click on the pills below to show blocks that have those fields. You can select multiple at once.
            </p>

            <a className={classNames(
              'inline-block',
              'cursor-pointer',
              'mt-6 select-none',
              'border-b border-dashed',
              cls.skin.border_color,
              cls.typography.input_label,
              !Object.values(selected_tags).includes(true) && 'opacity-0 pointer-events-none',
            )}
               onClick={() => set_selected_tags({})}
            >Clear selected</a>
          </div>

          {design_tags && (
            <ul className="flex flex-wrap">
              {Object.entries(design_tags).map(([key, opts], i) => {
                return (
                  <TagPill key={i}
                           className_bg_color={cls.skin.pill.bg}
                           className_text={cls.typography.sub_heading}
                           onClick={() => do_set_selected_tag(key)}
                           active={selected_tags[key]}
                           name={opts.label}
                           opts={opts} />
                )
              })}
            </ul>
          )}
        </div>
        <div className="w-3/4 flex flex-col">
          <div className={classNames('px-16 pt-10 pb-2 grid grid-cols-3 gap-10')}>
            <div className="col-span-3">
              <p className={classNames(cls.typography.input_label, 'mb-1')}>Search blocks</p>
              <OInput placeholder="Heros, Carousels, Sliders, Cards..." className="flex-1" Icon={SearchSolid} />
              {/* <p className={classNames(cls.typography.sub_heading)}>24 Blocks Found</p> */}
            </div>
          </div>
          <div className="flex-1 overflow-scroll px-16">
            {block_group_keys.map((k, i) => {
              return (
                <div key={i}
                     className={classNames(
                       'select-none',
                       i !== 0 && 'border-t',
                       'pt-9 pb-9',
                       cls.skin.border_color,
                     )}
                >
                  <h3 className={classNames(
                    'text-sm mb-4 leading-none',
                    cls.typography.heading,
                  )}
                  >
                    {blocks[k].name || k}
                  </h3>
                  <div className="grid grid-cols-3 gap-10">
                    {blocks[k].blocks.map(block => {
                      return (
                        <>
                          {/* <pre className="text-xxs">
                            {JSON.stringify(block, null, 4)}
                          </pre> */}
                          <figure className="cursor-pointer"
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
                              cls.skin.border_color,
                            )}
                                 style={{
                                   backgroundImage: 'url(' + (block.thumbnail || 'https://res.cloudinary.com/drtjqpz13/image/upload/v1636189866/Wombat/hero-b.png') + ')',
                                 }} />
                            <figcaption className={classNames(
                              'text-xs pt-2',
                              cls.typography.sub_heading,
                            )}
                            >
                              {block.description || humanify_str(block.type)}
                            </figcaption>
                          </figure>
                        </>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
