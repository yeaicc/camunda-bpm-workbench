package org.camunda.bpm.debugger.server.protocol.dto;

import java.util.ArrayList;
import java.util.List;

import org.camunda.bpm.dev.debug.completion.CodeCompletionHint;

public class CodeCompletionDto {

  protected String completedIdentifier;
  protected String completedType;
  protected String completedMethod;

  public String getCompletedIdentifier() {
    return completedIdentifier;
  }

  public void setCompletedIdentifier(String completedIdentifier) {
    this.completedIdentifier = completedIdentifier;
  }

  public String getCompletedType() {
    return completedType;
  }

  public void setCompletedType(String completedType) {
    this.completedType = completedType;
  }

  public String getCompletedMethod() {
    return completedMethod;
  }

  public void setCompletedMethod(String completedMethod) {
    this.completedMethod = completedMethod;
  }

  public static List<CodeCompletionDto> fromList(List<CodeCompletionHint> hints) {
    List<CodeCompletionDto> completionDtos = new ArrayList<CodeCompletionDto>();

    for (CodeCompletionHint hint : hints) {
      CodeCompletionDto dto = new CodeCompletionDto();
      dto.completedIdentifier = hint.getCompletedIdentifier();
      dto.completedType = hint.getCompletedType();
      dto.completedMethod = hint.getCompletedMethod();
      completionDtos.add(dto);
    }

    return completionDtos;
  }

}
