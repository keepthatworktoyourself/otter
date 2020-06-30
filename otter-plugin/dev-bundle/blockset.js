import Otter from 'otter-editor';
import OtterWP from './otter-wp';


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
        subblock_types: [ blocks__content.get('Text') ],
      },
    ],
  },
]);

const blocks__all = Otter.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other,
));


OtterWP.run(blocks__all);

