import React from 'react'
import DocumentOutline from 'simple-react-heroicons/icons/DocumentOutline'
import DocumentTextOutline from 'simple-react-heroicons/icons/DocumentTextOutline'
import DocumentChartBarOutline from 'simple-react-heroicons/icons/DocumentChartBarOutline'
import FilmOutline from 'simple-react-heroicons/icons/FilmOutline'
import ChartBarSquareOutline from 'simple-react-heroicons/icons/ChartBarSquareOutline'
import PresentationChartBarOutline from 'simple-react-heroicons/icons/PresentationChartBarOutline'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import {usePageData} from '../../contexts/PageDataContext'
import AddItemPillBtn from '../otter/other/AddItemPillBtn'
import MinusCircleSolid from 'simple-react-heroicons/icons/MinusCircleSolid'


function MediaPickerImagePreviewIcon({Icon, theme_ctx}) {
  return (
    <p className="text-zinc-300">
      <Icon style={{
        width:   '3rem',
        height:  '3rem',
        display: 'inline-block',
        stroke:  'currentColor',
      }} />
    </p>
  )
}


function MediaPickerImagePreview({value, className}) {
  const url_components = value.url.split('.')
  const ext = url_components[url_components.length - 1].toLowerCase()
  const directly_previewed_types = ['jpeg', 'jpg', 'png', 'gif']
  const Img = ({src, className}) => <img src={src} className={className} />

  let inner

  if (!value?.url) {
    inner = null
  }

  else if (value.thumbnail) {
    inner = <Img src={value.thumbnail} className={className} />
  }

  else if (directly_previewed_types.includes(ext)) {
    inner = <Img src={value.url} className={className} />
  }

  else {
    const Icon = {
      pdf:  DocumentChartBarOutline,
      doc:  DocumentTextOutline,
      docx: DocumentTextOutline,
      xls:  ChartBarSquareOutline,
      xlsx: ChartBarSquareOutline,
      ppt:  PresentationChartBarOutline,
      pptx: PresentationChartBarOutline,
      mov:  FilmOutline,
      mp4:  FilmOutline,
      webp: FilmOutline,
    }[ext] || DocumentOutline
    inner = <MediaPickerImagePreviewIcon Icon={Icon} />
  }

  return inner
}


export default function MediaPicker({field_def, parent_block_data}) {
  const ctx = usePageData()
  const theme_ctx = useThemeContext()
  const value = parent_block_data[field_def.name]
  const txt_open = field_def.open_library_text || 'Select media item'

  function clear() {
    parent_block_data[field_def.name] = null
    ctx.value_updated()
    ctx.redraw()
  }

  function set_value_callback(value) {
    parent_block_data[field_def.name] = value
    ctx.value_updated()
    ctx.redraw()
  }

  return (
    <div className={classNames(
      value ? 'p-4 pt-5' : 'p-3',
      'cursor-default',
      'relative',
      'border border-dashed',
      'text-center',
      theme_ctx.classes.skin.border_color,
      theme_ctx.classes.skin.border_radius_default,
    )}
    >
      {value && (
        <div className="text-center relative max-w-[400px] inline-block">
          <div className={classNames(
            'overflow-hidden relative mb-1 h-[100px] border',
            theme_ctx.classes.skin.media_picker.bg,
            theme_ctx.classes.skin.border_radius_default,
            theme_ctx.classes.skin.border_color_lighter,
          )}
          >
            <MediaPickerImagePreview value={value} className="opacity-0" />
            <div className="absolute-fill">
              <MediaPickerImagePreview value={value} className="object-contain h-full w-full" />
            </div>
          </div>
          <p className={classNames(
            '-mb-1',
            theme_ctx.classes.typography.copy,
          )}
          >{value.url.replace(/.*\//, '')}</p>

          <div className={classNames(
            'svg-font text-lg cursor-pointer',
            'absolute  top-1 right-1',
            theme_ctx.classes.skin.media_picker.remove_item_btn,
          )}
               onClick={clear}
          >
            <MinusCircleSolid />
          </div>
        </div>
      )}

      {!value && (
        <div className="space-y-1">
          <p className={theme_ctx.classes.typography.sub_heading}>{txt_open}</p>
          <AddItemPillBtn classNameBg={theme_ctx.classes.skin.media_picker.add_btn.bg}
                          size="md"
                          onClick={() => ctx.open_media_library(set_value_callback)} />
        </div>
      )}
    </div>
  )
}
