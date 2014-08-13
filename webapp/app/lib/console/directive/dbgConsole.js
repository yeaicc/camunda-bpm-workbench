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

var ConsoleController = [ '$scope', function($scope) {

  var serverSession = $scope.workbench.serverSession;
  var eventBus = $scope.workbench.eventBus;

  var nextId = 0;

  /**
   * the console input is bound to this field
   */
  $scope.script = null;

  /**
   * the id of the currently suspended execution
   */
  $scope.executionId = null;

  /**
   * the list of script evaluations already performed (history)
   */
  $scope.evaluationResults = [];

  /**
   * the list of executed commands
   */
  $scope.scripts = [];

  /**
   * the current position in history
   */
  $scope.historyCurrent = 0;

  /**
   * currently selected script language
   */
  $scope.scriptLanguage = null;

  $scope.evaluate = function() {

    if("clear" === $scope.script) {
      $scope.evaluationResults = [];

    } else {
      var cmdId = nextId++;

      var cmd = {
        "cmdId" : cmdId,
        "language": $scope.scriptLanguage,
        "executionId": $scope.executionId,
        "script": $scope.script
      };

      $scope.evaluationResults.unshift(cmd);
      $scope.scripts.push($scope.script);
      serverSession.evaluateScript(cmd);
    }

    $scope.historyCurrent = 0;
    $scope.script = "";
  };

  $scope.historyPrevious = function() {
    var entry = $scope.scripts.length - $scope.historyCurrent -1;
    if(entry >= 0) {
      $scope.script = $scope.scripts[entry];
      $scope.historyCurrent++;
    }
  };

  $scope.historyNext = function() {
    var entry = $scope.historyCurrent - 1;
    if(entry >= 0) {
      $scope.historyCurrent--;
      if(entry === 0) {
        $scope.script = "";
      } else {
        $scope.script = $scope.scripts[$scope.evaluationResults.length - entry];
      }
    }
  };

  function addEvaluationResults(data, failed) {
    var cmdId = data.cmdId;
    for(var i = 0; i < $scope.evaluationResults.length; i++) {
      var result = $scope.evaluationResults[i];
      if(result.cmdId == cmdId) {
        result.result = data.result;
        result.evaluationFailed = failed;
      }
    }
  }


  function logError(error) {
    $scope.evaluationResults.push({
      script : error.errorType,
      result : error.errorMessage,
      evaluationFailed : true
    });
  }

  // register event listeners on the debug session

  serverSession.eventBus.onEvent("script-evaluated", function(data) {
    addEvaluationResults(data, false);
  });

  serverSession.eventBus.onEvent("script-evaluation-failed", function(data) {
    addEvaluationResults(data, true);
  });

  serverSession.eventBus.onEvent("server-error", function(data) {
    logError(data);
  });

  eventBus.onEvent("execution-selected", function(data) {
    $scope.executionId = data.id;
  });

  eventBus.onEvent("execution-deselected", function() {
    $scope.executionId = null;
  });

  // init
  $scope.scriptLanguage = 'Javascript';
}];

var directiveTemplate = fs.readFileSync(__dirname + '/console.html', { encoding: 'utf-8' });

module.exports = function() {
  return {
    scope: {
      workbench : "="
    },
    controller: ConsoleController,
    template: directiveTemplate,
  };
};

