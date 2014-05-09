

var ngModule = angular.module('debugger');

ngModule.controller('debuggerController', function($scope) {


  var connection = ConnectionManager.createConnection();

  var processDebugger = new ProcessDebugger($scope, connection);


  processDebugger.setBreakpoint();

  processDebugger.eval();

  processDebugger.on('breakpoint.reached', function() {

  });


});


ngModule.directive('diagram', function() {
  return {
    scope: {
      'debugger': '='
    },
    controller: function($scope) {
      // ...
    }
  }
});

