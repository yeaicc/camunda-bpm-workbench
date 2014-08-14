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
var directiveTemplate = fs.readFileSync(__dirname + '/scripteditor.html', { encoding: 'utf-8' });

var ScriptEditorController = [ '$scope', function($scope) {
  var serverSession = $scope.workbench.serverSession;
  var eventBus = $scope.workbench.eventBus;
  var processDebugger = $scope.workbench.processDebugger;
  var nextId = 0;

  /** list of available script languages */
  var SCRIPT_LANGUAGES = [
    "Javascript",
    "Ruby",
    "Groovy",
    "Juel",
    "Python"
  ];

  $scope.displayEditor = false;
  $scope.scriptText = null;
  $scope.executionId = null;
  $scope.scriptLanguage = null;
  $scope.scriptLanguages = SCRIPT_LANGUAGES;

  var executeCommand = function(scope, cmdId, script) {
    var cmd = {
      "cmdId" : cmdId,
      "language" : $scope.scriptLanguage,
      "executionId" : $scope.executionId,
      "script" : script
    };

    serverSession.evaluateScript(cmd);
  };

  var resultEvent = function() {
    // register event listeners on the debug session
    serverSession.eventBus.onEvent("script-evaluated", function(data) {
      processResult(data);
    });
  };

  var processResult = function(data) {
    if(data.result != "undefined") {
      $scope.scriptText = data.result.replace(/\\n/g, "\n");
    } else {
      if(processDebugger.canRun($scope.executionId)) {
        processDebugger.run($scope.executionId);
      }
    }
  };

  $scope.executeScript = function() {
    var escapedVariable = $scope.scriptText.replace(/\n/g, "\\n");
    var script = "execution.getActivity().getActivityBehavior().getScript().setSourceScript('" + escapedVariable + "')";

    executeCommand($scope, nextId++, script);
    resultEvent()
  };

  $scope.selectLanguage = function(lang) {
    $scope.scriptLanguage = lang;
  };

  eventBus.onEvent('execution-suspended', function(data) {
    var elementType = $scope.workbench.diagramProvider.getBpmnElement(data.currentActivityId).type;
    var script = "execution.getActivity().getActivityBehavior().getScript().getSourceScript()";

    $scope.executionId = data.id;
    $scope.displayEditor = elementType == "bpmn:ScriptTask";

    executeCommand($scope, nextId++, script);
    resultEvent()

  });

  $scope.scriptLanguage = "Javascript";
}];

module.exports = function() {
  return {
    scope: {
      workbench : "="
    },
    controller: ScriptEditorController,
    template: directiveTemplate,
  };
};

