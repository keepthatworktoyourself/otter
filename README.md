# Iceberg, a block-based content editor <img align="right" src="src/ice.png" width=40 height=40>

A content editor, with declaratively defined content blocks. Easily imports as a react component. Generates data in a simple JSON format.


### Contents

- [Iceberg element](#iceberg-element)
- [Block API](#block-api)
- [Field API](#field-api)
- [Sample setup with create-react-app](#sample-setup-with-create-react-app)
- [Basic full example](#basic-full-example)
- [CSS](#css)
- [Demo project](#demo-project)
- [Development](#development)



## Iceberg element

```jsx
<Iceberg.Editor data={data} load_state={Iceberg.State.Loaded} delegate={my_delegate} blocks={blockset} />,
```

Render an Iceberg editor.

- `blocks` : the set of editor blocks available in this editor (see [Block API](#block-api))
- `data` : initialize the editor with some content
- `load_state` : one of the loading states (`Loading` and `Error` are useful when loading content data asynchronously):
    - `Iceberg.State.Loading`
    - `Iceberg.State.Loaded`
    - `Iceberg.State.Error`
- `delegate` : Iceberg calls the `on_update()` method of your delegate object when data is saved:

```js
const my_delagate = {
  on_update(data) {
    // Kick-off a request to update the post data
  },
};
```


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
import 'iceberg-editor/dist/iceberg.css';


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


// Handle updates
// -------------------------------

const delegate = {
  on_update(data) {
    console.log('new data:', data),
  },
};


// Fetch some data & render
// -------------------------------

function render() {
  const data = [
    { __type: 'HeaderBlock', title: 'My article', author: 'Jane Smith' },
  ];

  ReactDOM.render(
    <Iceberg.Editor data={data} load_state='loaded' delegate={delegate} blocks={blockset} />,
    document.querySelector('.iceberg-container')
  );
}


render();
```



## CSS

The app needs to import the Iceberg CSS:

```js
import 'iceberg-editor/dist/iceberg.css';
```

This currently includes bulma so at present weighs ~150kB. **TBD:** move to something more lightweight.



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

