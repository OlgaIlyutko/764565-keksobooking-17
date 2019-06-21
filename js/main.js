'use strict';

var pointsMap = [];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
var adForm = document.querySelector('.ad-form');
var pinMain = map.querySelector('.map__pin--main');
var POINTS_COUNT = 8;
var AREA_MAP = {
  topY: 130,
  bottomY: 630
}

var randomPointMap = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

for (var i = 0; i < POINTS_COUNT; i++) {
  pointsMap.push({
    author: {
      avatar: './img/avatars/user0' + (i + 1) + '.png'
    },
    offter: {
      TYPE: TYPE[randomPointMap(0, 3)]
    },
    location: {
      x: randomPointMap(0, document.querySelector('main').offsetWidth),
      y: randomPointMap(AREA_MAP.topY, AREA_MAP.bottomY)
    }
  });
}

var pointView = function (pointTempl) {
  var pointTemplClone = pointsTempl.cloneNode(true);
  pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
  pointTemplClone.querySelector('img').src = pointTempl.author.avatar;
  return pointTemplClone;
};

var fragment = document.createDocumentFragment();
var pinPlace = function () {
  for (var j = 0; j < POINTS_COUNT; j++) {
    fragment.appendChild(pointView(pointsMap[j]));
  }
  var mapElemet = document.querySelector('.map__pins');
  mapElemet.appendChild(fragment);
};

var adFormFieldsetList = adForm.querySelectorAll('fieldset');
for (var k = 0; k < adFormFieldsetList.length; k++) {
  adFormFieldsetList[k].disabled = true;
}

var flagActivation = false;

var cardActivation = function () {
  flagActivation = true;
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var l = 0; l < adFormFieldsetList.length; l++) {
    adFormFieldsetList[l].disabled = false;
  }
  pinPlace();
};

var pxDelete = function (str) {
  return str.substring(0, str.length - 2);
};

var addressField = adForm.querySelector('#address');

var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');

adFormType.onchange = function () {
  var adFormTypeValue = adFormType.options[adFormType.selectedIndex].value;
  switch (adFormTypeValue) {
    case 'bungalo':
      adFormPrice.min = '0';
      adFormPrice.placeholder = '0';
      break;
    case 'flat':
      adFormPrice.min = '1000';
      adFormPrice.placeholder = '1000';
      break;
    case 'house':
      adFormPrice.min = '5000';
      adFormPrice.placeholder	= '5000';
      break;
    case 'palace':
      adFormPrice.min = '10000';
      adFormPrice.placeholder	= '10000';
      break;
    default: break;
  }
};

var adFormTimein = adForm.querySelector('#timein');
var adFormTimeout = adForm.querySelector('#timeout');

adFormTimein.addEventListener('change', function() {
  adFormTimeout.value = adFormTimein.value;
});
adFormTimeout.addEventListener('change', function() {
  adFormTimein.value = adFormTimeout.value;
});

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
  }


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
      cardActivation();
    };
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  document.addEventListener('mouseup', function () {
    var addressFieldLeft = parseInt(pxDelete(pinMain.style.left)) + Math.round(pinMain.offsetWidth / 2);
    var addressFieldTop = parseInt(pxDelete(pinMain.style.top)) + pinMain.offsetHeight;
    addressField.value = addressFieldLeft + ', ' + addressFieldTop;
  });
});
