
angular
.module('app')
.controller('ExecutionCtrl', [
  '$scope',
  '$rootScope',
  'DebugSession',
function(
  $scope,
  $rootScope,
  DebugSession) {

  /**
   * The list of currently suspended executions
   */
  $scope.executions = [];

  /** 
   * The currently selected exection
   */
  $scope.selectedExecution = null;

  DebugSession.registerEventListener("execution-suspended", function(data) {
    $scope.executions.push(data);
  });

  /**
   * Allows selecting an execution
   *
   * @param {Object} execution the suspended execution
   */
  $scope.selectExecution = function(execution) {
    $scope.selectedExecution = execution;
    $rootScope.$broadcast("executionSelected", execution);
  }; 


}]);
