'use strict';

(function () {

  var map = document.querySelector('.map');
  var pinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var flagActivation = false;
  var AREA_MAP = {
    topY: 130,
    bottomY: 630
  };

  var pxDelete = function (str) {
    return parseInt(str.substring(0, str.length - 2), 10);
  };

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    var limits = {
      top: AREA_MAP.topY - pinMain.offsetHeight,
      bottom: AREA_MAP.bottomY - pinMain.offsetHeight,
      left: map.offsetLeft,
      right: map.offsetLeft + map.offsetWidth - pinMain.offsetWidth
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var newCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };

      var delta = {
        x: startCoords.x - newCoords.x,
        y: startCoords.y - newCoords.y
      };

      startCoords = {
        x: newCoords.x,
        y: newCoords.y
      };

      if (moveEvt.pageY < limits.bottom && moveEvt.pageY > limits.top) {
        pinMain.style.top = (pinMain.offsetTop - delta.y) + 'px';
      }

      if (moveEvt.pageX < limits.right && moveEvt.pageX > limits.left) {
        pinMain.style.left = (pinMain.offsetLeft - delta.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!flagActivation) {
        flagActivation = true;
        window.mapActivation.activeMap();
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    document.addEventListener('mouseup', function () {
      var addressFieldLeft = pxDelete(pinMain.style.left) + Math.round(pinMain.offsetWidth / 2);
      var addressFieldTop = pxDelete(pinMain.style.top) + pinMain.offsetHeight;
      addressField.value = addressFieldLeft + ', ' + addressFieldTop;
    });
  });
})();
