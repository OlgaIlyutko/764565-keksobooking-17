'use strict';

(function () {
  var POINTS_COUNT = 8;
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinMain = map.querySelector('.map__pin--main');
  var addressField = adForm.querySelector('#address');
  var flagActivation = false;
  var AREA_MAP = {
    TOP_Y: 130,
    BOTTOM_Y: 630
  };



  var pointView = function (pointTempl) {
    var pointTemplClone = pointsTempl.cloneNode(true);
    pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
    pointTemplClone.querySelector('img').src = pointTempl.author.avatar;
    return pointTemplClone;
  };

  var fragment = document.createDocumentFragment();

  var pinsPlace = function () {
    for (var j = 0; j < POINTS_COUNT; j++) {
      fragment.appendChild(pointView(window.data[j]));
    }
    var mapElemet = document.querySelector('.map__pins');
    mapElemet.appendChild(fragment);
  };

  var adFormFieldsetList = adForm.querySelectorAll('fieldset');
  for (var k = 0; k < adFormFieldsetList.length; k++) {
    adFormFieldsetList[k].disabled = true;
  }

  var cardActivation = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var l = 0; l < adFormFieldsetList.length; l++) {
      adFormFieldsetList[l].disabled = false;
    }
    pinsPlace();
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
      top: AREA_MAP.TOP_Y - pinMain.offsetHeight,
      bottom: AREA_MAP.BOTTOM_Y - pinMain.offsetHeight,
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
        cardActivation();
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
