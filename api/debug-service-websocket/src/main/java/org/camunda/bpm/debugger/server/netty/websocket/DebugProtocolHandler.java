package org.camunda.bpm.debugger.server.netty.websocket;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

import org.camunda.bpm.debugger.server.DebugWebsocketConfiguration;

/**
 * This handler is responsible for executing incoming commands over the protocol
 *
 * @author Daniel Meyer
 *
 */
public class DebugProtocolHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

  protected DebugWebsocketConfiguration debugWebsocketConfiguration;

  /**
   * @param debugWebsocketConfiguration
   */
  public DebugProtocolHandler(DebugWebsocketConfiguration debugWebsocketConfiguration) {
    this.debugWebsocketConfiguration = debugWebsocketConfiguration;
  }

  protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {

    debugWebsocketConfiguration
      .getProtocol()
      .executeCommand(ctx.channel(), msg.text());

  }

  @Override
  public void channelInactive(ChannelHandlerContext ctx) throws Exception {

    // open the session
    debugWebsocketConfiguration
      .getProtocol()
      .closeSession(ctx);

    super.channelInactive(ctx);
  }

  @Override
  public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
    if(evt == WebSocketServerProtocolHandler.ServerHandshakeStateEvent.HANDSHAKE_COMPLETE) {
      // open the session
      debugWebsocketConfiguration
        .getProtocol()
        .openSession(ctx);
    }
    super.userEventTriggered(ctx, evt);
  }
}
