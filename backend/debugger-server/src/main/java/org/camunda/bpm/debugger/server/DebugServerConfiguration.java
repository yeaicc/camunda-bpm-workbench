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
import org.camunda.bpm.debugger.server.netty.DefaultNettyServer;
import org.camunda.bpm.debugger.server.protocol.DebugProtocol;
import org.camunda.bpm.debugger.server.protocol.Marshaller;
import org.camunda.bpm.debugger.server.protocol.cmd.DeployProcessCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.EvaluateScriptCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.SetBreakPointsCmd;
import org.camunda.bpm.debugger.server.protocol.cmd.StartProcessCmd;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * Configuration and factory for a {@link DebugServer}.
 *
 * @author Daniel Meyer
 *
 */
public class DebugServerConfiguration {

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

  public DebugServer startServer() {
    init();
    return new DebugServer(this);
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
    }

    // configure the protocol with the default handlers
    protocol.registerCommandHandler(SetBreakPointsCmd.NAME, SetBreakPointsCmd.class);
    protocol.registerCommandHandler(DeployProcessCmd.NAME, DeployProcessCmd.class);
    protocol.registerCommandHandler(StartProcessCmd.NAME, StartProcessCmd.class);
    protocol.registerCommandHandler(EvaluateScriptCmd.NAME, EvaluateScriptCmd.class);
  }

  protected void initNettyServer() {
    if(nettyServer == null) {
      nettyServer = new DefaultNettyServer(port, this);
    }
  }

  // fluent builder //////////////////////////////

  public DebugServerConfiguration protocol(DebugProtocol protocol) {
    this.protocol = protocol;
    return this;
  }

  public DebugServerConfiguration nettyServer(AbstractNettyServer nettyServer) {
    this.nettyServer = nettyServer;
    return this;
  }

  public DebugServerConfiguration port(int port) {
    this.port = port;
    return this;
  }

  public DebugServerConfiguration port(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    return this;
  }

  public DebugServerConfiguration marshaller(Marshaller marshaller) {
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
