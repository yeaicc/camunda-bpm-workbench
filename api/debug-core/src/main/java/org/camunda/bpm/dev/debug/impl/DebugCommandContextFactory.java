package org.camunda.bpm.dev.debug.impl;

import org.camunda.bpm.dev.debug.DebugSessionFactory;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;
import org.camunda.bpm.engine.impl.interceptor.CommandContextFactory;

/**
 * @author Daniel Meyer
 *
 */
public class DebugCommandContextFactory extends CommandContextFactory {

  public CommandContext createCommandContext() {
    return new DebugCommandContext(processEngineConfiguration, (DebugSessionFactoryImpl) DebugSessionFactory.getInstance());
  }

}
