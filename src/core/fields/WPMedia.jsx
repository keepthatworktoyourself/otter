import React from 'react'
import PageDataContext from '../Editor'
import FieldLabel from '../other/FieldLabel'
import ClearSelectionBtn from '../other/ClearSelectionBtn'
import Utils from '../definitions/utils'
import styles from '../definitions/styles'


export default class WPMedia extends React.Component {

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
      'otter--get-wp-media-item': field_def.media_types || [ ],
    }, '*')
  }


  cb__click(ev) {
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
    const is_top_level         = this.props.is_top_level
    const ContextConsumer      = this.props.consumer_component || PageDataContext.Consumer
    const value                = containing_data_item[field_def.name]
    const label                = field_def.description || Utils.humanify_str(field_def.name)
    const file_name            = value && value.url && value.url.replace(/^.+\//, '')

    return (
      <ContextConsumer>{ctx => (this.ctx = ctx) && (
        <div className={`md:flex ${styles.field}`}>
          <FieldLabel label={label} is_top_level={is_top_level} min_width={true} />

          <div className="flex justify-start items-start">
            <div className="mr-4">
              <figure className="block relative w-24 h-24 mb-1 text-center border">
                {value && (
                  <img src={value.thumbnail || value.url}
                       className="object-contain h-full w-full"
                       alt="WPMedia image preview" />
                )}

                {!value && (
                  <p className="font-medium text-gray-300">Nothing selected</p>
                )}
              </figure>
              {file_name &&
                <p className="ml-1 text-gray-500">
                  {file_name}
                </p>
              }
            </div>

            <div className="flex justify-start items-center">
              <a className={`wpmedia-select inline-block ${styles.button} ${styles.button_pad__sm} ${styles.control_bg} ${styles.control_border} ${styles.control_border__interactive} mr-3`}
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

