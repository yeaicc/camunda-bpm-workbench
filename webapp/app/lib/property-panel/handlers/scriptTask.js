'use strict';

var fs = require('fs');


var Controller = [
  '$scope',
function(
  $scope
) {

  var el = $scope.modelElement.businessObject;

  $scope.scriptFormat = el.scriptFormat;
  $scope.script = el.script;

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
