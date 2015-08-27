var jquery = require('jquery');
var angular = require('angular');

/** ACE Code Edito*/
var ace = require('../bower_components/ace-builds/src-min/ace');
var acei_javascript = require('../bower_components/ace-builds/src-min/mode-javascript');
var aceTheme = require('../bower_components/ace-builds/src-min/theme-xcode');
var uiAce = require('../bower_components/angular-ui-ace/ui-ace');

var ngModule = angular.module('developer', [
  require('./app').name,
  require('./navigation').name,
  require('./diagram').name,
  require('./debugger').name,
  require('./console').name,
  require('./help').name,
  'ui.ace'
]);

/*ngModule.config([ '$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);*/

module.exports = ngModule;
