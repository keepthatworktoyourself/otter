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
//     // conditional display (NB only works on Bool/Radio/Select siblings)
//     display_if: [{
//       sibling: 'name of sibling field',
//       equal_to: value,
//     }],
//   },
//   ...
// ]


const Components = {
  register(type, description, def) {
    Components[type] = def;
    Components[type].type = type;
    Components[type].description = description;
  },

  get(__type) {
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
  },

  get_all() {
    return Object.keys(Components).filter(type => Components[type].constructor === Array);
  },
};


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
const opt__y_axis_spacing = {
  name: 'y_spacing_select',
  type: Radios,
  description: 'Spacing',
  options: {
    default: 'Default',
    none: 'None',
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  },
};



// --- Core ------------------------------------

Components.register('CoreForm', 'Marketo Form', [
  { name: 'form_id', type: TextInput, description: 'Form' },
  { name: 'prefill', type: Bool, description: 'Prefill', text__yes: 'Enabled', text__no: 'Disabled' },
  { name: 'redirect', type: TextInput, description: 'Redirect' },
  {
    name: 'disable_business_email_filtering',
    type: Bool,
    description: 'Business email filtering',
    text__yes: 'Disabled',  // sorry
    text__no: 'Enabled',    //
  },
  { name: 'button_text_override', type: TextInput, description: 'Override button text' },
]);



// --- PB ------------------------------------

const pb_crappy_custom_details = [
  { name: 'show_details', type: Bool, description: 'Show details?' },
  {
    name: 'custom_details',
    type: Radios,
    description: 'Image details',
    options: { off: 'Off', title: 'Title', caption: 'Caption', both: 'Both' },
  },
  {
    name: 'custom_title',
    type: TextInput,
    description: 'Title',
    display_if: [{ sibling: 'custom_details', not_equal_to: 'off' }, { sibling: 'custom_caption', not_equal_to: 'caption' }],
  },
  {
    name: 'custom_caption',
    type: TextInput,
    description: 'Caption',
    display_if: [{ sibling: 'custom_details', not_equal_to: 'off' }, { sibling: 'custom_caption', not_equal_to: 'title' }],
  },
];

Components.register('PBCountdownTimer', 'PBCountdownTimer', [
  { name: 'number', type: TextInput, description: 'Countdown number' },
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'heading', type: TextInput, description: 'Heading' },
  { name: 'details', type: TextInput, description: 'Details' },
  opt__y_axis_spacing,
  { name: 'link_action', type: TextInput, description: '' },
  { name: 'target_url', type: TextInput, description: '' },
  { name: 'linked_wp_content_id', type: TextInput, description: '' },
  { name: 'new_tab', type: TextInput, description: '' },
]);

Components.register('PBImage', 'PBImage', [
  { name: 'image', type: WPImage, description: 'Image' },
  { name: 'align', type: Radios, description: 'Align', options: { left: 'Left', center: 'Center', right: 'Right' } },
  { name: 'width', type: Radios, description: 'Width', options: { column_width: 'Column', wide: 'Wide', full: 'Full' } },
  { name: 'border', type: Bool, description: 'Has border?' },
  ...pb_crappy_custom_details,
]);

Components.register('PBGraph', 'PBGraph', [
  { name: 'image', type: WPImage, description: 'Image' },
  { name: 'align', type: Radios, description: 'Align', options: { left: 'Left', center: 'Center', right: 'Right' } },
  { name: 'width', type: Radios, description: 'Width', options: { column_width: 'Column', wide: 'Wide', full: 'Full' } },
  { name: 'border', type: Bool, description: 'Has border?' },
  ...pb_crappy_custom_details,
]);

Components.register('PBHtml', 'PBHtml', [
  { name: 'content', type: TextArea, description: 'HTML Content' },
  { name: 'max_width', type: Radios, description: 'Max width', options: { column: 'Column', wide: 'Wide' } },
  { name: 'title', type: TextInput, description: 'HTML Content' },
  { name: 'caption', type: TextInput, description: 'HTML Content' },
]);

Components.register('PBOembed', 'PBOembed', [
  // { name: 'src', type: TextInput, description: 'OEmbed URL' },   // TODO: resolve oembed src ACF issue
  { name: 'oembed', type: TextInput, description: 'OEmbed URL' },
  {
    name: 'video_mode',
    type: Radios,
    description: 'Play mode',
    options: {
      default: 'Default',
      autoplay: 'Autoplay (muted)',
      bg: 'Background (muted, looping)',
    },
  },
  { name: 'width', type: Radios, description: '', options: { column_width: 'Column', wide: 'Wide', full: 'Full' } },
  ...pb_crappy_custom_details,
]);

Components.register('PBTable', 'PBTable', [
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'caption', type: TextInput, description: 'Caption' },
  { name: 'constrain_height', type: Bool, description: 'Constrain height?' },
  { name: 'csv_file', type: WPImage, description: 'CSV data file' },
]);

