package org.camunda.bpm.dev.debug;

import java.lang.ref.WeakReference;

import org.camunda.bpm.dev.debug.impl.DebugSessionImpl;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;


/**
 * @author Daniel Meyer
 *
 */
public class StepBreakPoint extends BreakPoint {

  protected WeakReference<DebugSessionImpl> session;

  public StepBreakPoint(BreakPointSpec breakPointSpec, DebugSessionImpl debugSession) {
    super(breakPointSpec, null, null, null);
    this.session = new WeakReference<DebugSessionImpl>(debugSession);
  }

  public boolean breakOnOperation(AtomicOperation operation, ExecutionEntity execution) {
    return breakPointSpec.breakOnOperation(operation);
  }

  public DebugSessionImpl getSession() {
    return session.get();
  }

}
