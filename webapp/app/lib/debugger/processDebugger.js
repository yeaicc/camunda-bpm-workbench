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

  function diagramChanged(processDebugger, processDefinitionId) {
    if(processDebugger.processDefinitionId !== processDefinitionId) {
      processDebugger.processDefinitionId = processDefinitionId;
      processDebugger.breakpointManager.clear();
      processDebugger.executionManager.resumeAllExecutions();
    }
  }

  function registerListeners(eventBus, processDebugger) {

    eventBus.onEvent('process-deployed', function(evt) {
      diagramChanged(processDebugger, evt);
    });

    eventBus.onEvent('diagram-changed', function(evt) {
      diagramChanged(processDebugger, evt.id);
    });

    eventBus.onEvent('OPEN', function() {
      processDebugger.breakpointManager.updateBreakpoints();
    });

    eventBus.onEvent('CLOSE', function() {
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

    this.breakpointManager = new BreakpointManager(workbench);

    this.executionManager = new ExecutionManager(workbench);

    /** @member {String} the Id of the currently associated process definition or 'null'*/
    this.processDefinitionId = null;

    /** @member {String} the Id of the currently associated process instance or 'null' */
    this.processInstanceId = null;

    // initialize
    registerListeners(workbench.eventBus, this);
  }

  /** deploy the current diagram */
  ProcessDebugger.prototype.deployProcess = function() {
    var self = this;
    this.workbench.diagramProvider.getBpmnXml(function(err, xml) {

      self.workbench.serverSession.deployProcess({
        resourceName: 'process.bpmn',
        resourceData: xml
      });

    });
  };

  ProcessDebugger.prototype.isSessionOpen = function() {
    return this.workbench.serverSession.isOpen();
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
        this.workbench.serverSession.startProcess({
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

  ProcessDebugger.prototype.toggleBreakpoint = function(id) {
    var selectedIds = (id && [id]) || this.workbench.diagramProvider.getSelectedElements();

    for(var i = 0; i<selectedIds.length; i++) {
      var elId = selectedIds[i];
      this.breakpointManager.toggleBreakpointBefore(elId, this.processDefinitionId);
    }
  };

  ProcessDebugger.prototype.canToggleBreakpoint = function() {
    return this.isSessionOpen() &&
      this.processDefinitionId !== null &&
      this.workbench.diagramProvider.getSelectedElements() !== null &&
      this.workbench.diagramProvider.getSelectedElements().length > 0;
  };

  ProcessDebugger.prototype.openSession = function() {
    // (re-)connect
    this.workbench.serverSession.wsConnection.open();
  };

  ProcessDebugger.prototype.canOpenSession = function() {
    return !this.isSessionOpen();
  };

  ProcessDebugger.prototype.closeSession = function() {
    // close connection to server
    this.workbench.serverSession.wsConnection.close();

  };

  ProcessDebugger.prototype.canCloseSession = function() {
    return this.isSessionOpen();
  };

  return ProcessDebugger;

})();

module.exports = ProcessDebugger;
