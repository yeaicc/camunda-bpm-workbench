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

var ProcessDebugger = (function() {

  function ProcessDebugger(workbench) {

    /** @member the workbench */
    this.workbench = workbench;
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
    return this.workbench
      .debugSession
      .wsConnection
      .ws !== null;
  };

  /** returns true if it is possible to deploy a process */
  ProcessDebugger.prototype.canDeployProcess = function() {
    return this.isSessionOpen();
  };

  ProcessDebugger.prototype.run = function() {
  };

  ProcessDebugger.prototype.canRun = function() {
    return false;
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
  };

  ProcessDebugger.prototype.canToggleBreakpoint = function() {
    return false;
  };

  ProcessDebugger.prototype.openSession = function() {
    this.workbench.debugSession.wsConnection.open();
  };

  ProcessDebugger.prototype.canOpenSession = function() {
    return !this.isSessionOpen();
  };

  ProcessDebugger.prototype.closeSession = function() {
    this.workbench.debugSession.wsConnection.close();
  };

  ProcessDebugger.prototype.canCloseSession = function() {
    return this.isSessionOpen();
  };

  return ProcessDebugger;

})();

module.exports = ProcessDebugger;
