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

var ServerSession = (function() {

  /**
   * @class
   * @classdesc a debug session with the server
   *
   * @param {WsConnection} wsConnection the connection to the backend server
   * @param {EventBus} eventBus the event bus on which we can fire events
   */
  function ServerSession(wsConnection, eventBus) {

    /**
     * @member {WsConnection} the connection to the backend server
     */
    this.wsConnection = wsConnection;

    /**
     * @member {EventBus} the event bus
     */
    this.eventBus = eventBus;

    // register as message listener on the connection:
    wsConnection.onMessage(function(msg) {
      handleMessage(msg, eventBus);
    });
  }

  ServerSession.prototype.promise = function(evtName) {

    // buffered event
    var bufferedEvent = null;
    var callback = null;

    var listener = function(data) {
      if(!!callback) {
        callback(data);
      } else {
        bufferedEvent = data;
      }
    };

    this.eventBus.on(evtName, listener, true);

    return {
      success : function(callb) {
        if(!!bufferedEvent) {
          callb(bufferedEvent);
        } else {
          callback = callb;
        }
      }
    };

  };

  ServerSession.prototype.isOpen = function() {
    return this.wsConnection.isOpen();
  };

  // supported commands /////////////////////////

  /**
   * Sets the breakpoints on the session.
   *
   * A breakpoint object is expected to have the form
   * { "elementId": "ServiceTask_1", "type": "BEFORE_ACTIVITY" }
   *
   * @param {Array} an array of breakpoints
   */
  ServerSession.prototype.setBreakpoints = function(breakpoints) {

    var cmd = {
      "command" : "set-breakpoints",
      "data" : {
        "breakpoints" : breakpoints
      }
    };

    execute(cmd, this.wsConnection);
  };

  /**
   * Evaluate script
   *
   * Allows evaluating a script. ScriptInfo is expected to have the following form
   * { "language": "Javascript", "script": "script source ...", "executionId": "some-suspended execution id"}
   *
   * @param {Object} input for the script evaluation
   */
  ServerSession.prototype.evaluateScript = function(scriptInfo) {

    var cmd = {
      "command" : "evaluate-script",
      "data" : scriptInfo
    };

    execute(cmd, this.wsConnection);
  };

  /** Get Script */
  ServerSession.prototype.getScript = function(scriptInfo) {
    var cmd = {
      "command" : "get-script",
      "data" : scriptInfo
    };

    execute(cmd, this.wsConnection);
  };

  /** Update script */
  ServerSession.prototype.updateScript = function(scriptInfo) {
    var cmd = {
      "command" : "update-script",
      "data" : scriptInfo
    };

    execute(cmd, this.wsConnection);
  };

  /**
   * Deploys a process
   * @param {String} resourceData the resource data of the form
   * { "resourceName": "process.bpmn", "resourceData": "..." }
   */
  ServerSession.prototype.deployProcess = function(resourceData) {

    var cmd = {
      "command" : "deploy-process",
      "data" : resourceData
    };

    execute(cmd, this.wsConnection);

    return this.promise("process-deployed");
  };

  /**
   * Start a Process Instance
   * @param {String} startProcessData command data of the form
   * { "processDefinitionId": "someProcessDefinitionId" }
   */
  ServerSession.prototype.startProcess = function(startProcessData) {

    var cmd = {
      "command" : "start-process",
      "data" : startProcessData
    };

    execute(cmd, this.wsConnection);
  };

  /**
   * Resume an execution
   * @param {String} executionId a string providing the id of the execution
   */
  ServerSession.prototype.resumeExecution = function(id) {

    var cmd = {
      "command" : "resume-execution",
      "data" : id
    };

    execute(cmd, this.wsConnection);
  };

  /**
   * Step execution
   * @param {String} executionId a string providing the id of the execution
   */
  ServerSession.prototype.stepExecution = function(id) {

    var cmd = {
      "command" : "step-execution",
      "data" : id
    };

    execute(cmd, this.wsConnection);
  };

  /**
   * Command requesting the server to list process definitions
   * @return promise which can be used for getting notified about the result.
   */
  ServerSession.prototype.listProcessDefinitions = function() {
    var cmd = {
      "command" : "list-process-definitions",
      "data": {}
    };

    execute(cmd, this.wsConnection);

    return this.promise("process-definitions-list");
  };

  /**
   * Command requesting the server to list process definitions
   * @return promise which can be used for getting notified about the result.
   */
  ServerSession.prototype.getProcessDefinitionXml = function(processDefId) {
    var cmd = {
      "command" : "get-process-definition-xml",
      "data": processDefId
    };

    execute(cmd, this.wsConnection);

    return this.promise("process-definition-xml");
  };

  ServerSession.prototype.completeCodePrefix = function(completionRequest) {
    var cmd = {
      "command" : "code-completion",
      "data": completionRequest
    };

    execute(cmd, this.wsConnection);

    return this.promise("code-completion-hints");
  };

  // private static helpers /////////////////////

  /**
   * Executes a command in the debug session
   *
   * @param {Object} cmd the command object to execute
   * @param {WsConnection} connection the connection to send the command on
   *
   */
  function execute(cmd, connection) {
    var payload = marshall(cmd);

    // send the payload through the websocket
    connection.send(payload);
  }

  /**
   * Parse a string message as json
   */
  function unmarshall(string) {
    return JSON.parse(string);
  }

  /**
   * Transforms a JSON object into its string representation
   */
  function marshall(object) {
    return JSON.stringify(object);
  }


  function handleMessage(evt, eventBus) {

    // unmarshall the event
    var eventObject = unmarshall(evt.data);

    // fire event on bus
    eventBus.fireEvent(eventObject.event, eventObject.data);
  }

  return ServerSession;
})();

module.exports = ServerSession;
