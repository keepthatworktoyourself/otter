import React from 'react'
import DocumentOutline from 'simple-react-heroicons/icons/DocumentOutline'
import DocumentTextOutline from 'simple-react-heroicons/icons/DocumentTextOutline'
import DocumentReportOutline from 'simple-react-heroicons/icons/DocumentReportOutline'
import FilmOutline from 'simple-react-heroicons/icons/FilmOutline'
import ChartSquareBarOutline from 'simple-react-heroicons/icons/ChartSquareBarOutline'
import PresentationChartBarOutline from 'simple-react-heroicons/icons/PresentationChartBarOutline'
import XCircleOutline from 'simple-react-heroicons/icons/XCircleOutline'
import {useThemeContext} from '../../contexts/ThemeContext'
import {classNames} from '../../helpers/style'
import {usePageData} from '../../contexts/PageDataContext'


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


function MediaPickerImagePreview({value}) {
  const url_components = value.url.split('.')
  const ext = url_components[url_components.length - 1].toLowerCase()
  const directly_previewed_types = ['jpeg', 'jpg', 'png', 'gif']
  let inner

  if (!value?.url) {
    inner = null
  }

  else if (value.thumbnail) {
    inner = <img src={value.thumbnail} className="object-contain w-full h-full" />
  }

  else if (directly_previewed_types.includes(ext)) {
    inner = <img src={value.url} className="object-contain w-full h-full" />
  }

  else {
    const Icon = {
      pdf:  DocumentReportOutline,
      doc:  DocumentTextOutline,
      docx: DocumentTextOutline,
      xls:  ChartSquareBarOutline,
      xlsx: ChartSquareBarOutline,
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


export default function MediaPicker({field_def, containing_data_item}) {
  const ctx = usePageData()
  const theme_ctx = useThemeContext()
  const value = containing_data_item[field_def.name]
  const txt_open = field_def.open_library_text || 'Select media item'

  function clear() {
    containing_data_item[field_def.name] = null
    ctx.value_updated()
    ctx.redraw()
  }

  function set_value_callback(value) {
    containing_data_item[field_def.name] = value
    ctx.value_updated()
    ctx.redraw()
  }

  return (
    <div className="flex">
      <div className={classNames(
        'border-2 rounded-md border-dashed',
        value ? 'p-4 pt-5' : 'p-3',
        'cursor-default',
        'relative',
        theme_ctx.classes.skin.border_color,
      )}
      >
        {value && (
          <div className="text-center mb-1 rounded overflow-hidden w-20 h-20">
            <MediaPickerImagePreview value={value} />
          </div>
        )}

        {value && <p>{value.url.replace(/.*\//, '')}</p>}

        {value && (
          <XCircleOutline className="absolute text-zinc-400 cursor-pointer top-1 right-1"
                          style={{width: '1rem', height: '1rem', display: 'inline-block'}}
                          onClick={clear} />
        )}

        {!value && (
          <p className="text-xxs hover:underline cursor-pointer"
             onClick={() => ctx.open_media_library(set_value_callback)}
          >
            {txt_open}
          </p>
        )}
      </div>
    </div>
  )
}
