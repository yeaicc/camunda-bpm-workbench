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

import org.camunda.bpm.debugger.server.netty.AbstractNettyServer;
import org.camunda.bpm.debugger.server.netty.websocket.WebsocketServer;
import org.camunda.bpm.debugger.server.protocol.DebugProtocol;
import org.camunda.bpm.debugger.server.protocol.Marshaller;
import org.camunda.bpm.debugger.server.protocol.cmd.CodeCompletionCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.DeployProcessCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.EvaluateScriptCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.GetProcessDefinitionXmlCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.GetScriptCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.ListProcessesDefinitionsCommand;
import org.camunda.bpm.debugger.server.protocol.cmd.ResumeExecutionCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.SetBreakPointsCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.StartProcessCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.StepExecutionCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.UpdateScriptCmd;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Configuration and factory for a {@link DebugWebsocket}.
 *
 * @author Daniel Meyer
 *
 */
public class DebugWebsocketConfiguration {

  /**
   * The netty server to use.
   */
  protected AbstractNettyServer nettyServer;

  /**
   * The protocol instance to use
   */
  protected DebugProtocol protocol;

  /**
   * The port to use for the server. Default is 9090.
   */
  protected int port = 9090;

  /**
   * The jackson object mapper to use
   * */
  protected ObjectMapper objectMapper;

  /**
   * The marshaller used to marshal pojo objects
   */
  protected Marshaller marshaller;

  // factory /////////////////////////////////////

  public DebugWebsocket startServer() {
    init();
    return new DebugWebsocket(this);
  }

  protected void init() {
    initOjectMapper();
    initMarshaller();
    initProtocol();
    initNettyServer();
  }

  protected void initMarshaller() {
    if(marshaller == null) {
      marshaller = new Marshaller();
    }
    marshaller.setConfiguration(this);
  }

  protected void initOjectMapper() {
    if(objectMapper == null) {
      objectMapper = new ObjectMapper();
    }
  }

  protected void initProtocol() {
    if(protocol == null) {
      protocol = new DebugProtocol(this);

      // configure the protocol with the default handlers
      protocol.registerCommandHandler(SetBreakPointsCmd.NAME, SetBreakPointsCmd.class);
      protocol.registerCommandHandler(DeployProcessCmd.NAME, DeployProcessCmd.class);
      protocol.registerCommandHandler(StartProcessCmd.NAME, StartProcessCmd.class);
      protocol.registerCommandHandler(EvaluateScriptCmd.NAME, EvaluateScriptCmd.class);
      protocol.registerCommandHandler(ResumeExecutionCmd.NAME, ResumeExecutionCmd.class);
      protocol.registerCommandHandler(ListProcessesDefinitionsCommand.NAME, ListProcessesDefinitionsCommand.class);
      protocol.registerCommandHandler(GetProcessDefinitionXmlCmd.NAME, GetProcessDefinitionXmlCmd.class);
      protocol.registerCommandHandler(CodeCompletionCmd.NAME, CodeCompletionCmd.class);
      protocol.registerCommandHandler(GetScriptCmd.NAME, GetScriptCmd.class);
      protocol.registerCommandHandler(UpdateScriptCmd.NAME, UpdateScriptCmd.class);
      protocol.registerCommandHandler(StepExecutionCmd.NAME, StepExecutionCmd.class);

    }
  }

  protected void initNettyServer() {
    if(nettyServer == null) {
      nettyServer = new WebsocketServer(port, this);
    }
  }

  // fluent builder //////////////////////////////

  public DebugWebsocketConfiguration protocol(DebugProtocol protocol) {
    this.protocol = protocol;
    return this;
  }

  public DebugWebsocketConfiguration nettyServer(AbstractNettyServer nettyServer) {
    this.nettyServer = nettyServer;
    return this;
  }

  public DebugWebsocketConfiguration port(int port) {
    this.port = port;
    return this;
  }

  public DebugWebsocketConfiguration port(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    return this;
  }

  public DebugWebsocketConfiguration marshaller(Marshaller marshaller) {
    this.marshaller = marshaller;
    return this;
  }

  // getters / setters ///////////////////////////

  public AbstractNettyServer getNettyServer() {
    return nettyServer;
  }

  public DebugProtocol getProtocol() {
    return protocol;
  }

  public void setNettyServer(AbstractNettyServer nettyServer) {
    this.nettyServer = nettyServer;
  }

  public void setProtocol(DebugProtocol protocol) {
    this.protocol = protocol;
  }

  public int getPort() {
    return port;
  }

  public void setPort(int port) {
    this.port = port;
  }

  public ObjectMapper getObjectMapper() {
    return objectMapper;
  }

  public void setObjectMapper(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public Marshaller getMarshaller() {
    return marshaller;
  }

  public void setMarshaller(Marshaller marshaller) {
    this.marshaller = marshaller;
  }

}
