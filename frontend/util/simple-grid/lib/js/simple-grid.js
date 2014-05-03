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

var $ = require('jquery');
var _window = window;

var sg = (function($, _window) {

  /**
   * column resize handler listener
   */
  $( ".sg-col-handle" )
    .mousedown(function() {

      var _handle = $(this);
      var _handle_size = 0;
      var _parent = _handle.parent();

      // the column left of the handle
      var _leftCol = $( _handle.prev()[0] );

      // the column right of the handle
      var _rightCol = $( _handle.next()[0] );

      // the total width of both columns in pixel
      var _available_width = _leftCol.width() + _rightCol.width() + _handle_size;
      var _scale = _parent.width() / 100;

      // the total width of both columns as a percentage of the parent 
      // container's total width
      var _available_width_percent = _available_width / _scale;

      // the x_position of the left column relative to the page
      var _x_offset = _parent.offset().left + _leftCol.offset().left;

      function resize(_evt) {
        var _localPos = _evt.pageX - _x_offset;

        // make sure we do not leave the available space for these columns
        if(_localPos > 0 && _localPos < _available_width) {
          // calculate  percentage:
          var _divide_percent = (_available_width - _localPos) / _scale;
          _rightCol.css("width", _divide_percent +"%");
          _leftCol.css("width", (_available_width_percent-_divide_percent) +"%");
        }
        _evt.preventDefault();
      }

      $(_window).on("mousemove", resize);

      $(_window).on("mouseup", function() {
        $(_window).off("mousemove", resize);
      });

    });

  /**
   * row resize handle listener 
   */
  $( ".sg-row-handle" )
    .mousedown(function() {

      var _handle = $(this);
      var _handle_size = 0;
      var _parent = _handle.parent();

      // the row top of the handle
      var _rowAbove = $( _handle.prev()[0] );

      // the row below the handle
      var _rowBelow = $( _handle.next()[0] );

      // the total height of both rows in pixel
      var _available_height = _rowAbove.height() + _rowBelow.height() + _handle_size;
      var _scale = _parent.height() / 100;

      // the total height of both columns as a percentage of the parent 
      // container's total height
      var _available_height_percent = _available_height / _scale;

      // the y_position of the top row relative to the page
      var _y_offset = _rowAbove.offset().top;

      function resize(_evt) {
        var _localPos = _evt.pageY - _y_offset;

        // make sure we do not leave the available space for these columns
        if(_localPos > 0 && _localPos < _available_height) {
          // calculate  percentage:
          var _divide_percent = (_available_height - _localPos) / _scale;
          _rowBelow.css("height", _divide_percent +"%");
          _rowAbove.css("height", (_available_height_percent-_divide_percent) +"%");
        }
        _evt.preventDefault();
      }

      $(_window).on("mousemove", resize);

      $(_window).on("mouseup", function() {
        $(_window).off("mousemove", resize);
      });

  });

  /** 
   * returns true if _parent is a parent of _comp */
  function isParent(_parent, _comp) {
    return $(_comp).parents().toArray().indexOf(_parent) != -1;
  }

  /**
   * toggles maximize of an element inside the provided scope
   */
  function toggleMaximize(_activeComp, _scope, _markerClass) {

    // find all components inside the scope
    var _gridComponents = $('.sg-col,.sg-col-handle,.sg-row,.sg-row-handle', _scope);

    var _mode = $(_activeComp).hasClass(_markerClass) ? 'minimize' : 'maximize';

    if(_mode === 'maximize') {
      // walk all components in the grid scope
      for(var i = 0; i < _gridComponents.length; i++) {

        var _comp = _gridComponents[i];

        //check whether this is the active component or a parent of the active component
        if(_comp == _activeComp || isParent(_comp, _activeComp)) {

          // store original width & height in element's dataset
          _comp.dataset.sgOrigWidth = $(_comp).css("width");
          _comp.dataset.sgOrigHeight = $(_comp).css("height");

        }
      }
    }

    // walk all components in the grid scope
    for(var i = 0; i < _gridComponents.length; i++) {

      var _comp = _gridComponents[i];

      //check whether this is the active component or a parent of the active component
      if(_comp == _activeComp || isParent(_comp, _activeComp)) {

        if(_mode === 'maximize') {

          // maximize
          $(_comp).css("width", "100%");
          $(_comp).css("height", "100%");

        } else {

          // reset width / height
          $(_comp).css("width", _comp.dataset.sgOrigWidth);
          $(_comp).css("height", _comp.dataset.sgOrigHeight);

        }

      } else {
        var _display = _mode === 'maximize' ? 'none' : 'block';

        $(_comp).css("display", _display);
      }
    }

    // set class:
    $(_activeComp).toggleClass(_markerClass);

  }


  /** toggle fullscreen handler */
  $( ".sg-toggle-fullscreen" )
    .click(function(_evt) {

    // find the current component (row / col)
    var _activeComp = $(this).closest('.sg-col,.sg-row')[0];

    // find grid parent
    var _grid = $(this).parents('.sg-grid');

    // toggle maximize
    toggleMaximize(_activeComp, _grid, 'sg-fullscreen');

    _evt.preventDefault();
  });

})($, _window);

module.exports = sg;

