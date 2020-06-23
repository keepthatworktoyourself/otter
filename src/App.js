//
// This is a demo App.js file for quick set-up of iceberg in a create-react-app project.
//

import React, { Component } from 'react';
import Iceberg from 'iceberg-editor';
import 'iceberg-editor/dist/iceberg.css';


const delegate = {
  on_update: (data) => console.log('new data!', data),
};


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


const dummy_data = [
  {
    __type: 'HeaderBlock',
    title: 'Concerning the spiritual in art',
    author: 'Wassily Kandinsky',
  },
  {
    __type: 'TextBlock',
    content: 'Every work of art is the child of its age and, in many cases, the mother of our emotions...',
  },
];


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Iceberg data={dummy_data} load_state='loaded' delegate={delegate} blocks={blockset} />
      </div>
    );
  }
}

