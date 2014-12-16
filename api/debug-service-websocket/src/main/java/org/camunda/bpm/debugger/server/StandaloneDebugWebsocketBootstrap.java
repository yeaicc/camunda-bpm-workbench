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
package org.camunda.bpm.debugger.server;

import java.util.List;

import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.dev.debug.DebuggerPlugin;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.connect.plugin.impl.ConnectProcessEnginePlugin;
import org.camunda.spin.plugin.impl.SpinProcessEnginePlugin;

/**
 * A standalone debug server
 *
 * @author Daniel Meyer
 *
 */
public class StandaloneDebugWebsocketBootstrap {

  public static void main(String[] args) {

    // start process engine
    StandaloneInMemProcessEngineConfiguration processEngineConfiguration = new StandaloneInMemProcessEngineConfiguration();
    processEngineConfiguration.setProcessEngineName(ProcessEngines.NAME_DEFAULT);

    // add plugins
    List<ProcessEnginePlugin> processEnginePlugins = processEngineConfiguration.getProcessEnginePlugins();
    processEnginePlugins.add(new DebuggerPlugin());
    processEnginePlugins.add(new SpinProcessEnginePlugin());
    processEnginePlugins.add(new ConnectProcessEnginePlugin());

    processEngineConfiguration.buildProcessEngine();

    DebugSessionFactory.getInstance().setSuspend(false);

    // start debug server
    DebugWebsocket debugWebsocket = null;
    try {

      // configure & start the server
      debugWebsocket = new DebugWebsocketConfiguration()
        .port(9090)
        .startServer();

      // block
      debugWebsocket.waitForShutdown();

    } finally {
      if(debugWebsocket != null) {
        debugWebsocket.shutdown();
      }
    }

  }

}
