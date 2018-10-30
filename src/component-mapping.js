import TextArea   from './components/fields/TextArea';
import TextInput  from './components/fields/TextInput';
import TextEditor from './components/fields/TextEditor';
import Bool       from './components/fields/Bool';
import Radios     from './components/fields/Radios';
import WPImage    from './components/fields/WPImage';
import * as utils from './utils';

// components: [
//   {
//     name: 'item_content',
//     type: Radios,             // one of the above field components, 'subblock', or 'subblock array'
//     description: 'Content',   // optional
//
//     // Radio:
//     options: {
//       light: 'Light',
//       dark: 'Dark',
//       vizia: 'Vizia',
//     },
//
//     // 'subblock':
//     subblock_type: PBImage,   // which subblock to render
//
//     // 'subblock array':
//     subblock_types: [ PBImage, PBText ],  // if type is 'subblock array' - the allowed types in the repeater
//
//     // Bool:
//     text__yes: '',  // display text (optional, default: 'Yes')
//     text__no:  '',  // ~            (optional, default: 'No')
//
//     // conditional display:
//     display_if: [{
//       sibling: 'name of sibling field',
//       equal_to: value,
//     }],
//   },
//   ...
// ]


// helper definitions
// ------------------------------------

const btn_actions = {
  link: 'Link',
  scroll_to_block: 'Scroll to block',
  play_video: 'Play video',
};
const opts__btn_actions = [
  { name: 'action', type: Radios, description: 'Button action', options: btn_actions },
  {
    name: 'url',
    type: TextInput,
    description: 'Button URL',
    display_if: [{ sibling: 'action', equal_to: 'link' }],
  },
  {
    name: 'target_block_number',
    type: TextInput,
    description: 'Target block number',
    display_if: [{ sibling: 'action', equal_to: 'scroll_to_block' }],
  },
  {
    name: 'video_url',
    type: TextInput,
    description: 'Video URL',
    display_if: [{ sibling: 'action', equal_to: 'play_video' }],
  },
  {
    name: 'new_tab',
    type: Bool,
    description: 'Open in new tab?',
    display_if: [{ sibling: 'action', equal_to: 'link' }],
  },
];
const opts__dc_alignment = {
  left: 'Left',
  center: 'Center',
  right: 'Right',
};


// component definitions
// ------------------------------------

const Components = {
  register(type, def) {
    Components[type] = def;
    Components[type].type = type;  // For easy identification of the block by name
  }
};



// --- Digcon ------------------------------------

Components.register('DCCallout', [
  { name: 'alignment', type: Radios, description: 'Alignment', options: opts__dc_alignment },
  { name: 'callout_text', type: TextInput, description: 'Text' },
]);
Components.register('DCCompanyLogos', [
  { name: 'company_logos', type: 'subblock array', description: 'Logos', subblock_types: [ Components.PBImage ] },  // HOIST
]);
Components.register('DCCTA', [
  { name: 'heading', type: TextInput, description: 'Message' },
  { name: 'description', type: TextInput, description: 'Description' },
  { name: 'button_text', type: TextInput, description: 'Button text' },
  { name: 'link_type', type: Radios, description: 'Link type', options: {
    existing_content: 'Content item',
    url: 'URL',
  }},
  { name: 'button_url', type: TextInput, description: 'Button URL' },                     // CONDITION
  { name: 'existing_content_link', type: TextInput, description: 'Content item' },        //
]);
// Components.register('DCImpact_quote', [         // DELETE?
//  { name: 'alignment', type: Radios, description: 'Alignment', options: opts__dc_alignment },
//   { name: 'is_shareable', type: Bool, description: 'Tweeting features?' },
//   { name: 'quote', type: TextInput, description: 'Text' },
//   { name: 'Author', }
// ]);
Components.register('DCIntro_text', [
  { name: 'text', type: TextArea, description: 'Text' },
]);
Components.register('DCQuote', [
  { name: 'alignment', type: Radios, description: 'Alignment', options: opts__dc_alignment },
  { name: 'is_shareable', type: Bool, description: 'Tweeting features?' },
  { name: 'quote', type: TextArea, description: 'Text' },
  { name: 'share_quote', type: TextArea, description: 'Text (max. tweet length)' },
  { name: 'author', type: TextInput, description: 'Author' },
]);
Components.register('DCSlider', [
  // { name: 'slides', type: 'subblock array', description: 'slides' },
  { name: 'auto_slide', type: Bool, description: 'Auto-change every few seconds?' },
  { name: 'hover_btns', type: Bool, description: 'Buttons only on hover?' },
  { name: 'light_gallery', type: Bool, description: 'Click to zoom on images?' },
  { name: 'style', type: Radios, description: 'Style', options: {
    stage: 'Stage',
    contained: 'Contained',
  }},
  { name: 'max_width', type: Radios, description: 'Max width', options: {
    regular: 'Regular',
    large: 'Large',
  }},
]);
Components.register('DCSocialEmbed', [
  { name: 'social_type', type: Radios, description: 'Type', options: { twitter: 'Twitter' } },
  { name: 'social_embeds', type: 'subblock array', description: 'Social embeds', subblock_types: [ Components.PBOembed ] },  // HOIST
]);
// Components.register('DCText_content', [ ]);



