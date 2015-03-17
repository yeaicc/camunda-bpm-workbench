var _ = require('lodash');


/**
 * A palette provider for BPMN 2.0 elements.
 */
function PaletteProvider(palette, create, elementFactory) {

  this._create = create;
  this._elementFactory = elementFactory;

  palette.registerProvider(this);
}

module.exports = PaletteProvider;

PaletteProvider.$inject = [ 'palette', 'create', 'elementFactory' ];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions  = {},
      create = this._create,
      elementFactory = this._elementFactory;

  _.extend(actions, {
    'create.script-task': {
      group: 'activity',
      className: 'icon-script-task',
      title: 'Create a new ScriptTask',
      action: {
        dragstart: function(event) {
          var shape = elementFactory.createShape({ type: 'bpmn:ScriptTask' });
          create.start(event, shape);
        }
      }
    }
  });

  return actions;
};