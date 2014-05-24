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

import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.engine.ProcessEngines;

/**
 * A standalone debug server
 *
 * @author Daniel Meyer
 *
 */
public class StandaloneDebugServerBootstrap {

  public static void main(String[] args) {

    // start process engine
    ProcessEngines.getDefaultProcessEngine();

    DebugSessionFactory.getInstance().setSuspend(false);

    // start debug server
    DebugServer debugServer = null;
    try {

      // configure & start the server
      debugServer = new DebugServerConfiguration()
        .port(9090)
        .startServer();

    } finally {
      if(debugServer != null) {
        debugServer.shutdown();
      }
    }

  }

}
