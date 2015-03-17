'use strict';

var fs = require('fs');


var ProcessPropertiesController = [
  '$scope',
function(
  $scope
) {

  var el = $scope.modelElement;
  var diagramProvider = $scope.workbench.diagramProvider;

  $scope.isExecutable = el.businessObject.isExecutable;

  $scope.updateExecutable = function() {
    el.businessObject.isExecutable = $scope.isExecutable;
  };

}];

module.exports = {
  init : function(propertyHandlerCtx) {

    var businessObject = propertyHandlerCtx.selectedElement.businessObject;

    if(businessObject.$instanceOf('bpmn:Process')) {
      propertyHandlerCtx.provide({
        name: 'Process Properties',
        template: fs.readFileSync(__dirname + '/process.html', { encoding: 'utf-8' }),
        controller: ProcessPropertiesController
      });
    }


  }
};
