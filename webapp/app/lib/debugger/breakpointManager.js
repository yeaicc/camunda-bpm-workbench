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

var BEFORE_ACTIVITY = 'BEFORE_ACTIVITY';
//var AFTER_ACTIVITY = 'AFTER_ACTIVITY';
//var AT_TRANSITION = 'AT_TRANSITION';

var Breakpoint = (function() {

  /**
   * @class
   * @classdesc A breakpoint
   *
   * @param {string} elementId The id of the element
   * @param {string} processDefinitionId The id of the process definition
   * @param {string} type The type of the breakpoint.
   */
  function Breakpoint(elementId, processDefinitionId, type) {
    this.elementId = elementId;
    this.processDefinitionId = processDefinitionId;
    this.type = type;
    this.isActive = true;
    this.condition = {script: null, scriptLanguage: 'Javascript'};
  }

  /**
   * @returns {string} a human presentable string representation 
   * of this breakpoint
   */
  Breakpoint.prototype.toString = function() {
    return this.type + ' ' + this.elementId;
  };

  /**
   * @returns {Object} the dto representation of this breakpoint
   */
  Breakpoint.prototype.asDto = function() {
    return {
      "elementId" : this.elementId,
      "processDefinitionId" : this.processDefinitionId,
      "type": this.type,
      "condition": {
        "script": this.condition.script,
        "language": this.condition.scriptLanguage
      }
    };
  };

  return Breakpoint;

})();

var BreakpointManager = (function() {

  /**
   * @classdesc The breakpoint manager allows managing
   * breakpoints
   */
  function BreakpointManager(workbench) {

    /** @member {DebugSession} the debug session */
    this.serverSession = workbench.serverSession;

    this.workbench = workbench;

    /** @private The list of breakpoints. */
    this.breakpoints = [];

  }

  /**
   * updates all active breakpoints in the debug session
   */
  BreakpointManager.prototype.updateBreakpoints = function() {

    if(this.serverSession.isOpen()) {

      var breakpointDtos = [];
      for (var i = 0; i<this.breakpoints.length; i++) {
        var bp = this.breakpoints[i];
        if(bp.isActive) {
          breakpointDtos.push(bp.asDto());
        }
      }

      this.serverSession.setBreakpoints(breakpointDtos);
    }

  };

  /**
   * updates an individual breakpoint
   */
  BreakpointManager.prototype.toggleBreakpointActive = function(bp) {
    var eventName;
    if(bp.isActive) {
      eventName = 'breakpoint-added';
    } else {
      eventName = 'breakpoint-removed';
    }

    // update breakpoints on server
    this.updateBreakpoints();

    // fire event
    this.workbench.eventBus.fireEvent(eventName, bp);
  };

  /** clears all breakpoints, here and on the server */
  BreakpointManager.prototype.clear= function() {

    this.breakpoints = [];
    this.updateBreakpoints();

  };

  /**
   * toggles a breakpoint
   *
   * @param {string} elementId The id of the element
   * @param {string} type The type of the breakpoint
   */
  BreakpointManager.prototype.toggleBreakpoint = function(elementId,processDefinitionId, type) {
    var removeIdx = -1;
    for(var i=0; i < this.breakpoints.length; i++) {
      var bp = this.breakpoints[i];
      if(bp.elementId === elementId && bp.type === type) {
        removeIdx = i;
      }
    }

    var eventName,
        changedBreakpoint;

    if(removeIdx >= 0) {
      // remove existing breakpoint
      eventName = "breakpoint-removed";
      changedBreakpoint = this.breakpoints[removeIdx];
      this.breakpoints.splice(removeIdx, 1);

    } else {
      // add new breakpoint
      eventName = "breakpoint-added";
      changedBreakpoint = new Breakpoint(elementId, processDefinitionId, type);
      this.breakpoints.push(changedBreakpoint);

    }

    this.updateBreakpoints();

    // fire event
    this.workbench.eventBus.fireEvent(eventName, changedBreakpoint);
  };

  /**
   * toggles a breakpoint before an element
   *
   * @param {string} the id of the element before which we want 
   * to toggle the breakpoint.
   * @param {string} the id of the process definition
   */
  BreakpointManager.prototype.toggleBreakpointBefore = function(elementId, processDefinitionId) {
    this.toggleBreakpoint(elementId, processDefinitionId, BEFORE_ACTIVITY);
  }; 

  /**
   * @returns {Array} a list of Breakpoints
   */
  BreakpointManager.prototype.getBreakpoints = function() {
    return this.breakpoints;
  };

  return BreakpointManager;

})();

module.exports = BreakpointManager;
