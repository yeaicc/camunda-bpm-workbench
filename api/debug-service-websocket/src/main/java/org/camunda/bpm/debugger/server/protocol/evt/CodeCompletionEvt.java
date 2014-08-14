package org.camunda.bpm.debugger.server.protocol.evt;

import java.util.List;

import org.camunda.bpm.debugger.server.protocol.dto.CodeCompletionDto;

public class CodeCompletionEvt extends EventDto<List<CodeCompletionDto>> {

  public static final String NAME = "code-completion-hints";

  public CodeCompletionEvt(List<CodeCompletionDto> data) {
    super(NAME, data);
  }

}
