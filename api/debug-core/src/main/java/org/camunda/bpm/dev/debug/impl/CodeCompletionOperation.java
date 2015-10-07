package org.camunda.bpm.dev.debug.impl;

import java.util.List;

import javax.script.Bindings;
import javax.script.SimpleBindings;

import org.camunda.bpm.dev.debug.completion.CodeCompleterBuilder;
import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.scripting.engine.ScriptBindingsFactory;

public class CodeCompletionOperation implements DebugOperation {

  protected String scopeId;
  protected String prefix;

  public CodeCompletionOperation(String scopeId, String prefix) {
    this.scopeId = scopeId;
    this.prefix = prefix;
  }

  public void execute(DebugSessionImpl debugSession, SuspendedExecutionImpl suspendedExecution) {
    CodeCompleterBuilder builder = new CodeCompleterBuilder();

    if (scopeId != null) {
      synchronized (suspendedExecution) {
        if(!suspendedExecution.isResumed) {
          ExecutionEntity executionEntity = suspendedExecution.getExecution();
          ScriptBindingsFactory bindingsFactory = Context.getProcessEngineConfiguration()
              .getScriptingEngines().getScriptBindingsFactory();
          Bindings scopeBindings = bindingsFactory.createBindings(executionEntity, new SimpleBindings());
          builder.bindings(scopeBindings);
        }
      }
    }

    List<CodeCompletionHint> hints = builder.buildCompleter().complete(prefix);
    debugSession.fireCodeCompletion(hints);
  }

}
