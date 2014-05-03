var angular = require('angular');

var ngModule = angular.module('developer.debugger.service', []);

ngModule.provider("DebugSession", require("./debugsessionService"));

module.exports = ngModule;
