# The camunda Debugger Websocket Protocol

The websocket protocol is bi-directional: the client will send commands to the server and the server will send events to the client. As data representation we choose JSON (Javascript Object Notation).

## Client Commands

Client commands have the form:

```json
{
  "command" : "command-name",
  "data" : { ... }
}
```

### List of supported commands

#### set-breakpoints

Sets a list of breakpoints.

Example:

```json
{
  "command" : "set-breakpoints",
  "data" : {
    breakpoints: [
      { "elementId": "ServiceTask_1", "processDefinitionId": "someId",  "type": "BEFORE_ACTIVITY" },
      { "elementId": "SequenceFlow_4", "processDefinitionId": "someId", "type": "AT_TRANSITION" }
    ]
  }
}
```

#### start-process

Starts a new process instance.

Example:

```json
{
  "command" : "start-process",
  "data" : {
    "processDefinitionId": "someProcessDefinitionId"
  }
}
```
#### deploy-process

Deploys a process to the process engine.

Example:

```json
{
  "command" : "deploy-process",
  "data" : {
    "resourceName": "process.bpmn",
    "resourceData": ""
  }
}
```


## Server Events

Server events have the form:

```json
{
  "event": "event-name",
  "data": { ... }
}
```
