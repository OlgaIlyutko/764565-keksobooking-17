'use strict';

(function () {
  
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var errorsTempl = document.querySelector('#error').content.querySelector('.error');
  var pinMain = map.querySelector('.map__pin--main');
  var mapElement = document.querySelector('.map__pins');
  var addressField = adForm.querySelector('#address');
  var flagActivation = false;
  var INDICATOR_PIN_HEIGHT = 20;
  var pinMainSizes = {
    WIDTH: pinMain.offsetWidth,
    HEIGHT: pinMain.offsetHeight + INDICATOR_PIN_HEIGHT
  };
  var AreaMap = {
    TOP_Y: 130,
    BOTTOM_Y: 630
  };
  var limits = {
    top: AreaMap.TOP_Y - pinMainSizes.HEIGHT,
    bottom: AreaMap.BOTTOM_Y - pinMainSizes.HEIGHT,
    left: - pinMain.offsetWidth / 2,
    right: map.offsetWidth - (pinMain.offsetWidth / 2)
  };
  var pinsLoaded = false;
  window.allPins = [];
  
  
  var adFormFieldsetList = adForm.querySelectorAll('fieldset');
  for (var k = 0; k < adFormFieldsetList.length; k++) {
    adFormFieldsetList[k].disabled = true;
  }

  
  var pointView = function (pointTempl) {
    var pointTemplClone = pointsTempl.cloneNode(true);
    pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
    pointTemplClone.querySelector('img').src = pointTempl.author.avatar;
    return pointTemplClone;
  };
  
  var onLoadPins = function (data, count) {
    var mapPins = mapElement.querySelectorAll("[class=map__pin]");
    mapPins.forEach(function(mapPin) {
      mapPin.remove();
    })
    var takeNumber = data.length > count ? count : data.length;
    for (var j = 0; j < takeNumber; j++) {
      mapElement.appendChild(pointView(data[j]));
    }
    if (flagActivation && !pinsLoaded) {
      pinsLoaded = true;
      allPins = data;
    }
  };
  
  var onError = function (errorMessage) {
    var errorView = function () {
      var errorTemplClone = errorsTempl.cloneNode(true);
      errorTemplClone.querySelector('p').textContent = errorMessage;
      return errorTemplClone;
    };

    document.querySelector('main').appendChild(errorView(errorMessage));

    var errorModal = document.querySelector('.error');
    var errorModalButton = errorModal.querySelector('.error__button');

    var errorClose = function () {
      errorModal.remove();
    };

    errorModalButton.addEventListener('click', function () {
      errorClose();
    });

    errorModal.addEventListener('click', function () {
      errorClose();
    });

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, errorClose);
    });
  };

  
  var cardActivation = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var l = 0; l < adFormFieldsetList.length; l++) {
      adFormFieldsetList[l].disabled = false;
    }
    window.backend.load(onLoadPins, onError);
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

      if (pinMainCoords.x > limits.right) {
        pinMainCoords.x = limits.right;
      }
      if (pinMainCoords.y > limits.bottom) {
        pinMainCoords.y = limits.bottom;
      }
      if (pinMainCoords.x < limits.left) {
        pinMainCoords.x = limits.left;
      }
      if (pinMainCoords.y < limits.top) {
        pinMainCoords.y = limits.top;
      }

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
  
  window.map = {
    loadPins: onLoadPins
  }
  
})();
