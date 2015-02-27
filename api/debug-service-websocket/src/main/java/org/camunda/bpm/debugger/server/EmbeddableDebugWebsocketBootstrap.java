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

import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.debugger.server.netty.staticresource.ClasspathResourceServer;
import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.dev.debug.DebuggerPlugin;
import org.camunda.bpm.engine.ProcessEngine;

/**
 * @author Daniel Meyer
 *
 */
public class EmbeddableDebugWebsocketBootstrap extends DebuggerPlugin {

  public final static Logger LOG = Logger.getLogger(EmbeddableDebugWebsocketBootstrap.class.getName());

  protected int httpPort = 8090;

  public void postProcessEngineBuild(ProcessEngine processEngine) {
    super.postProcessEngineBuild(processEngine);

    configureDebugSession();

    DebugWebsocket debugWebsocket = null;
    ClasspathResourceServer classpathResourceServer = null;
    try {
      debugWebsocket = startWebsocket();

      LOG.info("Starting Camunda Workbench on port " + httpPort);

      classpathResourceServer = new ClasspathResourceServer(httpPort);
      classpathResourceServer.run().sync().channel().closeFuture();

    } catch (Exception e) {
      throw new RuntimeException(e);

    } finally {
      if (classpathResourceServer != null) {
        closeResourceServer(classpathResourceServer);
      }
      if (debugWebsocket != null) {
        closeDebugWebsocket(debugWebsocket);
      }
    }

  }

  public static DebugWebsocket startWebsocket() {
    // configure & start the server
    return new DebugWebsocketConfiguration()
      .port(9090)
      .startServer();
  }

  public static void configureDebugSession() {
    DebugSessionFactory.getInstance().setSuspend(false);
  }

  public static void closeResourceServer(ClasspathResourceServer classpathResourceServer) {
    try {
      classpathResourceServer.shutdown();
    }
    catch(Exception e) {
      LOG.log(Level.SEVERE, "Exception while closing resource server websocket ", e);
    }
  }

  public static void closeDebugWebsocket(DebugWebsocket debugWebsocket) {
    try {
      debugWebsocket.shutdown();
    }
    catch(Exception e) {
      LOG.log(Level.SEVERE, "Exception while closing debug websocket ", e);
    }
  }

  public int getHttpPort() {
    return httpPort;
  }

  public void setHttpPort(int httpPort) {
    this.httpPort = httpPort;
  }


}
