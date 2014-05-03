
var angular = require('angular');
var fs = require('fs');

var ngModule = angular.module('developer.diagram.service.diagramController', []);

ngModule.controller('DiagramCtrl',[
  '$scope',
function DiagramController(
  $scope
) {

  // load the example diagram
  var exampleDiagram = fs.readFileSync(__dirname + '/exampleProcess.bpmn', { encoding: 'utf-8' });


}]);

module.exports = ngModule;
