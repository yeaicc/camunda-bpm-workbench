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
