var angular = require("angular");

var service = [
function DebugSessionProvider(
) {

  /**
   * The url of the backend server. Used  for opening the 
   * Debug session.
   */
  var serverUrl = "ws://localhost:9090/debug-session";

  /**
   * Allows configuring the server url
   *
   * @param {String} serverUrl the url of the server to configure
   */
  this.setServerUrl = function(serverUrl) {
    this.serverUrl = serverUrl;
  };

  var DebugSession = (function() {

    /**
     * @class
     * @classdesc A debug session with the server
     *
     * @param {String} serverUrl the server url
     */
    function DebugSession(serverUrl, $rootScope) {

      this.serverUrl = serverUrl;
      this.$rootScope = $rootScope;
      this.eventListeners = {};
      this.__open();
    }

    DebugSession.prototype.__open = function() {
      this.ws = new WebSocket(this.serverUrl);
      var session = this;
      this.ws.onmessage = function(evt) {
        session.handleEvent(evt);
      };
    };

    /**
     * Sets the breakpoints on the session. 
     *
     * A breakpoint object is expected to have the form 
     * { "elementId": "ServiceTask_1", "type": "BEFORE_ACTIVITY" }
     *
     * @param {Array} an array of breakpoints
     */
    DebugSession.prototype.setBreakpoints = function(breakpoints) {

      var cmd = {
        "command" : "set-breakpoints",
        "data" : {
          "breakpoints" : breakpoints
        }
      };  

      this.__execute(cmd);
    };

    /**
     * Evaluate script
     *
     * Allows evaluating a script. ScriptInfo is expected to have the following form 
     * { "language": "Javascript", "script": "script source ...", "executionId": "some-suspended execution id"}
     *
     * @param {Object} input for the script evaluation
     */
    DebugSession.prototype.evaluateScript = function(scriptInfo) {

      var cmd = {
        "command" : "evaluate-script",
        "data" : scriptInfo
      };  

      this.__execute(cmd);
    };

    /**
     * Deploys a process
     * @param {String} resourceData the resource data of the form 
     * { "resourceName": "process.bpmn", "resourceData": "..." }
     */
    DebugSession.prototype.deployProcess = function(resourceData) {
      var cmd = {
        "command" : "deploy-process",
        "data" : resourceData
      };
      this.__execute(cmd);
    };

    /**
     * Start a Process Instance
     * @param {String} startProcessData command data of the form 
     * { "processDefinitionId": "someProcessDefinitionId" }
     */
    DebugSession.prototype.startProcess = function(startProcessData) {
      var cmd = {
        "command" : "start-process",
        "data" : startProcessData
      };
      this.__execute(cmd);
    };

    /**
     * Executes a command in the debug session
     * 
     * @param {Object} cmd the command object to execute
     * 
     */
    DebugSession.prototype.__execute = function(cmd) {
      var payload = this.__marshall(cmd);

      // send the payload through the websocket
      this.ws.send(payload);
    };

    DebugSession.prototype.__unmarshall = function(string) {
      return JSON.parse(string);
    };

    DebugSession.prototype.__marshall = function(object) {
      return JSON.stringify(object);
    };

    DebugSession.prototype.registerEventListener = function(eventName, callback) {
      var listeners = this.eventListeners;
      if(listeners[eventName] === undefined) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(callback);
    };

    DebugSession.prototype.handleEvent = function(evt) {

      var eventObject = this.__unmarshall(evt.data);
      var listeners = this.eventListeners[eventObject.event];

      if(!!listeners && listeners.length > 0) {
        this.notifyListeners(listeners, eventObject);
      }

    };

    DebugSession.prototype.notifyListeners = function(listeners, eventObject) {
      for(var i = 0; i < listeners.length; i++) {
        listeners[i](eventObject.data);
      }
      this.$rootScope.$digest();
    };

    return DebugSession;
  })();

  this.$get = ["$rootScope", function($rootScope) {
    // return a new debug session for the configured serverUrl
    return new DebugSession(serverUrl, $rootScope);
  }];

}];

module.exports = service;
