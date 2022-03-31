export default [
  {
    __type:     'Header',
    label:      'Definition',
    heading:    'Otters are mammals',
    // text:    'We have have otters galore in our store.', // TODO: Formating of text inside Quill looks pretty nasty - but possibly deal with it when replacing Quill?
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
        __type: 'TextWithIconTabs',
      },
      {
        __type: 'TextWithNormalTabs',
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
