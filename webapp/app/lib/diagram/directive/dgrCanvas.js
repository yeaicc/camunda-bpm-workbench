/* Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs = require('fs');

var directiveTemplate = fs.readFileSync(__dirname + '/dgrCanvas.html', { encoding: 'utf-8' });

var demoProcess = fs.readFileSync(__dirname + '/exampleProcess.bpmn', { encoding: 'utf-8' });

module.exports = function() {
  return {
    scope: {
      'perspective': '=',
      'diagramManager': '='
    },
    template: directiveTemplate,
    link: function(scope, element) {

      // listen to undo / redo action on an element
      // triggered by (CTRL|META)+(Y|Z)

      function listenUndoRedo(e) {
        if (e.ctrlKey || e.metaKey) {

          if (e.which === 89 || e.which === 90) {
            e.preventDefault();
            e.stopPropagation();
          }

          // Y = 89
          if (e.which === 89) {
            try {
              scope.diagramManager.renderer.get('commandStack').redo();
            } catch (e) {
              // jup
            }
          }

          // Z = 90
          if (e.which === 90) {
            try {
              scope.diagramManager.renderer.get('commandStack').undo();
            } catch (e) {
              // jup
            }
          }
        }
      }

      // capture undo / redo if mouse focus is active only

      element.on('mouseenter', function(e) {
        document.addEventListener('keydown', listenUndoRedo);
      });

      element.on('mouseleave', function(e) {
        document.removeEventListener('keydown', listenUndoRedo);
      });

      scope.$watch('perspective', function(newValue) {

        var diagramManager = scope.diagramManager;

        // initialize the diagram
        diagramManager.initDiagram(element, newValue);

        if (!diagramManager.currentXmlSource) {
          // open the example diagram
          scope.diagramManager.openProcess({ xml : demoProcess });
        }
      });
    }
  };
};

