# camunda BPM Developer

camunda BPM developer is a web-application allowing you to implement BPMN processes using an app directly inside a web browser.
The app provides the following features:

### BPMN Diagram Renderer

The BPMN renderer embeds [bpmn.io][bpmnio] rendering BPMN 2.0 Xml files directly inside the browser.
You can simply drop a BPMN file from your desktop and have it rendered inside the Browser.

### Script Editor

The Script editor allows editing the scripts associated with BPMN Script Tasks. It embedds the well-known [Ace][ace] editor for comfortable script editing.

### Debugger

The Debugger connects to a camunda BPM runtime using a Websocket. Put breakpoints directly inside the process diagram, 
inspect the current state of the process variables and interact with a process instance through an interactive scripting console.

## Install and run

- clone the git repository   
  `git clone git@github.com:camunda/camunda-bpm-developer.git`
- link the camunda-simple-grid for npm    
  `cd camunda-bpm-developer/frontend/util/simple-grid && npm link`
- link simple-grid for the app   
  `cd ../../app && npm link camunda-simple-grid`
- install with npm   
  `npm install`
- go to the backend folder and build using mvn   
  `cd ../../backend && mvn clean install && cd debugger-server mvn exec:java`   
  (this will start a server on port 9090 - which has to be, obviously, free)
- run grunt from the app directory   
  `cd ../../frontend/app && grunt auto-build`



[ace]: http://ace.c9.io
[bpmnio]: http://bpmn.io
