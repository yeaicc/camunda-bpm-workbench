'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.app.controller', [])
  .controller('AppCtrl', require('./appCtrl'));

module.exports = ngModule;

