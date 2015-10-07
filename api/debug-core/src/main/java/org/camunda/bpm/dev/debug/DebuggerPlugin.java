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
