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

'use strict';


function getCursorPosition(el) {
  el = el[0];
  var pos = 0;
  if('selectionStart' in el) {
    pos = el.selectionStart;
  } else if('selection' in document) {
    el.focus();
    var Sel = document.selection.createRange();
    var SelLength = document.selection.createRange().text.length;
    Sel.moveStart('character', -el.value.length);
    pos = Sel.text.length - SelLength;
  }
  return pos;
}

function setCursorPosition(el, selectionStart, selectionEnd) {
  el = el[0];
  if(!selectionEnd) {
    selectionEnd = selectionStart;
  }
  if (el.setSelectionRange) {
    el.focus();
    el.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (el.createTextRange) {
    var range = el.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

var directive = function() {
  return function(scope, element, attrs) {

    var rows = 1;

    function setRows(rows) {
      var cpos = getCursorPosition(element);
      var textContent = element.val();
      textContent = [textContent.slice(0, cpos), "\n", textContent.slice(cpos)].join('');
      element.val(textContent);
      setCursorPosition(element, cpos+1);
      element.attr("rows", rows);
    }

    function reset() {
      rows = 1;
      element.val("");
      setRows(rows);
    }

    reset();

    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        if(!event.shiftKey) {

          scope.$apply(function(){
            scope.$eval(attrs.ngEnter, {'event': event});
            reset();
          });


        } else {
          rows++;
          setRows(rows);
        }

        event.preventDefault();
      }
    });
  };
};

module.exports = directive;