Components.register('PBSlider', 'PBSlider', [
  {
    name: 'slides',
    type: 'subblock array',
    description: 'Slides',
    subblock_types: [ Components.PBImage, Components.PBGraph, Components.PBOembed, Components.PBTable ],
  },
  { name: 'auto_slide', type: Bool, description: 'Auto slide (if no video)?' },
  { name: 'hover_btns', type: Bool, description: 'Auto-hide buttons?' },
  { name: 'light_gallery', type: Bool, description: 'Popup on click?' },
  { name: 'style', type: Radios, description: 'Style', options: { stage: 'Stage', contained: 'Contained' } },
  { name: 'max_width', type: Radios, description: 'Width', options: { regular: 'Normal', large: 'Large' } },
]);

Components.register('PBSoftCta', 'PBSoftCta', [
  {
    name: 'select_content_type',
    type: Radios,
    description: 'Content type',
    options: {
      webinar: 'Webinar',
      report: 'Report',
      case_study: 'Case study',
      guide: 'Guide',
      blog: 'Blog',
      url: 'URL',
      product: 'Product',
      newsletter: 'Newsletter',
    },
  },  // TODO: make select
  //   {
  //   name: 'select_webinar',    // TODO: implement WPPost field with wp back-end integration...
  //   type: WPPost,
  //   description: 'Webinar',
  //   display_if: [{ sibling: 'select_content_type', equal_to: 'webinar' }],
  // },
  //   {
  //   name: 'select_report',
  //   type: WPPost,
  //   description: 'Report',
  //   display_if: [{ sibling: 'select_content_type', equal_to: 'report' }],
  // },
  //   {
  //   name: 'select_case_study',
  //   type: WPPost,
  //   description: 'Case study',
  //   display_if: [{ sibling: 'select_content_type', equal_to: 'case_study' }],
  // },
  //   {
  //   name: 'select_guide',
  //   type: WPPost,
  //   description: 'Guide',
  //   display_if: [{ sibling: 'select_content_type', equal_to: 'guide' }],
  // },
  //   {
  //   name: 'select_blog',
  //   type: WPPost,
  //   description: 'Blog post',
  //   display_if: [{ sibling: 'select_content_type', equal_to: 'blog' }],
  // },
  {
    name: 'select_url',
    type: TextInput,
    description: 'URL',
    display_if: [{ sibling: 'select_content_type', equal_to: 'url' }],
  },
  {
    name: 'select_product',
    type: Radios,
    description: 'Product',
    options: { analytics: 'Analytics', audiences: 'Audiences', vizia: 'Vizia' },
    display_if: [{ sibling: 'select_content_type', equal_to: 'product' }],
  },
  { name: 'custom_title', type: TextInput, description: 'Custom heading' },
  { name: 'custom_text', type: TextInput, description: 'Custom text' },
  { name: 'custom_btn_text', type: TextInput, description: 'Custom button text' },
]);

Components.register('PBTextBlock', 'PBTextBlock', [
  { name: 'content', type: TextEditor, description: 'Content' },
]);



// --- Digcon ------------------------------------

Components.register('DCCallout', 'Callout', [
  { name: 'alignment', type: Radios, description: 'Alignment', options: opts__dc_alignment },
  { name: 'callout_text', type: TextInput, description: 'Text' },
]);

Components.register('DCCompanyLogos', 'Company logos', [
  { name: 'company_logos', type: 'subblock array', description: 'Logos', subblock_types: [ Components.PBImage ] },
]);

Components.register('DCCTA', 'CTA', [
  { name: 'heading', type: TextInput, description: 'Message' },
  { name: 'description', type: TextInput, description: 'Description' },
  { name: 'button_text', type: TextInput, description: 'Button text' },
  {
    name: 'link_type',
    type: Radios,
    description: 'Link type',
    options: {
      existing_content: 'Content item',
      url: 'URL',
    },
  },
  {
    name: 'button_url',
    type: TextInput,
    description: 'Button URL',
    display_if: [{ sibling: 'link_type', equal_to: 'url' }],
  },
  // {
  //   name: 'existing_content_link',     // TODO: WPPost
  //   type: TextInput,
  //   description: 'Content item',
  //   display_if: [{ sibling: 'link_type', equal_to: 'existing_content' }],
  // },
  opt__y_axis_spacing,
]);

Components.register('DCIntro_text', 'Intro text', [
  { name: 'text', type: TextArea, description: 'Text' },
]);

Components.register('DCQuote', 'Quote', [
  { name: 'alignment', type: Radios, description: 'Alignment', options: opts__dc_alignment },
  { name: 'is_shareable', type: Bool, description: 'Tweeting features?' },
  { name: 'quote', type: TextArea, description: 'Text' },
  {
    name: 'share_quote',
    type: TextArea,
    description: 'Share text (keep max tweet length in mind)',
    display_if: [{ sibling: 'is_shareable', equal_to: true }],
  },
  { name: 'author', type: TextInput, description: 'Author' },
]);

