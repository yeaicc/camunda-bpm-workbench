'use strict';

var fs = require('fs');


var BaseElementPropertiesController = [
  '$scope',
function(
  $scope
) {

  var el = $scope.modelElement;

  $scope.id = el.id;

}];

module.exports = {
  init : function(propertyHandlerCtx) {

    var businessObject = propertyHandlerCtx.selectedElement.businessObject;

    if(businessObject.$instanceOf('bpmn:BaseElement')) {
      propertyHandlerCtx.provide({
        name: 'Base Element Properties',
        template: fs.readFileSync(__dirname + '/baseElement.html', { encoding: 'utf-8' }),
        controller: BaseElementPropertiesController
      });
    }


  }
};
