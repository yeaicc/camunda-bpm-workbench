
angular
.module('app')
.controller('VariableCtrl', [
  '$scope',
function(
  $scope
  ) {

  /** 
   * The list of variables for this suspended execution 
   */
  $scope.variables = [];

  $scope.$on("executionSelected", function(e, execution) {
    if(!!execution) {
      $scope.variables = execution.variables;
    } else {
      $scope.variables = [];
    }
  });

}]);
