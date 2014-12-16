
function DebugBridge(eventBus, elementRegistry, workbench) {

  function getElement(id) {
    return elementRegistry.get(id);
  }

  function fire(event, element) {
    eventBus.fire(event, { element: getElement(element) });
  }


  // workbench -> debug overlay integration

  function suspended(e) {
    fire('debug.step', e.currentActivityId);
  }

  function unsuspended(e) {
    fire('debug.resumed', e.currentActivityId);
  }

  function breakpointAdded(e) {
    fire('debug.breakpoint.added', e.elementId);
  }

  function breakpointRemoved(e) {
    fire('debug.breakpoint.removed', e.elementId);
  }

  var workbenchEvents = workbench.eventBus;

  workbenchEvents.onEvent('execution-suspended', suspended);
  workbenchEvents.onEvent('execution-unsuspended', unsuspended);
  workbenchEvents.onEvent('breakpoint-added', breakpointAdded);
  workbenchEvents.onEvent('breakpoint-removed', breakpointRemoved);

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

    workbench.processDebugger.toggleBreakpoint(element.id);
    workbench.update();
  });
}


DebugBridge.$inject = [ 'eventBus', 'elementRegistry', 'workbench' ];

module.exports = DebugBridge;