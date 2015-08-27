/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    return $modal.open(new OpenDeployedProcessModal($scope.workbench)).result;
  }

  function openProcess(processDef) {
    // dialog closed

    return $scope.workbench.processEngineConnection
      .getProcessDefinitionXml(processDef.id, function(data) {
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

