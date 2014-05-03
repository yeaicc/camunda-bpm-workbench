var angular = require('angular'),
    fs = require('fs'),
    jQuery = require('jquery');


function getCursorPosition(el) {
  el = el[0];
  var pos = 0;
  if('selectionStart' in el) {
    pos = el.selectionStart;
  } else if('selection' in document) {
    el.focus();
    var Sel = document.selection.createRange();
    var SelLength = document.selection.createRange().text.length;
    Sel.moveStart('character', -el.value.length);
    pos = Sel.text.length - SelLength;
  }
  return pos;
}

function setCursorPosition(el, selectionStart, selectionEnd) {
  el = el[0];
  if(!selectionEnd) {
    selectionEnd = selectionStart;
  }
  if (el.setSelectionRange) {
    el.focus();
    el.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (el.createTextRange) {
    var range = el.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}

var ngModule = angular.module('developer.console.directive', []);

var ConsoleController = [
  '$scope',
  'DebugSession',
function(
  $scope,
  DebugSession
  ) {

  /** list of available script languages */
  var SCRIPT_LANGUAGES = [
    "Javascript",
    "Ruby",
    "Groovy",
    "Juel",
    "Python"
  ];

  var nextId = 0;

  /**
   * the console input is bound to this field
   */
  $scope.script = null;

  /**
   * the id of the currently suspended execution
   */
  $scope.executionId = null;

  /**
   * the list of script evaluations already performed (history)
   */
  $scope.evaluationResults = [];

  /**
   * currently selected script language
   */
  $scope.scriptLanguage = null;

  $scope.scriptLanguages = SCRIPT_LANGUAGES;

  $scope.evaluate = function() {
    var cmdId = nextId++;

    var cmd = {
      "cmdId" : cmdId,
      "language": $scope.scriptLanguage,
      "executionId": $scope.executionId,
      "script": $scope.script,
    };

    $scope.evaluationResults.push(cmd);

    DebugSession.evaluateScript(cmd);

  };

  $scope.$on("executionSelected", function(e, execution) {
    if(!!execution) {
      $scope.executionId = execution.id;
    } else {
      $scope.executionId =null; 
    }
  });

  function addEvaluationResults(data, failed) {
    var cmdId = data.cmdId;
    for(var i = 0; i < $scope.evaluationResults.length; i++) {
      var result = $scope.evaluationResults[i];
      if(result.cmdId == cmdId) {
        result.result = data.result;
        result.evaluationFailed = failed;
      }
    }
  }

  $scope.selectLanguage = function(lang) {
    $scope.scriptLanguage = lang;
    $scope.scriptLanguages = [];
    for(var i=0; i<SCRIPT_LANGUAGES.length; i++) {
      if(SCRIPT_LANGUAGES[i] != lang) {
        $scope.scriptLanguages.push(SCRIPT_LANGUAGES[i]);
      }
    }
  };

  DebugSession.registerEventListener("script-evaluated", function(data) {
    addEvaluationResults(data, false);
  });

  DebugSession.registerEventListener("script-evaluation-failed", function(data) {
    addEvaluationResults(data, true);
  });

  // init
  $scope.selectLanguage("Javascript"); 
}];

var directiveTemplate = fs.readFileSync(__dirname + '/console.html', { encoding: 'utf-8' });

ngModule.directive('dbgConsole', function() {
  return {
    scope: {
    },
    controller: ConsoleController,
    template: directiveTemplate,
    link: function(scope, element, attrs, controller) {

    }
  };
});

ngModule.directive('ngEnter', function() {
  return function(scope, element, attrs) {

    var rows = 0;

    function getCursorPos() {
      var pos = element.val().length;
      if('selectionStart' in element) {
        pos = el.selectionStart;
      } else if('selection' in document) {
        element.focus();
        pos = document.selection.createRange();
      }
      return pos;
    }

    function addRow() {
      var cpos = getCursorPosition(element);
      var textContent = element.val();
      textContent = [textContent.slice(0, cpos), "\n", textContent.slice(cpos)].join('');
      element.val(textContent);
      setCursorPosition(element, cpos+1);
      element.attr("rows", ++rows);
    }

    addRow();

    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        if(!event.shiftKey) {

          scope.$apply(function(){
            scope.$eval(attrs.ngEnter, {'event': event});
          });

        } else {
          addRow();

        }

        event.preventDefault();
      }
    });
  };
});

module.exports = ngModule;
