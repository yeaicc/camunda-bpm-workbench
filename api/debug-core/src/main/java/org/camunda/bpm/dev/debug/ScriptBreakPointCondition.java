/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
        .createScriptFromSource(scriptingLanguage, script);

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
