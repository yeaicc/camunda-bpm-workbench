'use strict';

var angular = require('angular'),
    fs = require('fs'),
    BpmnViewer = require('bpmn-js').Viewer,
    $ = require('jquery');


var ngModule = module.exports = angular.module('developer.diagram.directive', []);

var CanvasController = ['$scope', function($scope) {

  /**
   * The BpmnJs instance
   * @type {BpmnJs}
   */
  $scope.diagram = null;

  /**
   * Init a BpmnJs instance for the given element
   */
  this.initDiagram = function(element) {
    if(!!$scope.diagram) {
      throw "IllegalState: diagram already initialialized";
    }
    $scope.diagram = new BpmnViewer({ container: element, width: '100%', height: '100%'});
  };

  /**
   * Render an xml source
   *
   * @param {String} xmlSource the xml source of the diagram to open
   */
  $scope.openXml = function(xmlSource) {
    this.diagram.importXML(xmlSource, function(err) {

      if (err) {
        console.error(err);

      } else {

      }

    });
  };

}];

var directiveTemplate = fs.readFileSync(__dirname + '/diagram.html', { encoding: 'utf-8' });
var demoProcess = fs.readFileSync(__dirname + '/exampleProcess.bpmn', { encoding: 'utf-8' });

ngModule.directive('dbgCanvas', function() {
  return {
    scope: {
      debugSession : '='
    },
    controller: CanvasController,
    template: directiveTemplate,
    link: function(scope, element, attrs, controller) {
      var diagramContainer = $('#bpmn-js-canvas', element);
      controller.initDiagram(diagramContainer);
      scope.openXml(demoProcess);


    }
  };
});
