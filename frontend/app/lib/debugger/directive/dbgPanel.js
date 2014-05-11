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

var fs = require('fs'),
    ProcessDebugger = require('./../processDebugger');

var DbgController = ['$scope', function($scope) {

  // bootstrap the process debugger in the current scope
  $scope.processDebugger = new ProcessDebugger($scope.workbench);

}];

var directiveTemplate = fs.readFileSync(__dirname + '/dbgPanel.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    scope: {
      workbench : "="
    },
    controller: DbgController,
    template: directiveTemplate,
  };
};

