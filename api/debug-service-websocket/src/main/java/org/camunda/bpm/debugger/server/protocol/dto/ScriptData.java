package org.camunda.bpm.debugger.server.protocol.dto;

import org.camunda.bpm.dev.debug.Script;

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

  public static ScriptData fromScript(Script script) {
    ScriptData dto = new ScriptData();

    dto.setScript(script.getScript());
    dto.setLanguage(script.getScriptingLanguage());
    return dto;
  }
}
