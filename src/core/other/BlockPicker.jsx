import React from 'react'
import {XOutline} from '@graywolfai/react-heroicons'
import {usePageData} from '../PageDataContext'
import Icons from './Icons'
import {humanify_str} from '../definitions/utils'

export default function BlockPicker({block_index, iframe_container_info, scroll_offset}) {
  const ctx              = usePageData()
  const blocks           = ctx.blocks
  const block_group_keys = Object.keys(blocks)
  const container  = iframe_container_info || {
    y:      0,
    height: 0,
  }
  const offset = (scroll_offset || 0) + container.y
  const outer_max_height = container.height

  function close() {
    ctx.close_block_picker()
  }

  function cb__select(ev) {
    close()
    ctx.add_item(ev.currentTarget.getAttribute('data-block-type'), block_index)
  }

  return (
    <div className="absolute inset-0 p-4 z-20 bg-gray-900 bg-opacity-20">
      <div style={{
        transform:  `translateY(${offset}px`,
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        maxHeight:  'calc(100vh - 2rem)',
        overflowY:  'auto',
      }}
      >
        <div style={{maxHeight: outer_max_height || 'none'}}>
          <div className="relative p-4 pt-8 rounded-none bg-gray-50">

            {/* Close btn */}
            <div className="absolute" style={{top: '1rem', right: '1.2rem'}}>
              <span className="cursor-pointer" onClick={close}>
                <Icons.Icon Which={XOutline} />
              </span>
            </div>

            {/* Block groups */}
            {block_group_keys.map((k, i) => (
              <div className={ i < block_group_keys.length - 1 ? 'mb-6' : 'mb-4' } key={i}>
                <h3 className="font-semibold text-xs pl-1 pb-2 border-b">
                  {blocks[k].name || k}
                </h3>

                <div className="flex flex-wrap -mx-4 md:-mx-6">
                  {blocks[k].blocks.map((block, j) => (
                    <div className="p-4 md:p-6 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" key={block.type}>

                      <div className="shadow-lg border border-gray-100 w-full">
                        <div className="p-4">
                          <h3 className="font-semibold text-md">
                            {block.description || humanify_str(block.type)}
                          </h3>
                        </div>

                        <figure className="relative w-full overflow-hidden bg-gray-300" style={{paddingTop: '60%'}}>
                          <img className="absolute inset-0"
                               src={block.thumbnail} />
                        </figure>

                        <footer className="p-4 text-xs text-center">
                          <a className="cursor-pointer text-blue-500 hover:text-blue-300 active:text-blue-800"
                             onClick={cb__select}
                             data-block-type={block.type}
                          >
                            Insert
                          </a>
                        </footer>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

