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

var BreakpointManager = require('./breakpointManager'),
    ExecutionManager = require('./executionManager');

var ProcessDebugger = (function() {

  // static helper functions /////////////

  function registerListeners(debugSession, processDebugger) {

    debugSession.onEvent('process-deployed', function(evt) {
      processDebugger.processDefinitionId = evt;
    });

    debugSession.onEvent('OPEN', function() {
      processDebugger.breakpointManager.updateBreakpoints();
    }); 

    debugSession.onEvent('CLOSE', function() {
      processDebugger.executionManager.clear();
    }); 
  }

  // class ///////////////////////////////

  /**
   * @class
   * @classdesc the Process Debugger class
   *
   * @param {Workbench} workbench
   */
  function ProcessDebugger(workbench) {

    /** @member the workbench */
    this.workbench = workbench;

    this.breakpointManager = new BreakpointManager(workbench.debugSession);

    this.executionManager = new ExecutionManager(workbench.debugSession);

    /** @member {String} the Id of the currently associated process definition or 'null'*/
    this.processDefinitionId = null;

    /** @member {String} the Id of the currently associated process instance or 'null' */
    this.processInstanceId = null;

    // initialize
    registerListeners(workbench.debugSession, this);
  }

  /** deploy the current diagram */
  ProcessDebugger.prototype.deployProcess = function() {
    var self = this;
    this.workbench.diagramProvider.getBpmnXml(function(err, xml) {

      self.workbench.debugSession.deployProcess({
        resourceName: 'process.bpmn',
        resourceData: xml
      });

    });
  };

  ProcessDebugger.prototype.isSessionOpen = function() {
    return this.workbench.debugSession.isOpen();
  };

  /** returns true if it is possible to deploy a process */
  ProcessDebugger.prototype.canDeployProcess = function() {
    return this.isSessionOpen();
  };

  ProcessDebugger.prototype.runMode = function() {
    if(!this.canRun()) {
      return null;

    } else if(this.executionManager.selectedExecution === null) {
      return "Start Process Instance";

    } else {
      return "Resume Execution";
    }
  };

  ProcessDebugger.prototype.run = function() {
    if(this.processDefinitionId !== null) {
      var selectedExecution = this.executionManager.selectedExecution;
      if(selectedExecution === null) {
        this.workbench.debugSession.startProcess({
          'processDefinitionId': this.processDefinitionId
        });
      } else {
        this.executionManager.resumeExecution(selectedExecution);
      }
    }
  };

  ProcessDebugger.prototype.canRun = function() {
    if(!this.isSessionOpen() || this.processDefinitionId === null) {
      return false;

    } else {
      var suspendedExecutions = this.executionManager.executions;
      if(suspendedExecutions === null || suspendedExecutions.length === 0) {
        return true;
      } else {
        return this.executionManager.selectedExecution !== null;
      }
    }

  };

  ProcessDebugger.prototype.step = function() {
  };

  ProcessDebugger.prototype.canStep = function() {
    return false;
  };

  ProcessDebugger.prototype.stop = function() {
  };

  ProcessDebugger.prototype.canStop = function() {
    return false;
  };

  ProcessDebugger.prototype.toggleBreakpoint = function() {
    for(var i = 0; i<this.workbench.selectedProcessElements.length; i++) {
      var elId = this.workbench.selectedProcessElements[i];
      this.breakpointManager.toggleBreakpointBefore(elId, this.processDefinitionId);
    }
  };

  ProcessDebugger.prototype.canToggleBreakpoint = function() {
    return this.isSessionOpen() &&
      this.processDefinitionId !== null &&
      this.workbench.selectedProcessElements !== null &&
      this.workbench.selectedProcessElements.length > 0;
  };

  ProcessDebugger.prototype.openSession = function() {
    // (re-)connect
    this.workbench.debugSession.wsConnection.open();
  };

  ProcessDebugger.prototype.canOpenSession = function() {
    return !this.isSessionOpen();
  };

  ProcessDebugger.prototype.closeSession = function() {
    // close connection to server
    this.workbench.debugSession.wsConnection.close();

  };

  ProcessDebugger.prototype.canCloseSession = function() {
    return this.isSessionOpen();
  };

  return ProcessDebugger;

})();

module.exports = ProcessDebugger;
