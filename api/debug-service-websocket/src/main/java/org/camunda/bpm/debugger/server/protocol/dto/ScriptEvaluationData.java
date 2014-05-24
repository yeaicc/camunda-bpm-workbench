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
package org.camunda.bpm.debugger.server.protocol.dto;

import org.camunda.bpm.dev.debug.impl.DebugScriptEvaluation;

/**
 * @author Daniel Meyer
 *
 */
public class ScriptEvaluationData {

  protected String result;
  protected String cmdId;

  public ScriptEvaluationData(DebugScriptEvaluation evaluation) {
    this.cmdId = evaluation.getCmdId();
    if(evaluation.getResult() == null) {
      if(evaluation.getScriptException() != null) {
        this.result = evaluation.getScriptException().getMessage();
      } else {
        this.result = "undefined";
      }
    } else {
      this.result = evaluation.getResult().toString();
    }
  }

  public String getResult() {
    return result;
  }

  public String getCmdId() {
    return cmdId;
  }

}
