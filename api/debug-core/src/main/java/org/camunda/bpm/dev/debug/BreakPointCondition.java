package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;

public interface BreakPointCondition {

  boolean evaluate(ExecutionEntity executionEntity);
}
