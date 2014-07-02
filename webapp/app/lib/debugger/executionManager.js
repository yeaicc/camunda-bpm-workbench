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

  function registerListeners(eventBus, executionManager) {
    eventBus.onEvent('execution-suspended', function(data) {
      executionManager.executions.push(data);

      // auto-select if it is the first execution
      if(executionManager.executions.length == 1) {
        executionManager.select(data);
      }
    });
  }

  function ExecutionManager(workbench) {

    this.workbench = workbench;
    this.serverSession = workbench.serverSession;
    this.executions = [];

    /** the currently selected execution */
    this.selectedExecution = null;

    registerListeners(this.serverSession.eventBus, this);
  }

  ExecutionManager.prototype.clear = function() {
    this.executions = [];
    this.selectedExecution = null;
  };

  ExecutionManager.prototype.select = function(execution) {
    var eventName;

    if(this.isSelected(execution)) {
      eventName = "execution-deselected";
      this.selectedExecution = null;
    } else {
      eventName = "execution-selected";
      this.selectedExecution = execution;
    }

    this.workbench.eventBus.fireEvent(eventName, execution);
  };

  ExecutionManager.prototype.isSelected = function(execution) {
    return this.selectedExecution === execution;
  };

  ExecutionManager.prototype.resumeExecution = function(execution) {
    var idx = this.executions.indexOf(execution);
    if(idx >= 0) {
      this.serverSession.resumeExecution(execution.id);
      this.executions.splice(idx, 1);
      this.selectedExecution = null;
    }
  };

  ExecutionManager.prototype.resumeAllExecutions = function() {
    for (var i = 0; i < this.executions.length; i++) {
      this.resumeExecution(this.executions[i]);
    }
  };

  ExecutionManager.prototype.getVariables = function() {
    if(this.selectedExecution !== null) {
      return this.selectedExecution.variables;
    }
  };

  return ExecutionManager;
})();

module.exports = ExecutionManager;
