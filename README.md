# Iceberg, a block-based content editor <img align="right" src="src/ice.png" width=40 height=40>

A react-embeddable content editor, defined entirely declaratively from block definitions.


## Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from 'iceberg-editor';


// Define some blocks for the content editor

const blockset = Iceberg.Blockset([
  {
    type: 'HeaderBlock',
    description: 'Heading',
    fields: [
      { name: 'title', description: 'Title', type: Iceberg.Fields.TextInput },
      { name: 'author', description: 'Author', type: Iceberg.Fields.TextInput },
    ]
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

const ext_interface = {
  on_update: (data) => console.log('new data!', data),
};


render();
```


## Sample setup with create-react-app

Iceberg is just a react component so is easy to install. For example:

```sh
npx create-react-app my-app
cd my-app
npm i -P iceberg-editor
```

Then:

- replace src/App.js with [this demo App.js file](src/App.js)
- run `npm run start`
- visit `localhost:3000`


## The Iceberg CSS

Iceberg needs its CSS present in the application where it's embedded:

```js
import 'iceberg-editor/dist/iceberg.css';
```

iceberg.css is unfortunately fairly large at the moment (~150kB) due to the inclusion of bulma. Iceberg may transition to something more lightweight.

If your app already includes bulma, you can import only iceberg's and Quill's (used for `TextEditor` fields) own CSS directly:

```js
import 'iceberg-editor/src/index.css';
import 'iceberg-editor/src/quill.snow.css';
```


## Demo project

There's a super-simple demo project with two block definitions — a header and a text block — run `npm run dev` to start webpack-dev-server, then visit `http://localhost:3000`.


## Development

Use the demo project for development with `npm run dev`. You'll probably add block definitions to the Blockset in `demo/index.jsx` during development to activate the features you're working on. Before opening your pull request, you will probably want to reset the `demo` folder back to how it was initially.

When you're ready to publish to npm, `npm publish` should do all the work for you.


## License

Iceberg is dual-licensed to enable Wordpress integration. The license is:

- GPLv2 for the purpose of embedding within Wordpress themes
- MIT for all other purposes

See [LICENSE.md](LICENSE.md) for details.

