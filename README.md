# Iceberg, a block-based content editor <img align="right" src="src/ice.png" width=40 height=40>

A content editor, with declaratively defined content blocks. Easily imports as a react component. Generates data in a simple JSON format.


### Contents

- [Block API](#block-api)
- [Field API](#field-api)
- [Sample setup with create-react-app](#sample-setup-with-create-react-app)
- [Basic full example](#basic-full-example)
- [CSS](#css)
- [Demo project](#demo-project)
- [Development](#development)



## Block API

`Iceberg.Blockset([ <block>, <block>, ... ]) -> blockset`

- Define a blockset (a set of content blocks) for use in the editor.
- Returns the blockset object.
- Arguments:
    - `[ <block>, <block>, ... ]`: an array of content block definitions

```js
const text_blocks = Iceberg.Blockset([{
  type: 'MyTextBlock',
  description: 'Text block',
  fields: [ <field>, <field>, ... ],
}]);
```


### Methods

`get(block_type) -> block`

- Defined on a blockset created with `Iceberg.blockset()`.
- Returns the requested block object from the blockset array.



## Field API

A **block** contains one or more **fields** (see above).

- `<field>` :

```js
{
  name: 'content',
  description: 'Content',
  type: Iceberg.Fields.Textarea,
  display_if: [{                  // To display this field only if a sibling has a value
    sibling: <sibling_name>,
    equal_to: <value>,            // mutually exclusive
    not_equal_to: <value>,        //
  }],
}
```

(Note that `display_if` can only operate on siblings of type Bool or Radio.)


### Field types:

`Iceberg.Fields.TextInput`

- A simple text input.

`Iceberg.Fields.TextArea`

- A textarea for multiline, unstyled text.

`Iceberg.Fields.TextEditor`

- Multiline rich text editor.

`Iceberg.Fields.Bool`

- A yes/no toggle.
- Options:
    - `text__yes: "Yes"`: label for the on state option
    - `text__no:  "No"`: label for the off state option

`Iceberg.Fields.Radios`

- A set of radio buttons
- Options:
    - `options: { value: "Label", ... }` : the set of radios

`Iceberg.Fields.WPImage`

- For wordpress integration: a wordpress media item. **TBD.**

`Iceberg.Fields.SubBlock`

- Embed another block into this block. Iceberg can compose blocks together recursively, allowing for complex content types, and aiding re-use of block definitions.
- Options:
    - `description` : if supplied, used to title the wrapped subblock in the editor
    - `subblock_type: MyTextBlock` : a block object (previously created with `Iceberg.Blockset()`) defining which subblock to embed.

```js
Iceberg.Blockset([
  {
    name: 'MyHeaderAndContentBlock',
    fields: [
      {
        name: 'header',
        description: 'Header',
        type: Iceberg.Fields.TextInput,
      },
      {
        name: 'content',
        description: 'Content',
        type: Iceberg.Fields.SubBlock,
        subblock_type: text_blocks.get('MyTextBlock'),
      },
    ],
  }
]);
```

`Iceberg.Fields.SubBlockArray`

- Create a picker where the user can manage an array of subblocks, picking from types you predefine.
- Options:
    - `description` : if suppied, used to title the wrapped subblock array in the editor
    - `subblock_types: [ <block1>, <block2>, ... ]` : an array of block objects (previously created with `Iceberg.Blockset()`) defining what types of subblock the user can add to this subblock array.

```js
Iceberg.Blockset([
  {
    name: 'MyMultiContentBlock',
    fields: [
      {
        name: 'content',
        type: Iceberg.Fields.SubBlockArray,
        subblock_types: [
          my_blocks.get('MyContentBlock__1'),
          my_blocks.get('MyContentBlock__2'),
        ],
      },
    ],
  }
]);
```



## Sample setup with create-react-app

```sh
npx create-react-app my-app
cd my-app
npm i -P iceberg-editor
```

To start:

- replace src/App.js with the [demo App.js file](src/App.js)
- run `npm run start`
- visit `localhost:3000`


## Basic full example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from 'iceberg-editor';


// Define content blocks
// -------------------------------

const blockset = Iceberg.Blockset([
  {
    type: 'HeaderBlock',
    description: 'Heading',
    fields: [
      { name: 'title', description: 'Title', type: Iceberg.Fields.TextInput },
      { name: 'author', description: 'Author', type: Iceberg.Fields.TextInput },
    ],
  },
  {
    type: 'TextBlock',
    description: 'Text content',
    fields: [
      { name: 'content', description: 'Content', type: Iceberg.Fields.TextArea },
    ],
  },
]);


// Fetch some data & render
// -------------------------------

function render() {
  const data = [
    { __type: 'HeaderBlock', title: 'My article', author: 'Jane Smith' },
  ];

  ReactDOM.render(
    <Iceberg data={data} load_state='loaded' ext_interface={ext_interface} blocks={blockset} />,
    document.querySelector('.iceberg-container')
  );
}


// Handle updates
// -------------------------------

const ext_interface = {
  on_update: (data) => console.log('new data!', data),
};


render();
```



## CSS

The CSS must be present in the application where it's embedded:

```js
import 'iceberg-editor/dist/iceberg.css';
```

iceberg.css currently includes bulma so at present weighs ~150kB. **TBD:** move to something more lightweight.

If your app already includes bulma, you can import only the required Iceberg and Quill CSS directly (Quill is used for the rich text editor):

```js
import 'iceberg-editor/src/index.css';
import 'iceberg-editor/src/quill.snow.css';
```



## Demo project

/demo contains a minimal sample editor using Iceberg. Run `npm run dev` to start webpack-dev-server, then visit `http://localhost:3000`.

If prefer to use [parcel](https://parceljs.org) (npm i -g parcel-bundler), you can instead run `parcel demo/index.html`.



## Development

Use the demo project and the `dev` task.

To publish: `npm publish`.


### License

Iceberg is dual-licensed to enable Wordpress integration. The license is:

- GPLv2 for the purpose of embedding within Wordpress themes
- MIT for all other purposes

See [LICENSE.md](LICENSE.md) for details.

