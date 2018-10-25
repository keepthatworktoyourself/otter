import TextArea   from './components/fields/TextArea';
import TextInput  from './components/fields/TextInput';
import TextEditor from './components/fields/TextEditor';
import Bool       from './components/fields/Bool';
import Radios     from './components/fields/Radios';
import WPImage    from './components/fields/WPImage';
import * as utils from './utils';

//
// type: May be a react component, 'sub-block', 'sub-block array'
//


// helper definitions
// ------------------------------------

const lp_color_mode_fields = [
  {
    name: 'color_mode',
    type: Radios,
    options: {
      light: 'Light',
      dark: 'Dark',
      vizia: 'Vizia',
    },
  },
  {
    name: 'background_shade',
    type: Radios,
    options: {
      darkest: 'Darkest',
      medium: 'Medium',
      lightest: 'Lightest',
    },
  },
];

const btn_actions = {
  link: 'Link',
  scroll_to_block: 'Scroll to block',
  play_video: 'Play video',
};
const btn_action_opts = [
  { name: 'action', type: Radios, options: btn_actions },
  { name: 'url', type: TextInput, description: 'Button URL' },
  { name: 'target_block_numbeer', type: TextInput, description: 'Target block number' },
  { name: 'video_url', type: TextInput, description: 'Video URL' },
];


// component definitions
// ------------------------------------

const Components = {
  register(type, def) {
    def.type = type;  // For easy identification of the block by name
    Components[type] = def;
  }
};


// Digcon -------------

// Components.register('DCCallout', [
//   // callout_text: 3,
// ];
// Components.DCCompany_logos = [ ];
// Components.DCCta = [ ];
// Components.DCImpact_quote = [ ];
// Components.DCIntro_text = [ ];
// Components.DCQuote = [ ];
// Components.DCSlider = [ ];
// Components.DCSocial_embed = [ ];
// Components.DCText_content = [ ];


// LP -------------

Components.register('LPButton', [
  { name: 'text', type: TextInput, description: 'Button text' },
  {
    name: 'style',
    type: Radios,
    options: {
      'primary': 'Primary',
      'secondary': 'Secondary',
      'tertiary': 'Tertiary',
    },
    description: 'Button style',
  },
].concat(btn_action_opts));
Components.register('LPSupportingText', [
  { name: 'title', type: TextInput },
  { name: 'content', type: TextEditor },
  {
    name: 'position',
    type: Radios,
    options: {
      left: 'Left',
      right: 'Right',
      top: 'Top',
      bottom: 'Bottom',
    },
  },
  { name: 'has_buttons', type: Bool },
  {
    name: 'buttons',
    type: 'sub-block array',
    subblock_types: [Components.LPButton],
    description: 'Buttons',
  },
]);
Components.register('LPFeaturedButton', [
  { name: 'use_featured_button', type: Bool, description: 'Has featured button?' },
  { name: 'pulse_effect', type: Bool, description: 'Pulse effect?' },
  { name: 'new_tab', type: Bool, description: 'Open in new tab?' },
].concat(btn_action_opts));
// Components.LPButtons = [ ];
// Components.LPCallout = [ ];
// Components.LPCard = [ ];
// Components.LPCards = [ ];
// Components.LPColumn = [ ];
// Components.LPColumns = [ ];
// Components.LPCustom_html = [ ];
// Components.LPEmbed = [ ];
// Components.LPForm = [ ];
// Components.LPGalleryImage = [ ];
Components.register('LPHeader', [
  { name: 'content_title', type: TextInput },
  { name: 'content', type: TextEditor },
  {
    name: 'supporting_text',
    type: 'sub-block',
    subblock_type: Components.LPSupportingText,
    description: 'Supporting text'
  },
  {
    name: 'featured_button',
    type: 'sub-block',
    subblock_type: Components.LPFeaturedButton,
    description: 'Featured button'
  },
]);
// Components.LPImageGallery = [ ];
Components.register('LPImage', [
  { name: 'img', type: WPImage, description: 'The image' },
  {
    name: 'size',
    type: Radios,
    options: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      full: 'Full Width',
    },
  },
  {
    name: 'supporting_text',
    type: 'sub-block',
    subblock_type: Components.LPSupportingText,
    description: 'Supporting text'
  },
  {
    name: 'featured_button',
    type: 'sub-block',
    subblock_type: Components.LPFeaturedButton,
    description: 'Featured button'
  },
].concat(lp_color_mode_fields));
// Components.LPImpactText = [ ];
// Components.LPLongText = [ ];
// Components.LPQuote = [ ];
// Components.LPQuotes = [ ];
// Components.LPSocialEmbeds = [ ];


// PB -------------

// Components.PBGraph = [ ];
// Components.PBHtml = [ ];
// Components.PBImage = [ ];
// Components.PBOembed = [ ];
// Components.PBSlider = [ ];
// Components.PBSoftCta = [ ];
// Components.PBTable = [ ];
// Components.PBTextBlock = [ ];

// Helper to get definition for
Components.get = function(__type) {
  if (!__type) {
    throw Error(utils.Err__BlockNoType());
  }
  const def = Components[__type];
  if (!def) {
    throw Error(utils.Err__NoComponentDef(__type));
  }
  if (def.constructor !== Array) {
    throw Error(utils.Err__InvalidComponentDef(__type));
  }
  return def;
};

