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

var BpmnJS = require('bpmn-js/lib/Modeler');


var DiagramManager = (function() {

  function registerListeners(renderer, diagramManager) {

    // selection changed listener
    renderer.on('selection.changed', function(e) {
      var selectedElements = e.newSelection;

      // collect ids
      var selectedIds = [];
      for(var i = 0; i < selectedElements.length; i++) {
        selectedIds.push(selectedElements[i].id);
      }

      diagramManager.selectedElements = selectedIds;
      diagramManager.workbench.update();
    });

  }

  function getDiagramProvider(diagramManager) {

    // expose the diagram provider
    // The diagram is the public API provided by this component
    // to the rest of the application
    return {
      /**
       * returns the semantic information about an element by id
       */
      getBpmnElement : function(id) {
        return diagramManager.renderer.get('bpmnRegistry').getSemantic(id);
      },

      getBpmnXml : function(done) {
        done(null, diagramManager.currentXmlSource);
        // TODO: use this once bpmn.io supports diagram export.
  /**      diagramManager.renderer.saveXML({ format: true }, function(err, xml) {
          done(err, xml);
        });
  */
      },

      getSelectedElements : function() {
        return diagramManager.selectedElements;
      },

      getProcessDefinition : function() {
        return diagramManager.processDefinition;
      }

   };
 }

  /**
   * @class
   * @classdesc manages the Bpmn-js resources
   * @param {Workbench} the workbench
   */
  function DiagramManager(workbench) {

    /** @member {Workbench} the current workbench */
    this.workbench = workbench;

    /** @member {BpmnJS} the bpmn viewer */
    this.renderer = null;

    this.currentXmlSource = null;

    this.processDefinition = null;

    this.selectedElements = [];

    this.workbench.diagramProvider = getDiagramProvider(this);
  }

  /**
   * Initializes the diagram renderer
   *
   * @param {Element} element the Dom Element on which the diagram renderer should be created.
   */
  DiagramManager.prototype.initDiagram = function(element) {

    var bpmnJSModules = BpmnJS.prototype._modules.concat([
      require('./debug-overlay'),
      {
        workbench: [ 'value', this.workbench ]
      }
    ]);

    // construct new renderer
    this.renderer = new BpmnJS({
      container: element,
      width: '100%',
      height: '100%',
      modules: bpmnJSModules
    });

    // register listeners on the renderer
    registerListeners(this.renderer, this);
  };

  DiagramManager.prototype.openProcess = function(data) {

    var diagramExists = this.currentXmlSource !== null;
    this.currentXmlSource = data.xml;
    this.processDefinition = data.processDefinition;

    var self = this;
    this.renderer.importXML(this.currentXmlSource, function(err) {

      if (err) {
        console.error(err);

      }
      if(self.processDefinition) {
        self.workbench.eventBus.fireEvent("diagram-changed", self.processDefinition.id);
      } else {
        self.workbench.eventBus.fireEvent("diagram-changed");
      }

    });

  };

  return DiagramManager;

})();

module.exports = DiagramManager;
