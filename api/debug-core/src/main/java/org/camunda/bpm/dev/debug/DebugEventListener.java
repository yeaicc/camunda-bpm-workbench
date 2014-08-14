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
