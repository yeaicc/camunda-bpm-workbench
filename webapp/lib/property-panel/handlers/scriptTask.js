'use strict';

var fs = require('fs'),
    _ = require('lodash');


var Controller = [
  '$scope',
function(
  $scope
) {

  var el = $scope.modelElement.businessObject;
  var diagramProvider = $scope.workbench.diagramProvider;

  $scope.scriptFormat = el.scriptFormat;
  $scope.script = el.script;

  $scope.aceOptions = {
    mode: 'javascript'
  };

  $scope.updateScriptFormat = function() {
    diagramProvider.executeCommand('element.propertyUpdate', {
      element: $scope.modelElement,
      newProperties: {
        scriptFormat: $scope.scriptFormat
      }
    });
  };

  $scope.updateScript = _.debounce(function() {
    diagramProvider.executeCommand('element.propertyUpdate', {
      element: $scope.modelElement,
      newProperties: {
        script: $scope.script
      }
    });
  }, 500);

}];

module.exports = {
  init : function(propertyHandlerCtx) {

    var businessObject = propertyHandlerCtx.selectedElement.businessObject;

    if(businessObject.$instanceOf('bpmn:ScriptTask')) {
      propertyHandlerCtx.provide({
        name: 'Script Properties',
        template: fs.readFileSync(__dirname + '/scriptTask.html', { encoding: 'utf-8' }),
        controller: Controller
      });
    }


  }
};
