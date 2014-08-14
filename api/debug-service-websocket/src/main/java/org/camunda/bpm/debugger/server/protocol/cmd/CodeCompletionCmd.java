package org.camunda.bpm.debugger.server.protocol.cmd;

import java.util.List;

import org.camunda.bpm.debugger.server.protocol.dto.CodeCompletionDto;
import org.camunda.bpm.debugger.server.protocol.dto.CodeCompletionRequestData;
import org.camunda.bpm.debugger.server.protocol.evt.CodeCompletionEvt;
import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;


public class CodeCompletionCmd extends DebugCommand<CodeCompletionRequestData> {

  public final static String NAME = "code-completion";

  public void execute(DebugCommandContext ctx) {
    List<CodeCompletionHint> codeCompletionHints = ctx.getDebugSession().completePartialInput(data.getPrefix(), data.getExecutionId());

    ctx.fireEvent(new CodeCompletionEvt(CodeCompletionDto.fromList(codeCompletionHints)));
  }

}
