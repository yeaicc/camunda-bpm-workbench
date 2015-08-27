'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.helppanel.directives', [])
  .directive('helpPanel', require('./helpPanel'));

module.exports = ngModule;
