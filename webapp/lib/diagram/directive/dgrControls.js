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

var jquery = require('jquery');

var Controller = ['$scope', function($scope) {

  $scope.openFsProcess = function() {

    // Yo!

    var obj = jquery('#dgr-uploader');
    obj[0].update = function() {
      var file = this.files[0];
      if (file !== null) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $scope.diagramManager.openProcess({
            xml: e.target.result,
            processDefinition: null
          });
        };
        reader.readAsText(file);
      }
    };

    obj.click();

  };

  $scope.isDeployed = function() {
    return !!$scope.workbench.processDebugger.processDefinitionId;
  };

}];


var directiveTemplate = fs.readFileSync(__dirname + '/dgrControls.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    template: directiveTemplate,
    controller: Controller
  };
};

