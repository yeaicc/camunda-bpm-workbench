'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.debugger.directive', [
  require('../../util/scripting/directive').name
])
  .directive('dbgPanel', require('./dbgPanel'))
  .directive('dbgControls', require('./dbgControls'))
  .directive('dbgExecutions', require('./dbgExecutions'))
  .directive('dbgBreakpoints', require('./dbgBreakpoints'))
  .directive('dbgVariables', require('./dbgVariables'));

module.exports = ngModule;
