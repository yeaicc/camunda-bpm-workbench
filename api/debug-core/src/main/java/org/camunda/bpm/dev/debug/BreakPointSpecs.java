package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

import static org.camunda.bpm.engine.impl.pvm.runtime.operation.PvmAtomicOperation.*;

/**
 * @author Daniel Meyer
 *
 */
public enum BreakPointSpecs implements BreakPointSpec {

  /**
   * Breakpoint before an activity
   */
  BEFORE_ACTIVITY(ACTIVITY_START_CREATE_SCOPE, TRANSITION_CREATE_SCOPE),

  /**
   * Breakpoint after an activity
   */
  AFTER_ACTIVITY(ACTIVITY_END, TRANSITION_DESTROY_SCOPE),

  /**
   * Breakpoint while taking a transition
   */
  AT_TRANSITION(TRANSITION_NOTIFY_LISTENER_TAKE);

  // implementation ////////////////////////////////

  private BreakPointSpecs(AtomicOperation... operations) {
    this.operations = operations;
  }

  /**
   * the set of operations to break on
   */
  protected AtomicOperation[] operations;

  /**
   * return true if the breakpoint should suspend on the activity
   */
  public boolean breakOnOperation(AtomicOperation op) {
    for (AtomicOperation operation : operations) {
      if(operation.equals(op)) {
        return true;
      }
    }
    return false;
  }

}