Components.register('DCSocialEmbed', 'SocialEmbed', [
  { name: 'social_type', type: Radios, description: 'Type', options: { twitter: 'Twitter' } },
  {
    name: 'social_embeds',
    type: 'subblock array',
    description: 'Social embeds',
    subblock_types: [ Components.PBOembed ],
  },
]);
Components.register('DCTextContent', 'DCTextContent', [
  { name: 'content', type: TextEditor, description: 'Text' },
  opt__y_axis_spacing,
]);



// --- LP ------------------------------------

// Reusables

Components.register('LPButton', 'Button', [
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

Components.register('LPSupportingText', 'Supporting text', [
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
    display_if: [{ sibling: 'has_buttons', equal_to: true }],
  },
]);

Components.register('LPFeaturedButton', 'Featured button', [
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

Components.register('LPEmbed', 'Embed', [
  { name: 'embed', type: TextInput, description: 'Embed URL' },
]);

Components.register('LPGalleryImage', 'Gallery image', [
  { name: 'img', type: WPImage, description: 'Image' },
  { name: 'has_video', type: Bool, description: 'Play a video?' },
  { name: 'video_url', type: TextInput, description: 'Video URL', display_if: [{ sibling: 'has_video', equal_to: true }] },
]);

Components.register('LPQuote', 'Quote', [
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

Components.register('LPCard', 'Card', [
  { name: 'img', type: WPImage, description: 'Card image' },
  { name: 'label', type: TextInput, description: 'Label' },
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'button', type: 'subblock', description: 'Button', subblock_type: Components.LPButton },
  { name: 'has_feature_button', type: Bool, description: 'Show feature button overlay?' },
]);

Components.register('LPColumn', 'Column', [
  { name: 'img', type: WPImage, description: 'Image' },
  { name: 'title', type: TextInput, description: 'Column title' },
  { name: 'content', type: TextEditor, description: 'Column content' },
  { name: 'has_button', type: Bool, description: 'Has a button?' },
  {
    name: 'button',
    type: 'subblock',
    description: 'Column button',
    subblock_type: Components.LPButton,
    display_if: [{ sibling: 'has_button', equal_to: true }],
  },
  lp_featured_button,
]);


// LP Blocks

Components.register('LPButtons', 'Buttons', [
  { name: 'buttons', type: 'subblock array', description: 'Buttons', subblock_types: [Components.LPButton] },
  { name: 'has_short_title', type: Bool, description: 'Short title?' },
  {
    name: 'short_title',
    type: TextInput,
    description: 'Short title',
    display_if: [{ sibling: 'has_short_title', equal_to: true }],
  },
  ...lp_color_mode_fields,
]);

Components.register('LPCallout', 'Callout', [
  { name: 'title', type: TextInput, description: 'Title' },
  { name: 'content', type: TextEditor, description: 'Content' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPCards', 'Cards', [
  { name: 'cards', type: 'subblock array', description: 'Cards', subblock_types: [Components.LPCard] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPColumns', 'Columns', [
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

Components.register('LPCustomHTML', 'Custom HTML', [
  { name: 'pasted_html', type: TextArea, description: 'HTML' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPForm', 'Form block', [
  ...Components.get('CoreForm'),
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPHeader', 'Jumbotron', [
  { name: 'content_title', type: TextInput, description: 'Title' },
  { name: 'content', type: TextEditor, description: 'Content' },
  {
    name: 'style',
    type: Radios,
    description: 'Header style',
    options: {
      standard: 'Text',
      hanging: 'Image below',
      offset: 'Image to side',
      split: 'Split',
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
  { name: 'content_has_buttons', type: Bool, description: 'Has buttons?' },
  {
    name: 'content_buttons',
    type: 'subblock array',
    description: 'Buttons',
    subblock_types: [Components.LPButton],
    display_if: [{ sibling: 'content_has_buttons', equal_to: true }],
  },
  {
    name: 'form',
    type: 'subblock',
    description: 'Form',
    subblock_type: Components.CoreForm,
    display_if: [{ sibling: 'style', equal_to: 'form' }],
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
    type: WPImage,
    description: 'Background video',
    display_if: [{ sibling: 'has_background_video', equal_to: true }],
  },
  ...lp_color_mode_fields,
]);

Components.register('LPImageGallery', 'Gallery', [
  { name: 'images', type: 'subblock array', description: 'Images', subblock_types: [Components.LPGalleryImage] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPImage', 'Image', [
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

Components.register('LPImpactText', 'Impact Text', [
  { name: 'content', type: TextInput, description: 'Text' },
  { name: 'byline', type: TextInput, description: 'Byline' },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPLongText', 'Long Text', [
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

Components.register('LPQuotes', 'Quotes', [
  { name: 'quotes', type: 'subblock array', description: 'Quotes', subblock_types: [Components.LPQuote] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);

Components.register('LPSocialEmbeds', 'SocialEmbeds', [
  { name: 'social_type', type: Radios, description: 'Type', options: { twitter: 'Twitter' } },
  { name: 'embeds', type: 'subblock array', description: 'Embeds', subblock_types: [Components.LPEmbed] },
  lp_supporting_text,
  ...lp_color_mode_fields,
]);


export default Components;

