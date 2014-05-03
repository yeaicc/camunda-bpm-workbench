
angular
.module('app')
.factory('BreakpointService', [
  'DebugSession',
function(
  DebugSession
) {
    
    var BEFORE_ACTIVITY = 'BEFORE_ACTIVITY';
    var AFTER_ACTIVITY = 'AFTER_ACTIVITY';
    var AT_TRANSITION = 'AT_TRANSITION';
   
    var Breakpoint = (function() {

      /**
       * @class
       * @classdesc A breakpoint
       *
       * @param {string} elementId The id of the element.
       * @param {string} processDefinitionId The id of the process definition
       * @param {string} type The type of the breakpoint.
       */
      function Breakpoint(elementId, processDefinitionId, type) {
        this.elementId = elementId;
        this.processDefinitionId = processDefinitionId;
        this.type = type;
      }
      
      /**
       * @returns {string} a human presentable string representation 
       * of this breakpoint
       */
      Breakpoint.prototype.toString = function() {
        return this.type + ' ' + this.elementId;
      };

      /**
       * @returns {Object} the dto representation of this breakpoint
       */
      Breakpoint.prototype.asDto = function() {
        return {
          "elementId" : this.elementId,
          "processDefinitionId" : this.processDefinitionId,
          "type": this.type
        };
      };

      return Breakpoint;

    })();
    
    var BreakpointService = (function() {

      /**
       * @classdesc The breakpoint service allows managing 
       * breakpoints.
       */ 
      function BreakpointService() {
        
        /** @private The list of breakpoints. */
        this.breakpoints = [];

      }

      /**
       * toggles a breakpoint
       *
       * @param {string} elementId The id of the element
       * @param {string} type The type of the breakpoint
       */
      BreakpointService.prototype.toggleBreakpoint = function(elementId,processDefinitionId, type) {
        var removeIdx = -1;
        for(var i=0; i < this.breakpoints.length; i++) {
          var bp = this.breakpoints[i];
          if(bp.elementId === elementId && bp.type === type) {
            removeIdx = i;
          }
        }

        if(removeIdx >= 0) {
          // remove existing breakpoint
          this.breakpoints.splice(removeIdx, 1);

        } else {
          // add new breakpoint
          this.breakpoints.push(new Breakpoint(elementId, processDefinitionId, type));

        }

        // refresh breakpoints in debug session 
        var breakpointDtos = [];
        angular.forEach(this.breakpoints, function(bp) {
          breakpointDtos.push(bp.asDto());
        });
        DebugSession.setBreakpoints(breakpointDtos);
      }; 

      /**
       * toggles a breakpoint before an element
       *
       * @param {string} the id of the element before which we want 
       * to toggle the breakpoint.
       * @param {string} the id of the process definition
       */
      BreakpointService.prototype.toggleBreakpointBefore = function(elementId, processDefinitionId) {
        this.toggleBreakpoint(elementId, processDefinitionId, BEFORE_ACTIVITY);  
      }; 

      /**
       * @returns {Array} a list of Breakpoints
       */
      BreakpointService.prototype.getBreakpoints = function() {
        return this.breakpoints;
      };


      return BreakpointService;
    
    })();

    // return a new instance of the breakpoint service
    return new BreakpointService();

}]);
