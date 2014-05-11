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

  var debugSession = $scope.workbench.debugSession;

  /** list of available script languages */
  var SCRIPT_LANGUAGES = [
    "Javascript",
    "Ruby",
    "Groovy",
    "Juel",
    "Python"
  ];

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
   * currently selected script language
   */
  $scope.scriptLanguage = null;

  $scope.scriptLanguages = SCRIPT_LANGUAGES;

  $scope.evaluate = function() {
    var cmdId = nextId++;

    var cmd = {
      "cmdId" : cmdId,
      "language": $scope.scriptLanguage,
      "executionId": $scope.executionId,
      "script": $scope.script,
    };

    $scope.evaluationResults.push(cmd);

    debugSession.evaluateScript(cmd);

  };

  $scope.$on("executionSelected", function(e, execution) {
    if(!!execution) {
      $scope.executionId = execution.id;
    } else {
      $scope.executionId =null; 
    }
  });

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

  $scope.selectLanguage = function(lang) {
    $scope.scriptLanguage = lang;
    $scope.scriptLanguages = [];
    for(var i=0; i<SCRIPT_LANGUAGES.length; i++) {
      if(SCRIPT_LANGUAGES[i] != lang) {
        $scope.scriptLanguages.push(SCRIPT_LANGUAGES[i]);
      }
    }
  };

  // register event listeners on the debug session

  debugSession.onEvent("script-evaluated", function(data) {
    addEvaluationResults(data, false);
  });

  debugSession.onEvent("script-evaluation-failed", function(data) {
    addEvaluationResults(data, true);
  });

  // init
  $scope.selectLanguage("Javascript");
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

