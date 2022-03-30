export default [
  {
    __type:     'Header',
    heading:    'Otters',
    subheading: 'Otters? We got otters!',
    media_item: {
      url:       'muffins.pdf',
      thumbnail: 'http://placekitten.com/230/230',
    },
  },
  {
    __type:        'RepeaterDemo',
    content_items: [
      {
        __type: 'Text',
      },
      {
        __type: 'Text',
      },
    ],
  },
  {
    __type:  'NestedBlockDemo',
    heading: {
      __type:     'Header',
      heading:    'Nested Heading',
      subheading: 'Nested Sub-Heading',
    },
    text_content: {
      __type:  'Text',
      content: '<p>Hi</p>',
    },
  },
  {
    __type: 'HTML',
    html:   `<div>I'm a TextArea field with mono={true}!</div>`,
  },
]
