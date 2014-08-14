package org.camunda.bpm.debugger.server.protocol.dto;

public class CodeCompletionRequestData {

  protected String prefix;
  protected String executionId;

  public String getPrefix() {
    return prefix;
  }

  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }

  public String getExecutionId() {
    return executionId;
  }

  public void setExecutionId(String executionId) {
    this.executionId = executionId;
  }
}
