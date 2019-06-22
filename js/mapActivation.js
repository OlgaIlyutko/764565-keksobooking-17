'use strict';

(function () {
  var POINTS_COUNT = 8;
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');


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

  window.mapActivation = {
    activeMap: cardActivation
  };
})();
