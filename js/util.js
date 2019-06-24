'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var isEsc = function (evt, action) {
    evt.keyCode === ESC_KEYCODE && action();
  };

  var isEnter = function (evt, action) {
    evt.keyCode === ENTER_KEYCODE && action();
  };

  window.util = {
    isEscEvent: isEsc,
    isEnterEvent: isEnter
  };
})();