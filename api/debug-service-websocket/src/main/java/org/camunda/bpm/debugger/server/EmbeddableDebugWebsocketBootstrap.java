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

    new Thread() {

      public synchronized void start() {
        setDaemon(true);
        super.start();
      }

      public void run() {


        DebugWebsocket debugWebsocket = null;
        ClasspathResourceServer classpathResourceServer = null;
        try {
          debugWebsocket = startWebsocket();

          LOG.info("Starting Camunda Workbench on port " + httpPort);

          classpathResourceServer = new ClasspathResourceServer(httpPort);
          classpathResourceServer.run().sync().channel().closeFuture().sync();

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
    }.start();

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
