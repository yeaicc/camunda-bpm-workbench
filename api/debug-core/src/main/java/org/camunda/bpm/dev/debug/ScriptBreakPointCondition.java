package org.camunda.bpm.dev.debug;

import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.scripting.ExecutableScript;

public class ScriptBreakPointCondition implements BreakPointCondition {

  protected String script;
  protected String scriptingLanguage;

  public String getScript() {
    return script;
  }

  public void setScript(String script) {
    this.script = script;
  }

  public String getScriptingLanguage() {
    return scriptingLanguage;
  }

  public void setScriptingLanguage(String scriptingLanguage) {
    this.scriptingLanguage = scriptingLanguage;
  }

  public boolean evaluate(ExecutionEntity executionEntity) {
    if (script == null) {
      return true;
    }

    Context.getProcessEngineConfiguration().getScriptFactory();

    ExecutableScript executableScript = Context.getProcessEngineConfiguration()
        .getScriptFactory()
        .createScript(script, scriptingLanguage);

    Object result = Context.getProcessEngineConfiguration()
        .getScriptingEnvironment()
        .execute(executableScript, executionEntity);


    if (result == null) {
      throw new DebuggerException("Breakpoint condition evaluates to null: " + script);
    } else if (!(result instanceof Boolean)) {
      throw new DebuggerException("Script does not return boolean value: " + script);
    }

    return (Boolean) result;
  }
}
