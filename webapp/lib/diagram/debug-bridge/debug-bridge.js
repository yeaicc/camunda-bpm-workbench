
function DebugBridge(eventBus, elementRegistry, workbench) {

  function getElement(id) {
    return elementRegistry.get(id);
  }

  function fire(event, payload) {
    eventBus.fire(event, payload);
  }

  var WORKBENCH_DBG_CONTROLS_TYPE_MAPPING = {
    BEFORE_ACTIVITY: 'before',
    AFTER_ACTIVITY: 'after'
  };

  var DBG_CONTROLS_WORKBENCH_TYPE_MAPPING = {
    before: 'BEFORE_ACTIVITY',
    after: 'AFTER_ACTIVITY'
  };

  // workbench -> debug overlay integration

  function suspended(e) {
    fire('debug.step', { element: getElement(e.currentActivityId) });
  }

  function unsuspended(e) {
    fire('debug.resumed', { element: getElement(e.currentActivityId) });
  }

  function breakpointAdded(e) {
    fire('debug.breakpoint.added', {
      element: getElement(e.elementId),
      location: WORKBENCH_DBG_CONTROLS_TYPE_MAPPING[e.type]
    });
  }

  function breakpointRemoved(e) {
    fire('debug.breakpoint.removed', {
      element: getElement(e.elementId),
      location: WORKBENCH_DBG_CONTROLS_TYPE_MAPPING[e.type]
    });
  }

  var workbenchEvents = workbench.eventBus;

  workbenchEvents.on('execution-suspended', suspended);
  workbenchEvents.on('execution-unsuspended', unsuspended);
  workbenchEvents.on('breakpoint-added', breakpointAdded);
  workbenchEvents.on('breakpoint-removed', breakpointRemoved);

  eventBus.on('diagram.destroy', function() {
    workbenchEvents.off('execution-suspended', suspended);
    workbenchEvents.off('execution-unsuspended', unsuspended);
    workbenchEvents.off('breakpoint-added', breakpointAdded);
    workbenchEvents.off('breakpoint-removed', breakpointRemoved);
  });


  // debug overlay -> workbench integration

  function resume(e) {
    var element = e.element;

    workbench.processDebugger.runActivity(element.id);
    workbench.update();
  }

  eventBus.on('debug.resume', resume);

  eventBus.on([ 'debug.breakpoint.add', 'debug.breakpoint.remove' ], function(e) {
    var element = e.element;

    workbench.processDebugger.toggleBreakpoint(element.id, DBG_CONTROLS_WORKBENCH_TYPE_MAPPING[e.location]);
    workbench.update();
  });
}


DebugBridge.$inject = [ 'eventBus', 'elementRegistry', 'workbench' ];

module.exports = DebugBridge;