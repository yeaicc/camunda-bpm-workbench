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
package org.camunda.bpm.debugger.server.protocol;

import java.util.List;

import io.netty.channel.Channel;

import org.camunda.bpm.debugger.server.protocol.dto.CodeCompletionDto;
import org.camunda.bpm.debugger.server.protocol.dto.ErrorData;
import org.camunda.bpm.debugger.server.protocol.dto.ScriptEvaluationData;
import org.camunda.bpm.debugger.server.protocol.dto.SuspendedExecutionData;
import org.camunda.bpm.debugger.server.protocol.evt.CodeCompletionEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ErrorEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ExecutionSuspendedEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ExecutionUnsuspendedEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ExecutionUpdatedEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ScriptEvaluatedEvt;
import org.camunda.bpm.debugger.server.protocol.evt.ScriptEvaluationFailedEvt;
import org.camunda.bpm.dev.debug.DebugEventListener;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.SuspendedExecution;
import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;
import org.camunda.bpm.dev.debug.impl.DebugScriptEvaluation;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.pvm.runtime.AtomicOperation;

/**
 * {@link DebugEventListener} implementation used to listen to events
 * fired by the {@link DebugSession} and dispatch them in the session's channel
 * using the {@link DebugProtocol}.
 *
 * An instance of this class is bound to a channel.
 *
 * @author Daniel Meyer
 *
 */
public class ProtocolDebugEventListener implements DebugEventListener {

  protected Channel channel;
  protected DebugProtocol protocol;

  public ProtocolDebugEventListener(DebugProtocol protocol, Channel channel) {
    this.protocol = protocol;
    this.channel = channel;
  }

  public void onExecutionSuspended(SuspendedExecution execution) {
    protocol.fireEvent(channel, new ExecutionSuspendedEvt(new SuspendedExecutionData(execution)));
  }

  public void onExecutionUpdated(SuspendedExecution execution) {
    protocol.fireEvent(channel, new ExecutionUpdatedEvt(new SuspendedExecutionData(execution)));
  }

  public void onExecutionUnsuspended(SuspendedExecution execution) {
    protocol.fireEvent(channel, new ExecutionUnsuspendedEvt(new SuspendedExecutionData(execution)));
  }

  public void onScriptEvaluated(DebugScriptEvaluation scriptEvaluation) {
    protocol.fireEvent(channel, new ScriptEvaluatedEvt(new ScriptEvaluationData(scriptEvaluation)));
  }

  public void onScriptEvaluationFailed(DebugScriptEvaluation scriptEvaluation) {
    protocol.fireEvent(channel, new ScriptEvaluationFailedEvt(new ScriptEvaluationData(scriptEvaluation)));
  }

  public void onException(Exception e, ExecutionEntity execution, AtomicOperation operation) {
    protocol.fireEvent(channel, new ErrorEvt(new ErrorData(e)));
  }

  public void onCodeCompletion(List<CodeCompletionHint> completionHints) {
    protocol.fireEvent(channel, new CodeCompletionEvt(CodeCompletionDto.fromList(completionHints)));

  }


}
