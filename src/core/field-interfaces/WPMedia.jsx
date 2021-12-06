import React from 'react'
import PageDataContext from '../components/otter/Editor'
import ClearSelectionBtn from '../components/otter/other/ClearSelectionBtn'
import {ThemeContext} from '../contexts/ThemeContext'
import {classNames} from '../helpers/style'
export default class WPMedia extends React.Component {
  static contextType = ThemeContext

  constructor(props) {
    super(props)

    this.cb__click = this.cb__click.bind(this)
    this.cb__clear = this.cb__clear.bind(this)
  }


  image_selection__bind(ctx, containing_data_item, field_def) {
    function cb(ev) {
      const proceed = ev.data && ev.data['otter--set-wp-media-item']
      if (proceed) {
        ev.stopPropagation()

        containing_data_item[field_def.name] = ev.data['otter--set-wp-media-item']
        ctx.value_updated()
        ctx.redraw()

        window.removeEventListener('message', cb)
      }
    }

    window.addEventListener('message', cb)
  }


  open_media_browser(field_def) {
    window.parent && window.parent.postMessage({
      'otter--get-wp-media-item': field_def.media_types || [],
    }, '*')
  }


  cb__click() {
    this.image_selection__bind(this.ctx, this.props.containing_data_item, this.props.field_def)
    this.open_media_browser(this.props.field_def)
  }


  cb__clear() {
    this.props.containing_data_item[this.props.field_def.name] = null
    this.ctx.value_updated()
    this.ctx.redraw()
  }


  render() {
    const field_def            = this.props.field_def
    const containing_data_item = this.props.containing_data_item
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const value                = containing_data_item[field_def.name]
    const file_name            = value && value.url && value.url.replace(/^.+\//, '')

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={classNames('md:flex')}>

          <div className="flex justify-start items-start">
            <div className="mr-4">
              <figure className="block relative w-24 h-24 mb-1 text-center border">
                {value && (
                  <img src={value.thumbnail || value.url}
                       className="object-contain h-full w-full"
                       alt="WPMedia image preview" />
                )}

                {!value && (
                  <p className={this.context.classes.typography.copy}>Nothing selected</p>
                )}
              </figure>

              {file_name &&
                <p className={classNames(this.context.classes.typography.copy, 'ml-1')}>
                  {file_name}
                </p>
              }
            </div>

            <div className="flex justify-start items-center">
              <a className={classNames(
                'wpmedia-select inline-block mr-3',
              )}
                 onClick={this.cb__click}
              >
                Select
              </a>

              {value && <ClearSelectionBtn onClick={this.cb__clear} />}
            </div>

          </div>
        </div>
      )}</ContextConsumer>
    )
  }
}

