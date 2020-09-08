//
// This is a demo App.js file for quick set-up of otter in a create-react-app project.
//

import React, { Component } from 'react';
import Otter from 'otter-editor';
import 'otter-editor/dist/otter.css';


const delegate = {
  save: (data) => console.log('new data!', data),
};


const blockset = Otter.Blockset([
  {
    type: 'HeaderBlock',
    description: 'Heading',
    fields: [
      { name: 'title', description: 'Title', type: Otter.Fields.TextInput },
      { name: 'author', description: 'Author', type: Otter.Fields.TextInput },
    ],
  },
  {
    type: 'TextBlock',
    description: 'Text content',
    fields: [
      { name: 'content', description: 'Content', type: Otter.Fields.TextArea },
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
        <Otter.Editor data={dummy_data} load_state={Otter.State.Loaded} delegate={delegate} blocks={blockset} />
      </div>
    );
  }
}

