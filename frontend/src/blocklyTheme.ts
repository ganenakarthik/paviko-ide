import * as Blockly from 'blockly';

export const PavikoTheme = Blockly.Theme.defineTheme('paviko', {
  name: 'paviko',
  base: Blockly.Themes.Classic,
  blockStyles: {
    loop_blocks: {
      colourPrimary: '#e74c3c', // Red for control/loops
      colourSecondary: '#c0392b',
      colourTertiary: '#e74c3c'
    },
    logic_blocks: {
      colourPrimary: '#fca877', // Orange
      colourSecondary: '#e67e22',
      colourTertiary: '#fca877'
    },
    math_blocks: {
      colourPrimary: '#88b1f2', // Blue
      colourSecondary: '#4a90e2',
      colourTertiary: '#88b1f2'
    },
    text_blocks: {
      colourPrimary: '#b18eed', // Purple
      colourSecondary: '#8e44ad',
      colourTertiary: '#b18eed'
    },
    variable_blocks: {
      colourPrimary: '#c2a68a', // Brown/Variables
      colourSecondary: '#a08365',
      colourTertiary: '#c2a68a'
    },
    pin_blocks: {
      colourPrimary: '#58d68d', // Green for Hardware
      colourSecondary: '#2ecc71',
      colourTertiary: '#58d68d'
    },
    timing_blocks: {
      colourPrimary: '#f1c40f', // Yellow
      colourSecondary: '#f39c12',
      colourTertiary: '#f1c40f'
    }
  },
  categoryStyles: {
    loop_category: { colour: '#e74c3c' },
    logic_category: { colour: '#fca877' },
    math_category: { colour: '#88b1f2' },
    text_category: { colour: '#b18eed' },
    variable_category: { colour: '#c2a68a' },
    pin_category: { colour: '#58d68d' },
    timing_category: { colour: '#f1c40f' }
  },
  componentStyles: {
    workspaceBackgroundColour: 'transparent', // We handle this with CSS
    toolboxBackgroundColour: '#FFFEFB', // Candy Tray white
    toolboxForegroundColour: '#333',
    flyoutBackgroundColour: '#FFFEFB',
    flyoutForegroundColour: '#333',
    flyoutOpacity: 1,
    scrollbarColour: '#d6c9b8',
    scrollbarOpacity: 0.5
  }
});