// --- LP ------------------------------------

// Reusables

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
].concat(opts__btn_actions));
Components.register('LPSupportingText', [
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'content', type: TextEditor, description: 'Content' },
  {
    name: 'position',
    type: Radios,
    description: 'Position',
    options: {
      left: 'Left',
      right: 'Right',
      top: 'Top',
      bottom: 'Bottom',
    },
  },
  { name: 'has_buttons', type: Bool, description: 'Has buttons?' },
  {
    name: 'buttons',
    type: 'subblock array',
    subblock_types: [Components.LPButton],
    description: 'Supporting text buttons',
    display_if: [{
      sibling: 'has_buttons',
      equal_to: true,
    }],
  },
]);
Components.register('LPFeaturedButton', [
  { name: 'use_featured_button', type: Bool, description: 'Has featured button?' },
  { name: 'pulse_effect', type: Bool, description: 'Pulse effect?' },
].concat(opts__btn_actions).map(item => {
  if (item.name !== 'use_featured_button') {
    const rules = item.display_if || [ ];
    rules.push({
      sibling: 'use_featured_button',
      equal_to: true,
    });
    item.display_if = rules;
  }
  if (item.name === 'video_url') {
    item.name = 'featured_video_url';  // TODO: harmonize with ordinary (non-featured) btn_actions (!)
  }
  return item;
}));
Components.register('LPEmbed', [
  { name: 'embed', type: TextInput, description: 'Embed URL' },
]);
Components.register('LPGalleryImage', [
  { name: 'img', type: WPImage, description: 'Image' },
  { name: 'has_video', type: Bool, description: 'Play a video?' },
  { name: 'video_url', type: TextInput, description: 'Video URL', display_if: [{ sibling: 'has_video', equal_to: true }] },
]);
Components.register('LPQuote', [
  { name: 'quotation', type: TextInput, description: 'Quote' },
  { name: 'byline', type: TextInput, description: 'Byline' },
  { name: 'avatar', type: WPImage, description: 'User avatar' },
  { name: 'logo', type: WPImage, description: 'Logo' },
]);

const lp_supporting_text = {
  name: 'supporting_text',
  type: 'subblock',
  subblock_type: Components.LPSupportingText,
  description: 'Supporting text'
};
const lp_featured_button = {
  name: 'featured_button',
  type: 'subblock',
  subblock_type: Components.LPFeaturedButton,
  description: 'Featured button'
};
const lp_color_mode_fields = [
  {
    name: 'color_mode',
    type: Radios,
    description: 'Color mode',
    options: {
      light: 'Light',
      dark: 'Dark',
      vizia: 'Vizia',
    },
  },
  {
    name: 'background_shade',
    type: Radios,
    description: 'Background shade',
    options: {
      darkest: 'Dark',
      medium: 'Medium',
      lightest: 'Light',
    },
  },
];

Components.register('LPCard', [
  { name: 'img', type: WPImage, description: 'Card image' },
  { name: 'label', type: TextInput, description: 'Label' },
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'button', type: 'subblock', description: 'Button', subblock_type: Components.LPButton },
  { name: 'has_feature_button', type: Bool, description: 'Show feature button overlay?' },
]);
Components.register('LPColumn', [
  { name: 'img', type: WPImage, description: 'Image' },
  { name: 'title', type: TextInput, description: 'Column title' },
  { name: 'content', type: TextEditor, description: 'Column content' },
  { name: 'has_button', type: Bool, description: 'Has a button?' },
  {
    name: 'button',
    type: 'subblock',
    description: 'Column button',
    subblock_type: Components.LPButton,
    display_if: { sibling: 'has_button', equal_to: true },
  },
  lp_featured_button,
]);


// Blocks

Components.register('LPButtons', [
  { name: 'buttons', type: 'subblock array', description: 'Buttons', subblock_types: [Components.LPButton] },
  { name: 'has_short_title', type: Bool, description: 'Short title alongside?' },
  {
    name: 'short_title',
    type: TextInput,
    description: 'Short title',
    display_if: [{ sibling: 'has_short_title', equal_to: true }],
  },
  ...lp_color_mode_fields,
]);

