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

require('jquery');
var $ = window.jQuery;
var WsConnection = require('./wsConnection');

var ProcessEngineConnection = (function() {

  function ProcessEngineConnection() {
  }

  var currentServer;
  var listeners = [];


  function websocketGet(server, cmd, eventName, success) {
      var wsConnection = new WsConnection(server);
      wsConnection.open();

      wsConnection.onMessage(function(msgPayload) {
        var msg = JSON.parse(msgPayload.data);

        if (msg.event == "OPEN") {
          wsConnection.send(JSON.stringify(cmd));
        }
        if (msg.event == eventName) {
          success(msg.data);
          wsConnection.close();      
        } 
      });    
  }  

  ProcessEngineConnection.prototype.selectServer = function(server) {

    ProcessEngineConnection.currentServer = server;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }      

  }

  ProcessEngineConnection.prototype.addEngineChangedListener = function(listener) {
    listeners.push(listener);
  }

  ProcessEngineConnection.prototype.listProcessDefinitions = function(success) {
    if (!ProcessEngineConnection.currentServer) {
      success([]);
    }
    else if (ProcessEngineConnection.currentServer.webSocket) { // WebSocket  - test with RegEx: /^ws/.test(ProcessEngineConnection.currentServerUrl)
      var cmd = {
        "command": "list-process-definitions",
        "data": {}
      };
      websocketGet(ProcessEngineConnection.currentServer, cmd, "process-definitions-list", success);
    }
    else { // REST
      $.get(ProcessEngineConnection.currentServer.url + "/process-definition?sortBy=key&sortOrder=asc&sortBy=version&sortOrder=desc", function (data) {
        success(data);
      });
    }
  };

  ProcessEngineConnection.prototype.getProcessDefinitionXml = function(processDefinitionId, success) {
    if (!ProcessEngineConnection.currentServer) {
      //success({});
    }
    else if (ProcessEngineConnection.currentServer.webSocket) { // WebSocket  - test with RegEx: /^ws/.test(ProcessEngineConnection.currentServerUrl)
      var cmd = {
        "command" : "get-process-definition-xml",
        "data": processDefinitionId
      };
      websocketGet(ProcessEngineConnection.currentServer, cmd, "process-definition-xml", success);
    }
    else { // REST
      $.get( ProcessEngineConnection.currentServer.url + "/process-definition/" + processDefinitionId + "/xml", function( data ) {
        success(data.bpmn20Xml);
      });
    }
  };

  ProcessEngineConnection.prototype.validateOnEngine = function(workbench) {
     workbench.diagramProvider.getBpmnXml(function(error, xml) {
        var server = workbench.connectionManager.getDefaultServer();
        var cmd = {
          "command" : "validate-process",
          "data":  { 
            "resourceName": "process.bpmn",
            "resourceData": xml 
          } 
        };      
        websocketGet(server, cmd, "process-validated", function(validationErrorList) {
           console.log(validationErrorList);
           workbench.diagramProvider.addHighlights(validationErrorList, 'wb-validation-error-overlay', 'wb-validation-error-highlight');
        });
     });
  }

  return ProcessEngineConnection;

})();

module.exports = ProcessEngineConnection;