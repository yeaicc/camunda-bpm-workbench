'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.propertypanel.directives', [])
  .directive('propPanel', require('./propPanel'));

module.exports = ngModule;