Components.register('LPCallout', [
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'content', type: TextEditor, description: 'Content' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPCards', [
  { name: 'cards', type: 'subblock array', description: 'Cards', subblock_types: [Components.LPCard] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPColumns', [
  {
    name: 'layout',
    type: Radios,
    description: 'Layout',
    options: {
      two_row: '2 per row',
      three_row: '3 per row',
    },
  },
  { name: 'columns', type: 'subblock array', description: 'Columns', subblock_types: [Components.LPColumn] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPCustomHTML', [
  { name: 'pasted_html', type: TextArea, description: 'HTML' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPForm', [
  { name: 'form', type: TextInput, description: 'Form' },
  { name: 'prefill', type: Bool, description: 'Prefill', text__yes: 'Enabled', text__no: 'Disabled' },
  { name: 'custom_redirect', type: TextInput, description: 'Redirect' },
  {
    name: 'disable_business_email_filtering',
    type: Bool,
    description: 'Business email filtering',
    text__yes: 'Disabled',  // (sorry)
    text__no: 'Enabled',    //
  },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPHeader', [
  { name: 'content_title', type: TextInput, description: 'Title' },
  { name: 'content', type: TextEditor, description: 'Content' },
  {
    name: 'style',
    type: Radios,
    description: 'Header style',
    options: {
      standard: 'Text',
      hanging: 'Image below',
      offset: 'Image to the side',
      split: 'Split with image',
      form: 'With form',
    },
  },
  {
    name: 'layout',
    type: Radios,
    description: 'Layout',
    options: {
      text_on_left: 'Text on the left',
      text_on_right: 'Text on the right',
      text_above: 'Text above (‘form’ style only!)',
    },
    display_if: [{ sibling: 'style', not_equal_to: 'standard' }, { sibling: 'style', not_equal_to: 'hanging' }],
  },
  {
    name: 'form',
    type: 'subblock',
    description: 'Form',
    subblock_type: Components.LPForm,
    display_if: [{ sibling: 'style', equal_to: 'form' }],
  },
  { name: 'content_has_buttons', type: Bool, description: 'Has buttons?' },
  {
    name: 'content_buttons',
    type: 'subblock array',
    description: 'Buttons',
    subblock_types: [Components.LPButton],
    display_if: [{ sibling: 'content_has_buttons', equal_to: true }],
  },
  lp_featured_button,
  {
    name: 'supporting_text',
    type: 'subblock',
    subblock_type: Components.LPSupportingText,
    description: 'Supporting text'
  },
  {
    name: 'featured_img',
    type: WPImage,
    description: 'Foreground image',
    display_if: [{ sibling: 'style', not_equal_to: 'standard' }, { sibling: 'style', not_equal_to: 'split' }, { sibling: 'style', not_equal_to: 'form' }],
  },
  {
    name: 'background_img',
    type: WPImage,
    description: 'Background image',
  },
  { name: 'has_background_video', type: Bool, description: 'Has background video?' },
  {
    name: 'background_video',
    type: TextInput,
    description: 'Background video',
    display_if: [{ sibling: 'has_background_video', equal_to: true }],
  },
  ...lp_color_mode_fields,
]);

Components.register('LPImageGallery', [
  { name: 'images', type: 'subblock array', description: 'Images', subblock_types: [Components.LPGalleryImage] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPImage', [
  { name: 'img', type: WPImage, description: 'Image' },
  {
    name: 'size',
    type: Radios,
    description: 'Image size',
    options: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      full: 'Full Width',
    },
  },
  lp_supporting_text,
  lp_featured_button,
  ...lp_color_mode_fields,
]);

Components.register('LPImpactText', [
  { name: 'content', type: TextInput, description: 'Text' },
  { name: 'byline', type: TextInput, description: 'Byline' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPLongText', [
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'text_content', type: TextEditor, description: 'Content' },
  { name: 'has_buttons', type: Bool, description: 'Has buttons?' },
  {
    name: 'buttons',
    type: 'subblock array',
    description: 'Buttons',
    subblock_types: [Components.LPButton],
    display_if: [{ sibling: 'has_buttons', equal_to: true }],
  },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPQuotes', [
  { name: 'quotes', type: 'subblock array', description: 'Quotes', subblock_types: [Components.LPQuote] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPSocialEmbeds', [
  { name: 'social_type', type: Radios, description: 'Type', options: { twitter: 'Twitter' } },
  { name: 'embeds', type: 'subblock array', description: 'Embeds', subblock_types: [Components.LPEmbed] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);


// --- PB ------------------------------------

// Components.register('PBGraph', [ ]);
// Components.register('PBHtml', [ ]);
// Components.register('PBImage', [ ]);
// Components.register('PBOembed', [ ]);
// Components.register('PBSlider', [ ]);
// Components.register('PBSoftCta', [ ]);
// Components.register('PBTable', [ ]);
// Components.register('PBTextBlock', [ ]);

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

