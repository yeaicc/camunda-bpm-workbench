
angular
.module('app')
.controller('BreakpointCtrl', [
  '$scope',
  'BreakpointService',
  'DebugSession',
function(
  $scope,
  BreakpointService,
  DebugSession) {

  /**
   * The list of current breakpoints provided as a scope variable
   */
  $scope.breakpoints = [];

  $scope.$watch(function() { return BreakpointService.getBreakpoints(); }, function(b) {
    $scope.breakpoints = b;
  });

}]);
