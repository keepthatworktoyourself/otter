# Otter <img align="right" src="files/otter.png" width=60 height=60>

[![Build Status](https://travis-ci.com/bhallstein/otter.svg?branch=int)](https://travis-ci.com/bhallstein/otter)

- Create rich content editors by composing content blocks from built-in fields 🐟
- Simple, declarative syntax 💦
- Easily integrates as a React component 🌿
- Generates post data in a simple JSON format 🏞


### Contents

- [Blocks](#blocks)
- [Fields](#fields)
- [Otter.Editor](#ottereditor)
- [Demo](#demo)
- [License](#license)

```jsx
// Render an otter editor
<Otter.Editor blocks={blocks}
              data={data}
              load_state={Otter.State.Loaded} />
```


## Blocks

Otter lets you quickly and declaratively define the available content blocks using simple Javascript object syntax.

```js
const my_block = {
  type: 'MyBlock',
  description: 'My block',
  fields: [
    <Field>,
    <Field>,
    ...
  ],
};
```

| Property      | Value              | Required | Default |                               |
| :------------ | :----------------- | :------- | :------ | :---------------------------- |
| `type`        | `<string>`         | Yes      |         | Unique block type identifier. Used to save the field value in exported data. |
| `description` | `<string>`         |          |         | A human-readable name for the block to let the user identify it. |
| `fields`      | `Array(<Field>)`   | Yes      |         | The editor fields present in this block. |
| `thumbnail`   | `<path>`           |          |         | Optional thumbnail for use in the [graphical block picker](#blocks-optionally-categorise-in-groups). |
| `hidden`      | `<bool>`           |          | `false` | If `true`, don't display this block in the block picker. This allows you to define blocks at the top level which can only be used in a NestedBlock or Repeater. |


### Blocks: optionally categorise in groups

When supplying your content blocks to Otter, (`<Otter.Editor blocks={blocks} />`), you can either use a **simple, flat array** of blocks, or **group them into categories**.

```js
// Simple blocks
const blocks = [
  <Block>,
  <Block>,
  ...
];
```

```js
// Grouped blocks
const blocks = {
  text: {
    name: 'Text blocks',
    blocks: [ <Block>, <Block>, ... ],
  },
  media: {
    name: 'Media blocks',
    blocks: [ <Block>, <Block>, ... ],
  },
};
```

Otter uses a different block picker depending on whether simple or grouped blocks are used. Grouped blocks can provide a much better user experience if your editor uses many types of blocks:

| Simple block picker | Grouped block picker |
| :------------------ | :------------------- |
| <img src="files/picker--simple.png"> | <img src="files/picker--grouped.png"> |



## Fields

A block has one or more fields:

```js
{
  name: 'content',
  description: 'Content',
  type: Otter.Fields.TextArea,
}
```

| Property      | Value                                   | Required   |                                    |
| :------------ | :-------------------------------------- | :--------- | :--------------------------------- |
| `name`        | `<string>`                              | Yes        | The block data save key.           |
| `description` | `<string>`                              |            | Field label displayed to the user. |
| `type`        | `Otter.Field.<FieldType>`               | Yes        | The [field type](#field-types).    |
| `display_if`  | `<DisplayRule>`, `Array(<DisplayRule>)` |            | Show/hide this field based on the value of one or more siblings. |

`DisplayRule` specifies the name of a sibling and the value that sibling must have (or not have) for this field to be shown. You can test against the value of `Bool`, `Radio`, and `Select` sibling fields. You can test against more than one sibling field using an array of multiple `DisplayRule` objects.

```js
{
  name: 'url',
  description: 'URL',
  type: Otter.Fields.TextInput,
  display_if: {
    sibling: 'is_link',
    equal_to: true,      // Or not_equal_to
  },
}
```


### Field types:

All fields should be specified with the Otter-defined constants in the form `Otter.Fields.TextInput`.

| Type          | Description                           | Options                | Default  |                                |
| :------------ | :------------------------------------ | :--------------------- | :------- | :----------------------------- |
| `TextInput`   | Plain text input                      |                        |          |                                |
| `TextArea`    | Textarea (multi-line plain) text      |                        |          |                                |
| `TextEditor`  | Rich text editor                      |                        |          |                                |
| `Bool`        | A toggle                              |                        |          |                                |
|               |                                       | `no_label` (string)    | `"Yes"`  | Label for `true` option        |
|               |                                       | `yes_label` (string)   | `"No"`   | Label for `false` option       |
| `Radios`      | Radio buttons                         |                        |          |                                |
|               |                                       | `options` (object)     |          | Radio options. Key pairs are in the form `value: "Label"`. |
| `Select`      | Select dropdown                       |                        |          |                                |
|               |                                       | `options` (object)     |          | Select options. Key pairs are in the form `value: "Label"`. |
| `WPMedia`     | Pick an item from a wordpress media browser (specific to the Wordpress plugin) | |                         |
|               |                                       | `media_types` (array)  | `[ ]`    | File types to include in the media browser. Supported values: `jpg`, `png`, `gif`, `mov`, `mp4`, `svg`, `pdf`, `csv`. If omitted or an empty array, all files are included. |
| `NestedBlock` | Embed another block into this block.  |                        |          |                                |
|               |                                       | `nested_block_type` (string or Block object)  | | The block to embed inside this block. Can be either a Block object reference, or a block name for a block defined elsewhere in the blockset. |
|               |                                       | `optional` (bool)      | `false`  | If true, let the Nested Block be toggled on and off. |
| `Repeater`    | Embed an array of blocks within this block. |                  |          |                                |
|               |                                       | `nested_block_types` (array of strings or Block objects)  | | The blocks the user can pick from. Can be either Block object references, or block names for blocks defined elsewhere in the blockset. |
|               |                                       | `optional` (bool)      | `false`  | If true, let the Repeater be toggled on and off. |
|               |                                       | `max` (number)         | No limit | Optionally limit the number of nested_blocks the user can add. |


## <Otter.Editor>

The `Otter.Editor` element renders an editor, given your block definitions:

```jsx
<Otter.Editor blocks={blocks}
              data={data}
              load_state={Otter.State.Loaded} />
```

| Property      | Value                                      | Required | Default   |                            |
| :------------ | :----------------------------------------- | :------- | :-------- | :------------------------- |
| `blocks`      | `Array(<Block>)`                           | Yes      |           | The content blocks making up this editor. |
| `data`        | Loaded data                                |          |           | The loaded page data. |
| `load_state`  | `Otter.State.Loading`, `.Loaded`, `.Error` | Yes      |           | Set the editor state. Otter displays useful feedback to the user while asynchronously fetching content data. |
| `save`        | `Otter.Save.OnInput`, `.OnClick`           |          | `OnClick` | Specifies when `save()` is called on the delegate: immediately when edited, or only when a save button is clicked. |
| `delegate`    | A delegate object                          |          |           | An object Otter uses to communicate state changes back to you. May have `save` and `block_toggled` methods. |

```js
const my_delegate = {
  save(data) {
    // Kick-off a request to update the post data
  },
  block_toggled() {
    // update container height, perhaps
  },
};
```



## Demo

See [/demo](demo/) for the demo project, which renders an Otter editor with several blocks, including blocks with NestedBlock and Repeater fields.

```bash
# run the demo project
parcel demo/index.html
````



## License

Otter is dual-licensed to enable Wordpress integration. The license is:

- GPLv2 for the purpose of embedding within Wordpress themes
- MIT for all other purposes

See [LICENSE.md](LICENSE.md) for details.

