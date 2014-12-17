'use strict';

var fs = require('fs'),
    angular = require('angular'),
    PropertyPanel = require('./../propertyPanel');

var directiveTemplate = fs.readFileSync(__dirname + '/propPanel.html', { encoding: 'utf-8' });

var PropertyPanelController = [
  '$scope',
  '$compile',
  '$injector',
function(
  $scope,
  $compile,
  $injector
) {

  var container = angular.element('#prop-panel-container');

  function renderFn(handlerCtx) {

    $scope.modelElement = handlerCtx.selectedElement;

    handlerCtx.providers.forEach(function(provider) {
      container.append(provider.template);
    });

    // compile property panel
    $compile(container)($scope);

    handlerCtx.providers.forEach(function(provider) {
      $injector.instantiate(provider.controller, { $scope: $scope });
    });
  }

  function clearFn() {

    // clear container
    container.html('');

    $scope.modelElement = null;

  }

  var renderer = {
    render: renderFn,
    clear: clearFn
  };

  var workbench = $scope.workbench;

  // initialize a new property editor 
  var propertyPanel = new PropertyPanel(workbench, renderer);

  $scope.$watch(function() {
      if(!!workbench.diagramProvider) {
        return workbench.diagramProvider.getSelectedElements();
      }
    }, function(elementIds) {
    var element = null;
    if(elementIds.length === 1) {
      element = workbench.diagramProvider.getBpmnElement(elementIds[0]);
    }
    propertyPanel.selectElement(element);
  });

}];

module.exports = function() {
  return {
    scope: {
      workbench : '='
    },
    controller: PropertyPanelController,
    template: directiveTemplate
  };
};

