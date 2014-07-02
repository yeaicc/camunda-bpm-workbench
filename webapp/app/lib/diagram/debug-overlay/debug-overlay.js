'use strict';


function DebugOverlay(eventBus, bpmnRegistry, elementRegistry, workbench) {

  var self = this;

  this._workbench = workbench;
  this._eventBus = eventBus;

  this._elementRegistry = elementRegistry;

  function addDebugControls(element, gfx, semantic) {

    var group = gfx.group();

    var bbox = gfx.select('.djs-visual').getBBox();

    group.rect(-5, -5, element.width + 10, element.height + 10, 0, 0).attr({
      fill: 'none',
      class: 'dbg-suspended-marker'
    });

    var buttonGroup = group.group().attr({ class: 'dbg-controls' }).translate(0, bbox.height - 5);

    buttonGroup
      .circle(12, 12, 12)
        .attr({ class: 'dbg-toggle-breakpoint' })
        .click(function() {
          self.toggleBreakpoint(semantic);
        });
  }

  eventBus.on('shape.added', function(e) {

    var gfx = e.gfx,
        element = e.element;

    var semantic = bpmnRegistry.getSemantic(element);

    if (element.type !== 'label' && semantic.$instanceOf('bpmn:FlowNode')) {
      addDebugControls(element, gfx, semantic);
    }
  });

  function suspendedListener(e) {
    self.setSuspendedState(e.currentActivityId, true);
  }

  function unsuspendedListener(e) {
    self.setSuspendedState(e.currentActivityId, false);
  }

  function breakpointAddedListener(e) {
    self.setBreakpointState(e.elementId, true);
  }

  function breakpointRemovedListener(e) {
    self.setBreakpointState(e.elementId, false);
  }

  var workbenchEvts = workbench.eventBus;

  workbenchEvts.onEvent('execution-suspended', suspendedListener);
  workbenchEvts.onEvent('execution-unsuspended', unsuspendedListener);

  workbenchEvts.onEvent('breakpoint-added', breakpointAddedListener);
  workbenchEvts.onEvent('breakpoint-removed', breakpointRemovedListener);


  eventBus.on('diagram.destroy', function() {
    workbenchEvts.off('execution-suspended', suspendedListener);
    workbenchEvts.off('execution-unsuspended', unsuspendedListener);
    workbenchEvts.off('breakpoint-added', breakpointAddedListener);
    workbenchEvts.off('breakpoint-removed', breakpointRemovedListener);
  });
}

DebugOverlay.prototype.setSuspendedState = function(id, active) {
  var gfx = this._elementRegistry.getGraphicsByElement(id);
  gfx[active ? 'addClass' : 'removeClass']('dbg-suspended');
};

DebugOverlay.prototype.setBreakpointState = function(id, active) {
  var gfx = this._elementRegistry.getGraphicsByElement(id);
  gfx[active ? 'addClass' : 'removeClass']('dbg-breakpoint-active');
};

DebugOverlay.prototype.toggleBreakpoint = function(e) {
  this._workbench.processDebugger.toggleBreakpoint(e.id);
  this._workbench.update();
};

DebugOverlay.prototype.updateOverlays = function(e) {
  console.log('DebugOverlay#updateOverlays', e);
};


DebugOverlay.$inject = [ 'eventBus', 'bpmnRegistry', 'elementRegistry', 'workbench' ];

module.exports = DebugOverlay;