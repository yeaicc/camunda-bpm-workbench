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

var propertiesPanelModule = require('bpmn-js-properties-panel/lib'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda'),
    camundaModdlePackage = require('bpmn-js-properties-panel/lib/provider/camunda/camunda-moddle');

require('jquery');
var angular = require('angular');
var $ = window.jQuery;

var propertiesPanelConfig = {
  "config.propertiesPanel": ['value', { parent: $('#prop-panel-container') }]
}

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

      getProcessElement : function() {
        if(!!diagramManager.renderer.diagram) {
          return diagramManager.renderer.get('canvas').getRootElement();
        }
      },

      triggerSearch: function(searchText) {
        diagramManager.latestSearch = searchText;
      },
      getLatestSearch: function() {
        return diagramManager.latestSearch;
      },

      addHighlights: function(highlighContent, errorMessageCssClass, highlightCssClass) {
        var overlays = diagramManager.renderer.get('overlays');
        var canvas = diagramManager.renderer.get('canvas');

        for (var i=0; i<diagramManager.activeOverlays.length; i++) {
          overlays.remove(diagramManager.activeOverlays[i]);
        }

        diagramManager.activeOverlays = [];

        for (var key in highlighContent) {
            var errors = highlighContent[key];

            var errorText = "";
            var searchText = "";
            for (var i=0; i < errors.length; i++) {
                errorText = errorText + errors[i] + "<br>";
                searchText = searchText + errors[i] + " ";
            }

            searchText = searchText.replace(/'/g, '');

            var html = '<div class="'+errorMessageCssClass+'"><div class="'+errorMessageCssClass+'-icon pull-right">' +
                '<span class="glyphicon glyphicon-search" ng-click="triggerSearch(\''  +  searchText +  '\')"></span></div>'+errorText+'</div>';
            var helpOverlay = angular.element(html);

            diagramManager.$compile(helpOverlay)(diagramManager.$scope);

            try {
              // attach an overlay to a node
              var overlayId = overlays.add(key, {
                position: {
                  bottom: -10,
                  left: 10
                },
                html: helpOverlay
              });
              diagramManager.activeOverlays.push(overlayId);

              canvas.addMarker(key, highlightCssClass)
            }
            catch (e) {} // we get elements that are not visualized (like messageEventDefinition) - igfnore for now (TODO)

        };
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
  function DiagramManager(workbench, $scope, $compile) {

    /** @member {Workbench} the current workbench */
    this.workbench = workbench;

    /** @member {BpmnJS} the bpmn viewer */
    this.renderer = null;

    this.currentXmlSource = null;

    this.processDefinition = null;

    this.selectedElements = [];

    this.workbench.diagramProvider = getDiagramProvider(this);

    this.latestSearch = null;

    this.activeOverlays = [];

    this.$scope = $scope;
    this.$compile = $compile;
  }

  /**
   * Initializes the diagram renderer
   *
   * @param {Element} element the Dom Element on which the diagram renderer should be created.
   */
  DiagramManager.prototype.initDiagram = function(element, perspective) {

    var BpmnJS,
        additionalModules;

    if (this.renderer) {
      this.renderer.destroy();
    }

    if (perspective === 'model') {
      // construct new modeler
      this.renderer = new BpmnModeler({
        container: element,
        keyboard: { bindTo: document.body },        
        position: 'absolute',
        debugOverlay: {
          buttons: {
            'break': { className: 'glyphicon glyphicon-record' },
            'resume': { className: 'glyphicon glyphicon-play' }
          }
        },
        additionalModules: [
          require('diagram-js-origin'),
          propertiesPanelModule, propertiesProviderModule, propertiesPanelConfig
//          require('./palette-extension'),
//          require('./property-update')
        ],
        moddleExtensions: {camunda: camundaModdlePackage}
      });
    } else {
      // construct new renderer
      this.renderer = new BpmnModeler({
        container: element,
        position: 'absolute',
        debugOverlay: {
          buttons: {
            'break': { className: 'glyphicon glyphicon-record' },
            'resume': { className: 'glyphicon glyphicon-play' }
          }
        },
        additionalModules: [
          propertiesPanelModule, propertiesProviderModule, propertiesPanelConfig,
          require('diagram-js/lib/navigation/zoomscroll'),
          require('diagram-js/lib/navigation/movecanvas'),
          require('bpmn-js-debug-overlay'),
          require('./debug-bridge'),
          {
            workbench: [ 'value', this.workbench ]
          }
        ]
      });

/*
 this.renderer = new BpmnViewer({
 container: element,
 position: 'absolute',
 debugOverlay: {
 buttons: {
 'break': { className: 'glyphicon glyphicon-record' },
 'resume': { className: 'glyphicon glyphicon-play' }
 }
 },
 additionalModules: [
 require('diagram-js/lib/navigation/zoomscroll'),
 require('diagram-js/lib/navigation/movecanvas'),
 require('bpmn-js-debug-overlay'),
 require('./debug-bridge'),
 {
 workbench: [ 'value', this.workbench ]
 }
 ]
 });

       */
    }

    // register listeners on the renderer
    registerListeners(this.renderer, this);

    // TODO: Here is something REALLY broken now - investigate!!!!!!
    if (this.diagramLoaded && this.cachedXML) {
      this.openProcess();
    }
  };

  DiagramManager.prototype.createProcess = function() {
    var self = this;
    this.renderer.createDiagram(function() {
      self.workbench.eventBus.fireEvent('diagram-changed');
    });
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
