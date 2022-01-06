const dashedBorders = false

export default {
  right_aligned_block_section_headings: true,
  block_min_width:                      '320px',
  with_labels:                          true,
  enclosedContent:                      false,
  darkBlockHeadings:                    true,
  floaty_blocks:                        true,
  dashedBorders:                        false,
  roundedBlocks:                        false,
  blockBorders:                         dashedBorders
    ? 'border border-dashed border-app-mode-grey-300'
    : 'border-app-border border',
  block_shadow: 'rgb(23 43 77 / 18%) 0px 7px 12px 0px',
}
