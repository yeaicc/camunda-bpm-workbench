package org.camunda.bpm.debugger.server.protocol.dto;

public class ScriptData {

  protected String language;
  protected String script;

  public String getLanguage() {
    return language;
  }
  public void setLanguage(String language) {
    this.language = language;
  }
  public String getScript() {
    return script;
  }
  public void setScript(String script) {
    this.script = script;
  }
}
