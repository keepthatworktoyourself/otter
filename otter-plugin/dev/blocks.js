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

const blocks__flat = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
));

const blocks__nested = Otter.Blockset({
  simple: {
    name: 'Headers',
    blocks: blocks__header,
  },
  complex: {
    name: 'Content',
    blocks: blocks__content,
  },
});


OtterWP.init(blocks__nested);

