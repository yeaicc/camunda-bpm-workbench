'use strict';

var angular = require('angular'),
    fs = require('fs'),
    BpmnViewer = require('bpmn-js').Viewer,
    $ = require('jquery');


var ngModule = module.exports = angular.module('developer.diagram.directive', []);

var CanvasController = ['$scope', '$rootScope', function($scope, $rootScope) {

  /**
   * The BpmnJs instance
   * @type {BpmnJs}
   */
  $scope.renderer = null;

  /**
   * Init a BpmnJs instance for the given element
   */
  this.initRenderer = function(element) {
    if(!!$scope.renderer) {
      throw "IllegalState: diagram already initialialized";
    }

    $scope.renderer = new BpmnViewer({ container: element, width: '100%', height: '100%'});

    // register selection changed
    $scope.renderer.on('selection.changed', function(e) {
      var selectedElements = e.newSelection;

      var selectedIds = [];
      angular.forEach(selectedElements, function(el) {
        this.push(el.id);
      }, selectedIds);

      $scope.workbench.selectedProcessElements = selectedIds;

      $rootScope.$broadcast('diagram.selection.changed', selectedIds);
      $rootScope.$digest();
    });

  };

  /**
   * Render an xml source
   *
   * @param {String} xmlSource the xml source of the diagram to open
   */
  $scope.openXml = function(xmlSource) {
    this.renderer.importXML(xmlSource, function(err) {

      if (err) {
        console.error(err);

      } else {

      }

    });
  };

  // expose the diagram provider
  // The diagram is the public API provided by this component 
  // to the rest of the application
  $scope.workbench.diagramProvider = {

    /**
     * returns the semantic information about an element by id
     */
    getBpmnElement : function(id) {
      return $scope.renderer.get('bpmnRegistry').getSemantic(id);
    },

    getBpmnXml : function(done) {
      done(null, demoProcess);
/**      $scope.renderer.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
*/
    }

  };

}];

var directiveTemplate = fs.readFileSync(__dirname + '/diagram.html', { encoding: 'utf-8' });

var demoProcess = fs.readFileSync(__dirname + '/exampleProcess.bpmn', { encoding: 'utf-8' });

ngModule.directive('dbgCanvas', function() {
  return {
    scope: {
      workbench : '='
    },
    controller: CanvasController,
    template: directiveTemplate,
    link: function(scope, element, attrs, controller) {

      // bootstrap the renderer on the canvas element
      var canvasElement = $('#bpmn-js-canvas', element);
      controller.initRenderer(canvasElement);

      // open the demo process
      // TODO: replace with open diagram facility
      scope.openXml(demoProcess);
    }
  };
});
