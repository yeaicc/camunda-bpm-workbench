package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

/**
 * @author Daniel Meyer
 *
 */
public interface BreakPointSpec {

  boolean breakOnOperation(AtomicOperation operation);

}
