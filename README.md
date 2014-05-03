# camunda BPM Developer

camunda BPM developer is a web-application allowing you to implement BPMN processes using an app directly inside a web browser.
The app has a modular architecture and may be extended through plugins.

## BPMN Diagram Renderer

The BPMN renderer embeds [bpmn.io][bpmnio] rendering BPMN 2.0 Xml files directly inside the browser.
You can simply drop a BPMN file from your desktop and have it rendered inside the Browser.

## Script Editor

The Script editor allows editing the scripts associated with BPMN Script Tasks. It embedds the well-known [Ace][ace] editor for comfortable script editing.

## Debugger

The Debugger connects to a camunda BPM runtime using a Websocket. Put breakpoints directly inside the process diagram, 
inspect the current state of the process variables and interact with a process instance through an interactive scripting console.


[ace]: http://ace.c9.io
[bpmnio]: http://bpmn.io
