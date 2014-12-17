'use strict';

var fs = require('fs');


var FlowNodePopertiesController = [
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

    if(businessObject.$instanceOf('bpmn:FlowNode')) {
      propertyHandlerCtx.provide({
        name: 'Flow Node Properties',
        template: fs.readFileSync(__dirname + '/flowNode.html', { encoding: 'utf-8' }),
        controller: FlowNodePopertiesController
      });
    }


  }
};
