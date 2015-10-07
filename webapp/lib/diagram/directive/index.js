'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.diagram.directive', [])
  .directive('dgrPanel', require('./dgrPanel'))
  .directive('dgrCanvas', require('./dgrCanvas'))
  .directive('dgrControls', require('./dgrControls'));

module.exports = ngModule;

