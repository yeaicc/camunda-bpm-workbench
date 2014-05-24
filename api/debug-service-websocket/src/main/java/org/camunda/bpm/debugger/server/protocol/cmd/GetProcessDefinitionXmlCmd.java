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

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.debugger.server.protocol.evt.ProcessDefinitionXmlEvt;
import org.camunda.bpm.engine.impl.util.IoUtil;

/**
 * @author Daniel Meyer
 *
 */
public class GetProcessDefinitionXmlCmd extends DebugCommand<String> {

  private static Logger LOG = Logger.getLogger(GetProcessDefinitionXmlCmd.class.getName());

  public final static String NAME = "get-process-definition-xml";

  public void execute(DebugCommandContext ctx) {

    InputStream processModel = ctx.getProcessEngine()
      .getRepositoryService()
      .getProcessModel(data);

    try {
      String modelAsString = new String(IoUtil.readInputStream(processModel, "processModel"), "utf-8");
      ctx.fireEvent(new ProcessDefinitionXmlEvt(modelAsString));

    } catch (UnsupportedEncodingException e) {
      LOG.log(Level.WARNING, "What up!? No utf8??", e);

    }


  }

}
