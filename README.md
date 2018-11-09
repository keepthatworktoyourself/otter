# Iceberg, an embeddable content editor <img align="right" src="src/ice.png" width=40 height=40>

An embeddable content editor, as a React component, composed from declaratively defined blocks.


## Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Iceberg from 'iceberg-editor';


// Define some blocks for the content editor

const blockset = Iceberg.Blockset();

blockset.define('HeaderBlock', 'Heading', [
  { name: 'title', description: 'Title', type: Iceberg.Fields.TextInput },
  { name: 'author', description: 'Author', type: Iceberg.Fields.TextInput },
]);
blockset.define('TextBlock', 'Text content', [
  { name: 'content', description: 'Content', type: Iceberg.Fields.TextArea },
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

Iceberg's just a react component so is easy to install. For example:

```sh
npx create-react-app my-app
cd my-app
npm i -P iceberg-editor
```

Replace src/App.js with [this demo App.js file](src/App.js), run `npm run start`, then visit <a href="http://localhost:3000/">localhost:3000</a>.


## The Iceberg CSS

Iceberg needs its CSS present in the application where it's embedded:

```js
import 'iceberg-editor/dist/iceberg.css';
```

iceberg.css is unfortunately fairly large at the moment (~150kB) due to the inclusion of bulma. Iceberg will transition to something more lightweight.

If your app already includes bulma, you can import only iceberg's and Quill's (used for `TextEditor` fields) own CSS directly:

```js
import 'iceberg-editor/src/index.css';
import 'iceberg-editor/src/quill.snow.css';
```


## Demo project

The demo project has a small but fully-functioning, clone this repo and run `npm run dev` to start webpack-dev-server, then visit <a href="http://localhost:3000/">localhost:3000</a>.


## Development

Use the demo project for development with `npm run dev`. You'll probably want to add and remove a lot of block definitions to the Blockset in `demo/index.jsx` during development to activate the features you're working on. Before merging your work, you should probably reset the `demo` folder back to how it was initially.

When you're ready to publish to npm, `npm publish` should do all the work for you.


## License

Iceberg is dual-licensed to enable Wordpress integration. The license is:

- GPLv2 for the purpose of embedding within Wordpress themes
- MIT for all other purposes

See [LICENSE.md](LICENSE.md) for further details.

