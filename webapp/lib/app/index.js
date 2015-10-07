'use strict';

var angular = require('angular'),
    uiBootstrap = require('angular-ui-bootstrap');

var ngModule = angular.module('developer.app', [
  require('./controller').name,
  uiBootstrap.name
]);

module.exports = ngModule;

