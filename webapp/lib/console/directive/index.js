'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.console.directive', [
  require('../../util/scripting/directive').name,
  require('../../util/completion/directive').name
])
  .directive('ngEnter', require('./ngEnter'))
  .directive('ngUp', require('./ngUp'))
  .directive('ngDown', require('./ngDown'))
  .directive('dbgConsole', require('./dbgConsole'));

module.exports = ngModule;
