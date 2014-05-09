'use strict';

var angular = require('angular'),
    fs = require('fs'),
    BpmnViewer = require('bpmn-js').Viewer;


var ngModule = module.exports = angular.module('developer.diagram.directive', []);

var CanvasController = ['$scope', function($scope) {

  /**
   * The BpmnJs instance
   * @type {BpmnJs}
   */
  $scope.diagram = null;

  /**
   * Render an xml source
   *
   * @param {String} xmlSource the xml source of the diagram to open
   */
  this.openXml = function(xmlSource) {

    $scope.diagram.importXML(xmlSource, function(err) {

      if (err) {
        console.error(err);

      } else {

      }

    });
  };

  /**
   * Init a BpmnJs instance for the given element
   */
  this.initDiagram = function(element) {
    if(!!$scope.diagram) {
      throw "IllegalState: diagram already initialialized";
    }

    $scope.diagram = new BpmnViewer({ container: '#bpmn-js-canvas', width: '100%', height: '100%'});

    var xml = fs.readFileSync(__dirname + '/../controller/exampleProcess.bpmn', 'utf-8');

    this.openXml(xml);
  };

}];

var directiveTemplate = fs.readFileSync(__dirname + '/diagram.html', { encoding: 'utf-8' });

ngModule.directive('dbgCanvas', function() {
  return {
    scope: {
    },
    controller: CanvasController,
    template: directiveTemplate,
    link: function(scope, element, attrs, controller) {
      controller.initDiagram(element);
    }
  };
});
