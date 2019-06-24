'use strict';

(function () {
  var POINTS_COUNT = 8;
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinMain = map.querySelector('.map__pin--main');
  var addressField = adForm.querySelector('#address');
  var flagActivation = false;
  var COEFFICIENT_SHADOW_PIN = 2;
  var pinMainSizes = {
    WIDTH: pinMain.offsetWidth - COEFFICIENT_SHADOW_PIN * 2,
    HEIGHT: pinMain.offsetHeight - COEFFICIENT_SHADOW_PIN 
  };
  var AREA_MAP = {
    TOP_Y: 130,
    BOTTOM_Y: 630
  };
  var limits = {
    top: AREA_MAP.TOP_Y - pinMainSizes.HEIGHT,
    bottom: AREA_MAP.BOTTOM_Y - pinMainSizes.HEIGHT,
    left: - pinMain.offsetWidth / 2,
    right: map.offsetWidth - (pinMain.offsetWidth / 2)
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

   var pinMainCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };
  
  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var newCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var delta = {
        x: startCoords.x - newCoords.x,
        y: startCoords.y - newCoords.y
      };

      startCoords = {
        x: newCoords.x,
        y: newCoords.y
      };
      
      pinMainCoords = {
          x: pinMain.offsetLeft - delta.x,
          y: pinMain.offsetTop - delta.y
        };
      

      (pinMainCoords.x > limits.right) && (pinMainCoords.x = limits.right);
      (pinMainCoords.y > limits.bottom) && (pinMainCoords.y = limits.bottom);
      (pinMainCoords.x < limits.left) && (pinMainCoords.x = limits.left);
      (pinMainCoords.y < limits.top) && (pinMainCoords.y = limits.top);
       
      pinMain.style.left = pinMainCoords.x + 'px';
      pinMain.style.top = pinMainCoords.y + 'px';
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
      var addressFieldTop = pxDelete(pinMain.style.top) + pinMainSizes.HEIGHT;
      addressField.value = addressFieldLeft + ', ' + addressFieldTop;
    });
  });
})();