export default Components;


// export default Components = {
//   'DcRichText': {
// {
//       'text': {
//         type: TextEditor,
//       },
//     },
//   },
//   'DcTextContent': {
// {
//       'text': {
//         type: TextArea,
//       },
//     },
//   },
//   'PbGraph': {
//     sections: {
//       'general': {
//         title: 'General',
//     {
//           'img': {
//             type: FileInput,
//           },
//         },
//       },
//       'layout': {
//         title: 'Layout',
//     {
//           'border': {
//             type: Bool,
//             label: 'Border:',
//           },
//           'alignment': {
//             type: Select,
//             label: 'Alignment:',
//             options: ['left', 'center', 'right'],
//           },
//           'width': {
//             type: Select,
//             label: 'Width:',
//             options: ['small', 'regular', 'wide'],
//           },
//         },
//       },
//       'details': {
//         title: 'Details',
//     {
//           'custom_details': {
//             type: Select,
//             label: 'Custom details:',
//             options: ['off', 'custom_title', 'custom_caption', 'both'],
//           },
//           'custom_title': {
//             type: TextInput,
//             label: 'Custom title:',
//           },
//           'custom_caption': {
//             type: TextInput,
//             label: 'Custom caption:',
//           },
//         },
//       },
//     },
//   },
//   'PbImage': {
//     sections: {
//       'general': {
//         title: 'General',
//         fields: {
//           'img': {
//             type: FileInput,
//           },
//         },
//       },
//       'layout': {
//         title: 'Layout',
//         fields: {
//           'border': {
//             type: Bool,
//             label: 'Border:',
//           },
//           'alignment': {
//             type: Select,
//             label: 'Alignment:',
//             options: ['left', 'center', 'right'],
//           },
//           'width': {
//             type: Select,
//             label: 'Width:',
//             options: ['small', 'regular', 'wide'],
//           },
//         },
//       },
//       'details': {
//         title: 'Details',
//         fields: {
//           'custom_details': {
//             type: Select,
//             label: 'Custom details:',
//             options: ['off', 'custom_title', 'custom_caption', 'both'],
//           },
//           'custom_title': {
//             type: TextInput,
//             label: 'Custom title:',
//           },
//           'custom_caption': {
//             type: TextInput,
//             label: 'Custom caption:',
//           },
//         },
//       },
//     },
//   },
//   'Oembed': {
//     sections: {
//       'oembed': {
//         title: 'oEmbed',
//         fields: {
//           'src': {
//             type: TextInput,
//           },
//         },
//       },
//       'video_options': {
//         title: 'Video options',
//         fields: {
//           'video_mode': {
//             type: Select,
//             label: 'Video mode:',
//             options: ['default', 'autoplay (muted)', 'background video (muted, looped, no controls etc)'],
//           },
//           'width': {
//             type: Select,
//             label: 'Width:',
//             options: ['small', 'regular', 'large', 'full-width'],
//           },
//         },
//       },
//       'details': {
//         title: 'Details',
//         fields: {
//           'custom_details': {
//             type: Select,
//             label: 'Custom details:',
//             options: ['off', 'custom_title', 'custom_caption', 'both'],
//           },
//           'custom_title': {
//             type: TextInput,
//             label: 'Custom title:',
//           },
//           'custom_caption': {
//             type: TextInput,
//             label: 'Custom caption:',
//           },
//         },
//       },
//     },
//   },
//   'DcCTA': {
//     sections: {
//       'general': {
//         title: 'General',
//         fields: {
//           'heading': {
//             type: TextInput,
//             label: 'Heading:',
//           },
//           'description': {
//             type: TextInput,
//             label: 'Description:',
//           },
//           'button_text': {
//             type: TextInput,
//             label: 'Button Text:',
//           },
//         },
//       },
//       'link_settings': {
//         title: 'Link settings',
//         fields: {
//           'link_type': {
//             type: Radios,
//             label: 'Link Type:',
//             options: ['existing_content', 'external_url'],
//           },
//           'existing_content_link': {
//             type: TextInput,  // TODO implement relationship field
//             label: 'Link to existing content:',
//           },
//         },
//       },
//     },
//   },
//   'Slider': {
//     sections: {
//       'slides': {
//         title: 'Slides',
//         fields: {
//           'slides': {
//             label: 'Slides:',
//             allowed_children: ['PbImage', 'PbGraph'],
//           },
//         },
//       },
//       'settings': {
//         title: 'Settings',
//         fields: {
//           'auto_slide': {
//             type: Bool,
//             label: 'Auto slide?',
//           },
//           'hover_btns': {
//             type: Bool,
//             label: 'Buttons only on hover?',
//           },
//           'light_gallery': {
//             type: Bool,
//             label: 'Click to zoom (images)?',
//           },
//           'style': {
//             type: Select,
//             label: 'Style',
//             options: ['stage', 'contained'],
//           },
//           'max_width': {
//             type: Select,
//             label: 'Max Width:',
//             options: ['column_width', 'wide'],
//           },
//         },
//       },
//     }
//   }
// }

