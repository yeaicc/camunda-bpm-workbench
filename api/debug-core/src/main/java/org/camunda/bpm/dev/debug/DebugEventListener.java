package org.camunda.bpm.dev.debug;

import java.util.List;

import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;
import org.camunda.bpm.dev.debug.impl.DebugScriptEvaluation;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

/**
 * @author Daniel Meyer
 *
 */
public interface DebugEventListener {

  public void onExecutionSuspended(SuspendedExecution execution);

  public void onExecutionUpdated(SuspendedExecution suspendedExecution);

  public void onExecutionUnsuspended(SuspendedExecution suspendedExecution);

  public void onScriptEvaluated(DebugScriptEvaluation scriptEvaluation);

  public void onScriptEvaluationFailed(DebugScriptEvaluation scriptEvaluation);

  public void onException(Exception e, ExecutionEntity execution, AtomicOperation operation);

  public void onCodeCompletion(List<CodeCompletionHint> completionHints);

}
