/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.camunda.bpm.dev.debug.completion;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.script.Bindings;

import org.camunda.bpm.dev.debug.DebuggerException;
import org.camunda.bpm.dev.debug.impl.DebugSessionImpl;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.scripting.ExecutableScript;

public class CodeCompleter {

  protected Set<Bindings> variableBindings;
  protected PrefixSplitter splitter;

  public CodeCompleter() {
    this.variableBindings = new HashSet<Bindings>();
    this.splitter = new DefaultPrefixSplitter();
  }

  public void addVariableBindings(Bindings bindings) {
    this.variableBindings.add(bindings);
  }

  public void setVariableBindings(Set<Bindings> bindings) {
    this.variableBindings = bindings;
  }

  public void setSplitter(PrefixSplitter splitter) {
    this.splitter = splitter;
  }

  public List<CodeCompletionHint> complete(String incompletePath) {
    List<CodeCompletionHint> hints = new ArrayList<CodeCompletionHint>();

    String objectPath = null;
    String prefix = null;
    String lastDelimiter = null;

    int lastSplit = splitter.lastSplit(incompletePath);

    if (lastSplit == -1) {
      prefix = incompletePath;
    } else {
      objectPath = incompletePath.substring(0, lastSplit);
      prefix = incompletePath.substring(lastSplit + 1);
      lastDelimiter = incompletePath.substring(lastSplit, lastSplit + 1);
    }

    if (objectPath == null) {
      hints = completeFromBindings(prefix);
    } else {
      String[] splitObjectPath = splitter.split(objectPath);
      List<Class<?>> resolvedTypes = resolveTypes(splitObjectPath);
      hints = completeForTypes(resolvedTypes, prefix, objectPath + lastDelimiter);
    }

    return hints;
  }

  protected List<CodeCompletionHint> completeForTypes(List<Class<?>> types, String prefix, String objectPath) {
    List<CodeCompletionHint> hints = new ArrayList<CodeCompletionHint>();

    for (Class<?> type : types) {
      for (Method method : type.getMethods()) {
        if (method.getName().startsWith(prefix)) {
          String[] parameters = extractParameterNames(method);

          CodeCompletionHint hint = new CodeCompletionHint();
          hint.setCompletedIdentifier(objectPath + method.getName() + splitter.generateFunctionArgs(parameters));
          hint.setCompletedType(method.getReturnType().getSimpleName());
          hints.add(hint);
        }
      }
    }

    return hints;
  }

  protected String[] extractParameterNames(Method method) {
    Class<?>[] parameters = method.getParameterTypes();
    String[] extractedNames = new String[parameters.length];

    for (int i = 0; i < parameters.length; i++) {
      extractedNames[i] = parameters[i].getSimpleName();
    }

    return extractedNames;
  }

  protected List<Class<?>> resolveTypes(String[] path) {
    if (path.length == 0) {
      return null;
    }

    List<Class<?>> currentTypes = new ArrayList<Class<?>>();
    currentTypes.add(resolveRootType(path[0]));

    for (int i = 1; i < path.length; i++) {
      String pathElement = path[i];
      String methodName = splitter.extractMethodName(pathElement);
      String[] args = splitter.extractMethodArgs(pathElement);

      List<Class<?>> referencedTypes = new ArrayList<Class<?>>();

      for (Class<?> currentType : currentTypes) {
        for (Method method : currentType.getMethods()) {
          if (method.getName().equals(methodName) && method.getParameterTypes().length == args.length) {
            referencedTypes.add(method.getReturnType());
          }
        }
      }

      currentTypes = referencedTypes;
    }

    return currentTypes;
  }

  protected Class<?> resolveRootType(String name) {
    for (Bindings bindings : variableBindings) {
      for (Map.Entry<String, Object> binding : bindings.entrySet()) {
        if (binding.getKey().equals(name)) {
          return binding.getValue().getClass();
        }
      }
    }

    throw new DebuggerException("No bound object found: " + name);
  }

  protected List<CodeCompletionHint> completeFromBindings(String prefix) {
    List<CodeCompletionHint> result = new ArrayList<CodeCompletionHint>();

    for (Bindings bindings : variableBindings) {
      for (Map.Entry<String, Object> binding : bindings.entrySet()) {
        if (binding.getKey().startsWith(prefix)) {
          CodeCompletionHint completionHint = new CodeCompletionHint();
          completionHint.setCompletedIdentifier(binding.getKey());
          completionHint.setCompletedType(binding.getValue().getClass().getSimpleName());
          result.add(completionHint);
        }
      }
    }

    return result;
  }

}
