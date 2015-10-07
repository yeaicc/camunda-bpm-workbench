'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.util.completion.directive', [])
  .directive('textcomplete', require('./textcomplete'));

module.exports = ngModule;
