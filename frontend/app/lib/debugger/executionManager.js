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

var ExecutionManager = (function() {

  // static helper functions /////////////

  function registerListeners(debugSession, executionManager) {
    debugSession.onEvent('execution-suspended', function(data) {
      executionManager.executions.push(data);

      // auto-select if it is the first execution
      if(executionManager.executions.length == 1) {
        executionManager.select(data);
      }
    });
  }

  function ExecutionManager(debugSession) {

    this.debugSession = debugSession;

    this.executions = [];

    /** the currently selected execution */
    this.selectedExecution = null;

    registerListeners(debugSession, this);
  }

  ExecutionManager.prototype.clear = function() {
    this.executions = [];
    this.selectedExecution = null;
  };

  ExecutionManager.prototype.select = function(execution) {
    if(this.isSelected(execution)) {
      this.selectedExecution = null;
    } else {
      this.selectedExecution = execution;
    }
  };

  ExecutionManager.prototype.isSelected = function(execution) {
    return this.selectedExecution === execution;
  };

  ExecutionManager.prototype.resumeExecution = function(execution) {
    var idx = this.executions.indexOf(execution);
    if(idx >= 0) {
      this.debugSession.resumeExecution(execution.id);
      this.executions.splice(idx, 1);
      this.selectedExecution = null;
    }
  };

  return ExecutionManager;
})();

module.exports = ExecutionManager;
