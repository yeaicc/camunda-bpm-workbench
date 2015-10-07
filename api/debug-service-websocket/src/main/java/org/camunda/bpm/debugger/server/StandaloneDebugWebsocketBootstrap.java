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
