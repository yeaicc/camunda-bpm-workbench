'use strict';

var fs = require('fs');

var DiagramManager = require('./../diagramManager');

var OpenDeployedProcessModal = require('./dialog/openDeployedProcess');

var directiveTemplate = fs.readFileSync(__dirname + '/dgrPanel.html', { encoding: 'utf-8' });

var DiagramController = ['$scope', '$modal', function($scope, $modal) {

  // initialize a new diagram manager
  $scope.diagramManager = new DiagramManager($scope.workbench);


  function chooseProcess() {
    // open dialog
    return $modal.open(new OpenDeployedProcessModal($scope.workbench.serverSession)).result;
  }

  function openProcess(processDef) {
    // dialog closed

    return $scope.workbench.serverSession
      .getProcessDefinitionXml(processDef.id)
      .success(function(data) {
        // open the diagram
        $scope.diagramManager.openProcess({
          xml: data,
          processDefinition: processDef
        });

        return processDef;
      });
  }

  function debugProcess(processDef) {
    var processDebugger = $scope.workbench.processDebugger;
  }

  $scope.openDeployedProcess = $scope.debugDeployedProcess = function() {
    return chooseProcess().then(openProcess);
  };
}];

module.exports = function() {
  return {
    scope: {
      workbench : '='
    },
    controller: DiagramController,
    template: directiveTemplate
  };
};

