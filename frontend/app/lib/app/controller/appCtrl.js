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

var DebugSession = require('./../debugSession'),
    WsConnection = require('./../wsConnection'),
    Workbench = require('./../workbench');


var Controller = ['$scope', function($scope) {

  var serverUrl = "ws://localhost:9090/debug-session";

  // bootstrap the application services
  var connection = new WsConnection(serverUrl);
  var debugSession = new DebugSession(connection);
  var workbench = new Workbench();

  // register the debugsession
  workbench.debugSession = debugSession;

  // register the update function
  workbench.update = function() {
    $scope.$digest();
  };

  // trigger scope whenever an event is fired. This listener is the first to register
  // and will always be invoked last.
  debugSession.onEvent('*', function() {
    workbench.update();
  });

  // expose the workbench
  $scope.workbench = workbench;

  // open the connection to the server
  connection.open();

}];

module.exports = Controller;
