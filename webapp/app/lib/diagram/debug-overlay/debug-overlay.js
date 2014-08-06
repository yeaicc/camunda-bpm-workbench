'use strict';


function DebugOverlay(eventBus, elementRegistry, workbench) {

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

    var statusGroup = group.group().attr({ class: 'dbg-status' }).translate(-15, bbox.height - 10);

    statusGroup.rect(0, 0, 30, 30, 10, 10).attr({ class: 'bg' });

    statusGroup
      .circle(15, 15, 10)
        .attr({ class: 'dbg-toggle-breakpoint' })
        .click(function() {
          self.toggleBreakpoint(semantic);
        });


    var buttonGroup = group.group().attr({ class: 'dbg-controls' }).translate(-15, bbox.height - 10);

    buttonGroup.rect(0, 0, 65, 30, 10, 10).attr({ class: 'bg' });

    buttonGroup
      .circle(15, 15, 10)
        .attr({ class: 'dbg-toggle-breakpoint' })
        .click(function() {
          self.toggleBreakpoint(semantic);
        });

    buttonGroup.line(34, 5, 34, 25);

    buttonGroup
      .path('M 43,5 L 60,15 L 43,25 Z')
        .attr({ class: 'dbg-play' })
        .click(function() {
          self.resume(semantic);
        });
  }

  eventBus.on('shape.added', function(e) {

    var gfx = e.gfx,
        element = e.element;

    var semantic = element.businessObject;

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
    console.log('breakpoint removed (!!!)', e);
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

DebugOverlay.prototype.toggleBreakpoint = function(semantic) {
  this._workbench.processDebugger.toggleBreakpoint(semantic.id);
  this._workbench.update();
};

DebugOverlay.prototype.resume = function(semantic) {
  this._workbench.processDebugger.runActivity(semantic.id);
  this._workbench.update();
};


DebugOverlay.$inject = [ 'eventBus', 'elementRegistry', 'workbench' ];

module.exports = DebugOverlay;