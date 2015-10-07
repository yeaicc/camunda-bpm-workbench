'use strict';

var fs = require('fs');
var directiveTemplate = fs.readFileSync(__dirname + '/scripteditor.html', { encoding: 'utf-8' });

var ScriptEditorController = [ '$scope', function($scope) {
  /** Some more used workbench items */
  var workbench = $scope.workbench;
  var serverSession = workbench.serverSession;
  var eventBus = workbench.eventBus;
  var processDebugger = workbench.processDebugger;


  /** This ids will be needed to fetch or update the script */

  var cmId = 90000;
  var activityId;
  var processDefinitionId;
  var executionId;

  /** list of available script languages */
  var SCRIPT_LANGUAGES = [
    "Javascript",
    "Ruby",
    "Groovy",
    "Juel",
    "Python"
  ];

  $scope.displayEditor = false;
  $scope.script = null;
  $scope.scriptLanguage = 'Javascript';
  $scope.scriptLanguages = SCRIPT_LANGUAGES;

  $scope.aceLoaded = function(_editor) {
    var session = _editor.getSession();

    session.setUseSoftTabs(true);
    session.setTabSize(2);

    _editor.setShowPrintMargin(false);
    _editor.setDisplayIndentGuides();
    _editor.setShowInvisibles(true);
  };

  var executeCommand = function(commandType, cmd) {
    if(commandType == 'update') serverSession.updateScript(cmd);
    if(commandType == 'get') serverSession.getScript(cmd);
    if(commandType == 'check') serverSession.evaluateScript(cmd);
  };

  $scope.selectLanguage = function(lang) {
    $scope.scriptLanguage = lang;
  };

  $scope.executeScript = function() {
    var script = $scope.script.replace(/\n/g, "");
    var cmd = {
      "activityId" : activityId,
      "processDefinitionId" : processDefinitionId,
      "script" : script,
      "language" : $scope.scriptLanguage
    };

    executeCommand('update', cmd);
  };

  $scope.evaluateScript = function() {
    var script = $scope.script.replace(/\n/g, "");
    executionId = processDebugger.executionManager.executions[0].id;

    var cmd = {
      "cmdId" : $scope.dbgCmdId++,
      "executionId" : executionId,
      "script" : script,
      "language" : $scope.scriptLanguage
    };
    $scope.commandResults.unshift(cmd);
    executeCommand('check', cmd);
  };

  eventBus.on('execution-suspended', function(data) {
    activityId = data.currentActivityId;
    processDefinitionId = processDebugger.processDefinitionId;
    var elementType = workbench.diagramProvider.getBpmnElement(data.currentActivityId).type;
    $scope.displayEditor = elementType == "bpmn:ScriptTask";

    var cmd = {
      "activityId" : data.currentActivityId,
      "processDefinitionId" : processDefinitionId
    };

    executeCommand('get', cmd);
  });

  serverSession.eventBus.on('get-script', function(data) {
    $scope.script = data.script.replace(/\\n/g, "\n");
  });

  serverSession.eventBus.on('script-update', function(data) {
    if(processDebugger.canRun(data.activityId)) {
      processDebugger.run(data.activityId);
    }
  });
}];

module.exports = function() {
  return {
    scope: {
      workbench : "=",
      commandResults : "=",
      dbgCmdId : "="
    },
    controller: ScriptEditorController,
    template: directiveTemplate,
  };
};

