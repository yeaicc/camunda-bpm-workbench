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

import org.camunda.bpm.dev.debug.impl.DebugCommandContextFactory;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;

/**
 * @author Daniel Meyer
 *
 */
public class DebuggerPlugin extends AbstractProcessEnginePlugin {

  @Override
  public void preInit(ProcessEngineConfigurationImpl processEngineConfiguration) {
    DebugCommandContextFactory commandContextFactory = new DebugCommandContextFactory();
    commandContextFactory.setProcessEngineConfiguration(processEngineConfiguration);
    processEngineConfiguration.setCommandContextFactory(commandContextFactory);
    processEngineConfiguration.setEnableScriptCompilation(false);
  }

  public void postProcessEngineBuild(ProcessEngine processEngine) {
    DebugSessionFactory debugSessionFactory = DebugSessionFactory.getInstance();
    debugSessionFactory.setProcessEngine(processEngine);
  }

}
