module.exports = {
  __depends__: [
    require('diagram-js/lib/features/palette'),
    require('diagram-js/lib/features/create')
  ],
  __init__: [ 'workbenchPaletteProvider' ],
  workbenchPaletteProvider: [ 'type', require('./workbenchPaletteProvider') ]
};