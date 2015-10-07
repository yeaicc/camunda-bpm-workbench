'use strict';

var angular = require('angular');



var ngModule = angular.module('developer.scripteditor.directive', [])
  .directive('scripteditor', require('./scripteditor'));

module.exports = ngModule;

