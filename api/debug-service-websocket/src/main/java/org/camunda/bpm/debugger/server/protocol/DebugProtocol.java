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
package org.camunda.bpm.debugger.server.protocol;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.camunda.bpm.debugger.server.DebugWebsocketConfiguration;
import org.camunda.bpm.debugger.server.netty.websocket.ChannelAttributes;
import org.camunda.bpm.debugger.server.protocol.cmd.DebugCommand;
import org.camunda.bpm.debugger.server.protocol.cmd.DebugCommandContext;
import org.camunda.bpm.debugger.server.protocol.dto.ErrorData;
import org.camunda.bpm.debugger.server.protocol.evt.ErrorEvt;
import org.camunda.bpm.debugger.server.protocol.evt.EventDto;
import org.camunda.bpm.dev.debug.DebugSession;
import org.camunda.bpm.dev.debug.DebugSessionFactory;

/**
 * @author Daniel Meyer
 *
 */
public class DebugProtocol {

  protected static Pattern commandNameMatcher = Pattern.compile(".*\"command\"\\s*:\\s*\"([\\w|-]*)\".*");

  protected static Logger LOGG = Logger.getLogger(DebugWebsocketConfiguration.class.getName());

  protected DebugWebsocketConfiguration debugWebsocketConfiguration;

  /**
   * The set of registered command handlers to be used for executing commands.
   */
  protected Map<String, Class<? extends DebugCommand<?>>> commandHandlers = new HashMap<String, Class<? extends DebugCommand<?>>>();

  /**
   * @param debugWebsocketConfiguration
   */
  public DebugProtocol(DebugWebsocketConfiguration debugWebsocketConfiguration) {
    this.debugWebsocketConfiguration = debugWebsocketConfiguration;
  }

  /**
   * Register a command handler
   * @param cmdName the name of the command
   */
  public void registerCommandHandler(String cmdName, Class<? extends DebugCommand<?>> handler) {
    this.commandHandlers.put(cmdName, handler);
  }

  /**
   * @param commandPayload
   */
  public void executeCommand(Channel ch, String commandPayload) {

    try {
      Matcher matcher = commandNameMatcher.matcher(commandPayload);
      if(!matcher.matches()) {
        LOGG.warning("Command has improper format. No command name found.");
        return;
      }

      // get handler
      String commandName = matcher.group(1);
      Class<? extends DebugCommand<?>> commandHandler = commandHandlers.get(commandName);
      if(commandHandler != null) {
        // unmarshall protocol POJO:
        DebugCommand<?> commandDto = debugWebsocketConfiguration
          .getMarshaller()
          .unmarshal(commandPayload, commandHandler);

        commandDto.execute(new DebugCommandContext(ch, this));

      } else {
        LOGG.warning("Unrecognized command '"+commandName+"'.");
        return;
      }

    } catch (Exception e) {
      fireEvent(ch, new ErrorEvt(new ErrorData(e)));
      LOGG.log(Level.WARNING, "Error while processing payload "+commandPayload, e);
    }
  }

  public void fireEvent(Channel channel, EventDto<?> event) {

    try {
      String marshalledEvent = debugWebsocketConfiguration.getMarshaller()
        .marshal(event);

      channel.writeAndFlush(new TextWebSocketFrame(marshalledEvent));

    } catch (Exception e) {
      LOGG.log(Level.WARNING, "Error while marshaling event payload ", e);
    }

  }

  /**
   * Closes the debug session in the provided channel
   *
   * @param ctx channel context
   */
  public void closeSession(ChannelHandlerContext ctx) {
    DebugSession debugSession = ChannelAttributes.getDebugSession(ctx.channel());
    if(debugSession != null) {
      debugSession.close();
    }
  }

  /**
   * Opens a debug session in the provided channel
   *
   * @param ctx channel context
   */
  public void openSession(ChannelHandlerContext ctx) {

    final DebugSessionFactory debugSessionFactory = DebugSessionFactory.getInstance();
    DebugSession session = debugSessionFactory.openSession();

    ProtocolDebugEventListener protocolDebugEventListener = new ProtocolDebugEventListener(this, ctx.channel());
    session.registerEventListener(protocolDebugEventListener);

    ChannelAttributes.setDebugEventListener(ctx.channel(), protocolDebugEventListener);
    ChannelAttributes.setDebugSession(ctx.channel(), session);
  }

}
