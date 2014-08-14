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
package org.camunda.bpm.debugger.server.protocol.cmd;

import org.camunda.bpm.debugger.server.protocol.dto.GetScriptData;
import org.camunda.bpm.debugger.server.protocol.dto.UpdateScriptData;
import org.camunda.bpm.debugger.server.protocol.evt.ScriptUpdatedEvt;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.Script;

/**
 * @author Daniel Meyer
 *
 */
public class UpdateScriptCmd extends DebugCommand<UpdateScriptData> {

  public final static String NAME = "update-script";

  public void execute(DebugCommandContext ctx) {
    final DebugSession debugSession = ctx.getDebugSession();

    Script newScript = new Script();
    newScript.setScript(data.getScript());
    newScript.setScriptingLanguage(data.getLanguage());

    debugSession.updateScript(data.getProcessDefinitionId(), data.getActivityId(), newScript);

    GetScriptData eventPayload = new GetScriptData();
    eventPayload.setActivityId(data.getActivityId());
    eventPayload.setProcessDefinitionId(data.getProcessDefinitionId());
    ctx.fireEvent(new ScriptUpdatedEvt(eventPayload));

  }

}
