'use strict';

function PropertyUpdateHandler() {

}

PropertyUpdateHandler.prototype.execute = function(ctx) {

  var shape = ctx.element;
  var businessObject = shape.businessObject;

  ctx.newProperties = ctx.newProperties || {};
  ctx.origProperties = {};

  for(var prop in ctx.newProperties) {
    ctx.origProperties[prop] = businessObject[prop];
    businessObject[prop] = ctx.newProperties[prop];
  }

  return shape;
};


PropertyUpdateHandler.prototype.revert = function(ctx) {

  var shape = ctx.element;
  var businessObject = shape.businessObject;

  for(var prop in ctx.origProperties) {
    businessObject[prop] = ctx.origProperties[prop];
  }

  return shape;
};



module.exports = ['commandStack', function(commandStack) {

  commandStack.registerHandler('element.propertyUpdate', PropertyUpdateHandler);

}];
