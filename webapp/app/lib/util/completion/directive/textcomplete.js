var $ = require('jquery');

var autocompleteTemplate =
  '<div class="autocomplete" ng-show="hints.length">' +
  '<ul><li ng-repeat="hint in hints" ng-class="{selected: $index == selectedIndex}">{{ hint.completedMethod }}: {{hint.completedType}}</li></ul>' +
  '</div>';

var directive = [ '$compile', function($compile) {
    return {
      restrict: 'A',
      priority: -100,
      scope: {
        textcomplete: '&'
      },
      link: function(scope, element, attrs) {

        var lastStatementRegex = new RegExp('([^\\s\\(\\)]*(\\([^\)]*\\))?)*$');

        var hintsElement = $compile(autocompleteTemplate)(scope).appendTo(element.parent());

        scope.$watch('selectedIndex', function() {
          if (scope.selectedIndex && scope.selectedIndex >= 0) {
            var liChildren = $(hintsElement.find('li'));

            var height = 0;
            for (i = 0; i < scope.selectedIndex; i++) {
              height += $(liChildren[i]).outerHeight();
            }
            hintsElement.children('ul').scrollTop(height);
          }
        });

        var extrapolatePartialInput = function(element) {
          var caretPos = element.get(0).selectionStart;
          var pretext = element.val().substring(0, caretPos);

          var matches = lastStatementRegex.exec(pretext);
          var partialInput = matches[0];

          return partialInput;
        }

        var replacePartialInput = function(element, replacement) {
          var caretPos = element.get(0).selectionStart;
          var pretext = element.val().substring(0, caretPos);

          var partialInput = lastStatementRegex.exec(pretext)[0];
          var partialInputBegin = pretext.length - partialInput.length - 1;

          var newVal = element.val().substring(0, partialInputBegin + 1) + replacement + element.val().substring(caretPos);
          element.val(newVal);

          // updates associated ng-model
          element.trigger('input');
        }

        var updateHints = function(partialInput) {
          scope.textcomplete({ partialInput: partialInput }).success(function(hints) {
            scope.hints = hints;
          });
        }

        var tryUpdateHints = function(partialInput) {
          if (scope.hints) {
            updateHints(partialInput);
          }
        }

        element.bind("keyup", function(event) {
          if (scope.hints) {
            tryUpdateHints(extrapolatePartialInput(element));
          }

        });

        element.bind("keydown keypress", function(event) {

          // ctrl + space
          if (event.which === 32 && event.ctrlKey) {
            event.preventDefault();

            updateHints(extrapolatePartialInput(element));
            return;
          }

          if (scope.hints) {

            // down key
            if (event.which === 40) {
              event.preventDefault();
              event.stopImmediatePropagation();

              scope.selectedIndex = (scope.selectedIndex + 1) || 0;
              if (scope.selectedIndex == scope.hints.length) {
                scope.selectedIndex = 0;
              }
            }

            // up key
            if (event.which === 38) {
              event.preventDefault();
              event.stopImmediatePropagation();

              scope.selectedIndex = (scope.selectedIndex || scope.hints.length) - 1;
              if (scope.selectedIndex < 0) {
                scope.selectedIndex = scope.hints.length - 1;
              }
            }

            // enter
            if (event.which === 13 && scope.selectedIndex < scope.hints.length) {
              event.preventDefault();
              event.stopImmediatePropagation();

              replacePartialInput(element, scope.hints[scope.selectedIndex].completedIdentifier);
            }
          }

          // enter or escape
          if (event.which === 13 || event.which === 27) {
            delete scope.hints;
            delete scope.selectedIndex;
          }

          scope.$digest();
        });
      }
    }
  } ];

module.exports = directive;