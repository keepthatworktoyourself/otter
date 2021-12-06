import Otter from './deps/otter-editor/index.js';
import OtterWP from './deps/otter-wp.jsx';
import '../../dist/otter.css';


// Define blocks
// -----------------------------------

const blocks__header = [
  {
    type: 'Header',
    description: 'Header',
    fields: [
      {
        name:        'title',
        description: 'Title',
        type:        Otter.FieldTypes.TextInput,
      },
      {
        name:        'author',
        description: 'Author',
        type:        Otter.FieldTypes.TextInput,
      },
    ],
  },
];

const blocks__content = [
  {
    type: 'Text',
    description: 'Text content',
    fields: [
      {
        name:        'content',
        description: 'Content',
        type:        Otter.FieldTypes.TextArea,
      },
    ],
  },
  {
    type: 'Image',
    description: 'Image',
    fields: [
      {
        name:        'image',
        description: 'Image',
        type:        Otter.FieldTypes.WPMedia,
        media_types: [
          'png',
          'jpg',
          'gif',
          'svg',
        ],
      },
    ],
  },
];

const blocks__flat = [
  ...blocks__header,
  ...blocks__content,
];

const blocks__nested = {
  simple: {
    name: 'Headers',
    blocks: blocks__header,
  },
  complex: {
    name: 'Content',
    blocks: blocks__content,
  },
};


OtterWP.init(blocks__nested);

