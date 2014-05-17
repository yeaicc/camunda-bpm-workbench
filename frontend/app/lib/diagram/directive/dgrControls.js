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

var openDeployedProcessTemplate = fs.readFileSync(__dirname + '/dialog/openDeployedProcess.html',
    { encoding: 'utf-8' });


var OpenDeployedProcessCtrl = ['$scope', '$modalInstance', 'ServerSession', 
    function($scope, $modalInstance, ServerSession) {

  $scope.processList = [];

  ServerSession.listProcessDefinitions().success(function(definitions) {
    $scope.processList = definitions;
    $scope.$digest();
  });

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.selectProcess = function(process) {
    $modalInstance.close(process);
  };

}];

var Controller = ['$scope', '$modal', function($scope, $modal) {

  $scope.openDeployedProcess = function() {

    // open dialog
    var modalInstance = $modal.open({
      template: openDeployedProcessTemplate,
      controller: OpenDeployedProcessCtrl,
      resolve: {
        "ServerSession": function() {
          return $scope.workbench.serverSession;
        }
      }
    });

    modalInstance.result.then(function(processDef) {
      // dialog closed

      $scope.workbench.serverSession
        .getProcessDefinitionXml(processDef.id)
        .success(function(data) {

          // open the diagram
          $scope.diagramManager.openProcess({
            xml: data,
            processDefinition: processDef
          });
      });

    });
  };

}];


var directiveTemplate = fs.readFileSync(__dirname + '/dgrControls.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    template: directiveTemplate,
    controller: Controller
  };
};

