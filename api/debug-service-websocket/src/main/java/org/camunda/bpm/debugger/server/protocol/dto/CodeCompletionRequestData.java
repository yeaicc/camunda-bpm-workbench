package org.camunda.bpm.debugger.server.protocol.dto;

public class CodeCompletionRequestData {

  protected String prefix;

  public String getPrefix() {
    return prefix;
  }

  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }
}
