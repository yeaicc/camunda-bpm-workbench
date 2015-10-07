'use strict';

var fs = require('fs');

var directiveTemplate = fs.readFileSync(__dirname + '/scriptLanguageSelector.html', { encoding: 'utf-8' });

var SCRIPT_LANGUAGES = ["Javascript",
  "Ruby",
  "Groovy",
  "Juel",
  "Python"
];

var directive = function() {
  return {
    scope: {
      language: '='
    },
    template: directiveTemplate,
    link: function(scope, element, attrs) {
      scope.scriptLanguages = SCRIPT_LANGUAGES;

      scope.selectLanguage = function(lang) {
        scope.language = lang;
        scope.scriptLanguages = [];
        for(var i=0; i<SCRIPT_LANGUAGES.length; i++) {
          if(SCRIPT_LANGUAGES[i] != lang) {
            scope.scriptLanguages.push(SCRIPT_LANGUAGES[i]);
          }
        }
      };

    }
  };

};

module.exports = directive;
