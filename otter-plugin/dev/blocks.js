import Otter from './deps/otter-editor/index.js';
import OtterWP from './deps/otter-wp.jsx';
import '../../dist/otter.css';


// Define blocks
// -----------------------------------

const blocks__header = Otter.Blockset([
  {
    type: 'Header',
    description: 'Header',
    fields: [
      {
        name:        'title',
        description: 'Title',
        type:        Otter.Fields.TextInput,
      },
      {
        name:        'author',
        description: 'Author',
        type:        Otter.Fields.TextInput,
      },
    ],
  },
]);

const blocks__content = Otter.Blockset([
  {
    type: 'Text',
    description: 'Text content',
    fields: [
      {
        name:        'content',
        description: 'Content',
        type:        Otter.Fields.TextArea,
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
        type:        Otter.Fields.WPMedia,
        media_types: [
          'png',
          'jpg',
          'gif',
          'svg',
        ],
      },
    ],
  },
]);

const blocks__other = Otter.Blockset([
  {
    type: 'MultiContent',
    description: 'Multiple content items',
    fields: [
      {
        name:           'content_items',
        description:    'Content:',
        type:           Otter.Fields.SubBlockArray,
        subblock_types: [ blocks__content.get('Text'), blocks__content.get('Image') ],
      },
    ],
  },
]);

const blocks__all = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other,
));


OtterWP.init(blocks__all);

