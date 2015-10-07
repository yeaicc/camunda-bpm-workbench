'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.util.scripting.directive', [])
  .directive('scriptLanguageSelector', require('./scriptLanguageSelector'));

module.exports = ngModule;
