import Iceberg from 'iceberg-editor';
import IcebergWP from './iceberg-wp';


// Define blocks
// -----------------------------------

const blocks__header = Iceberg.Blockset([
  {
    type: 'Header',
    description: 'Header',
    fields: [
      {
        name:        'title',
        description: 'Title',
        type:        Iceberg.Fields.TextInput,
      },
      {
        name:        'author',
        description: 'Author',
        type:        Iceberg.Fields.TextInput,
      },
    ],
  },
]);

const blocks__content = Iceberg.Blockset([
  {
    type: 'Text',
    description: 'Text content',
    fields: [
      {
        name:        'content',
        description: 'Content',
        type:        Iceberg.Fields.TextArea,
      },
    ],
  },
]);

const blocks__other = Iceberg.Blockset([
  {
    type: 'MultiContent',
    description: 'Multiple content items',
    fields: [
      {
        name:           'content_items',
        description:    'Content:',
        type:           Iceberg.Fields.SubBlockArray,
        subblock_types: [ blocks__content.get('Text') ],
      },
    ],
  },
]);

const blocks__all = Iceberg.Blockset([].concat(
  blocks__header,
  blocks__content,
  blocks__other,
));


IcebergWP.run(blocks__all);

