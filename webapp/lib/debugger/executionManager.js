'use strict';

var BEFORE_ACTIVITY = 'BEFORE_ACTIVITY';
var AFTER_ACTIVITY = 'AFTER_ACTIVITY';
var BREAKPOINT_NAMES = {};
BREAKPOINT_NAMES[BEFORE_ACTIVITY] = 'Before';
BREAKPOINT_NAMES[AFTER_ACTIVITY] = 'After';

var ExecutionManager = (function() {

  // static helper functions /////////////

  function registerListeners(eventBus, executionManager) {
    eventBus.on('execution-suspended', function(data) {
      executionManager.executions.push(data);

      // auto-select if it is the first execution
      if(executionManager.executions.length == 1) {
        executionManager.select(data);
      }
    });

    eventBus.on('execution-updated', function(data) {
      var executions = executionManager.executions;
      var idx = -1;
      for(var i = 0; i < executions.length; i++) {
        if(executions[i].id === data.id) {
          idx = i;
          break;
        }
      }
      if(idx >= 0) {
        executionManager.executions[i] = data;
        if(executionManager.selectedExecution && executionManager.selectedExecution.id === data.id) {
          executionManager.selectedExecution = data;
        }
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
      this.workbench.eventBus.fireEvent("execution-deselected", execution);
    }
  };

  ExecutionManager.prototype.stepExecution = function(execution) {
    var idx = this.executions.indexOf(execution);
    if(idx >= 0) {
      this.serverSession.stepExecution(execution.id);
      this.executions.splice(idx, 1);
      this.selectedExecution = null;
      this.workbench.eventBus.fireEvent("execution-deselected", execution);
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

  ExecutionManager.prototype.breakPointTypeName = function(ex) {
    return BREAKPOINT_NAMES[ex.breakPointType];
  };

  return ExecutionManager;
})();

module.exports = ExecutionManager;
