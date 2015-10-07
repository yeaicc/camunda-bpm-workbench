package org.camunda.bpm.dev.debug;

/**
 * @author Stefan Hentschel.
 */
public class Script {

  protected String script;
  protected String scriptingLanguage;
  protected Object result;

  public String getScript() {
    return script;
  }

  public void setScript(String script) {
    this.script = script;
  }

  public Object getResult() {
    return result;
  }

  public void setResult(Object result) {
    this.result = result;
  }

  public String getScriptingLanguage() {
    return scriptingLanguage;
  }

  public void setScriptingLanguage(String scriptingLanguage) {
    this.scriptingLanguage = scriptingLanguage;
  }
}
