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

var BpmnModeler = require('bpmn-js/lib/Modeler'),
    BpmnViewer = require('bpmn-js/lib/Viewer');


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

    renderer.on('canvas.viewbox.changed', function(e) {
      diagramManager.cachedViewbox = e.viewbox;
    });

    renderer.on('commandStack.changed', function(e) {
      // reset cached XML (became invalid)
      diagramManager.cachedXML = null;
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
        return diagramManager.renderer.get('elementRegistry').get(id);
      },

      getBpmnXml : function(done) {

        var cachedXML = diagramManager.cachedXML;

        // use cached XML if nothing has changed
        if (cachedXML) {
          console.debug('using cached BPMN 2.0 XML');
          done(null, cachedXML);
        }

        // perform an export otherwise
        diagramManager.renderer.saveXML({ format: true }, function(err, xml) {
          if (!err) {
            diagramManager.cachedXML = xml;

            console.debug('exported BPMN 2.0 XML');
            console.debug(xml);
          } else {
            console.error('error exporting BPMN 2.0 XML');
            console.error(err);
          }

          done(err, xml);
        });
      },

      getSelectedElements : function() {
        return diagramManager.selectedElements;
      },

      getProcessDefinition : function() {
        return diagramManager.processDefinition;
      },

      executeCommand : function(name, cmd) {
        diagramManager.renderer.get('commandStack').execute(name, cmd);
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
  DiagramManager.prototype.initDiagram = function(element, perspective) {

    var BpmnJS,
        additionalModules;

    if (perspective === 'model') {
      BpmnJS = BpmnModeler;

      additionalModules = [
        require('diagram-js-origin'),
        require('./palette-extension'),
        require('./property-update')
      ];
    } else {
      BpmnJS = BpmnViewer;

      additionalModules = [
        require('diagram-js/lib/navigation/zoomscroll'),
        require('diagram-js/lib/navigation/movecanvas'),
        require('bpmn-js-debug-overlay'),
        require('./debug-bridge'),
        {
          workbench: [ 'value', this.workbench ]
        }
      ];
    }

    if (this.renderer) {
      // TODO(nre): replace with renderer.destroy() once bpmn-js 0.7.0 is out
      this.renderer.clear();
      this.renderer.container.parentNode.removeChild(this.renderer.container);
    }

    // construct new renderer
    this.renderer = new BpmnJS({
      container: element,
      debugOverlay: {
        buttons: {
          'break': { className: 'glyphicon glyphicon-record' },
          'resume': { className: 'glyphicon glyphicon-play' }
        }
      },
      additionalModules: additionalModules
    });

    // register listeners on the renderer
    registerListeners(this.renderer, this);

    if (this.diagramLoaded) {
      this.openProcess();
    }
  };

  DiagramManager.prototype.openProcess = function(data) {

    // open new process, cache xml
    // and reset saved viewbox
    if (data) {
      this.cachedXML = data.xml;
      this.cachedViewbox = null;
      this.processDefinition = data.processDefinition;
    }

    var self = this;
    this.renderer.importXML(this.cachedXML, function(err) {

      if (err) {
        console.error(err);
      } else {

        self.diagramLoaded = true;

        // apply cached viewbox
        if (self.cachedViewbox) {
          self.renderer.get('canvas').viewbox(self.cachedViewbox);
        }
      }


      if (self.processDefinition) {
        self.workbench.eventBus.fireEvent('diagram-changed', self.processDefinition.id);
      } else {
        self.workbench.eventBus.fireEvent('diagram-changed');
      }

    });

  };

  return DiagramManager;

})();

module.exports = DiagramManager;
