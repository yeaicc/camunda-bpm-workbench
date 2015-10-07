'use strict';

var Workbench = (function() {

  function Workbench() {

    /**
     * The session with the server
     */
    this.serverSession = null;

    /**
     * The diagram provider allows interacting with the diagram
     */
    this.diagramProvider = null;

    /**
     * The workbench event bus
     */
    this.eventBus = null;

    this.update = null;

    // the current view on the workbench
    this.perspective = 'model';
  }

  return Workbench;

})();

module.exports = Workbench;
