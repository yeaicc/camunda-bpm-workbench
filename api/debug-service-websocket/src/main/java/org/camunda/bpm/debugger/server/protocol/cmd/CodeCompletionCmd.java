package org.camunda.bpm.debugger.server.protocol.cmd;

import org.camunda.bpm.debugger.server.protocol.dto.CodeCompletionRequestData;


public class CodeCompletionCmd extends DebugCommand<CodeCompletionRequestData> {

  public final static String NAME = "code-completion";

  public void execute(DebugCommandContext ctx) {
    ctx.getDebugSession().completePartialInput(data.getPrefix(), data.getExecutionId());
  }

}
