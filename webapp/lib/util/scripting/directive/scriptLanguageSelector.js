/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
