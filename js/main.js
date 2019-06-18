'use strict';
var pointsMap = [];
var type = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');
var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
var adForm = document.querySelector('.ad-form');
var pinMain = map.querySelector('.map__pin--main');

var randomPointMap = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

for (var i = 0; i < 8; i++) {
  pointsMap.push({
    author: {avatar: './img/avatars/user0' + (i + 1) + '.png'},
    offter: {type: type[randomPointMap(0, 3)]},
    location: {x: randomPointMap(0, document.querySelector('main').offsetWidth),
      y: randomPointMap(130, 630)}});
}

var pointView = function (pointTempl) {
  var pointTemplClone = pointsTempl.cloneNode(true);
  pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
  pointTemplClone.querySelector('img').src = pointTempl.author.avatar;
  return pointTemplClone;
};

var fragment = document.createDocumentFragment();
var pinPlace = function () {
  for (var j = 0; j < 8; j++) {
    fragment.appendChild(pointView(pointsMap[j]));
  }
  var mapElemet = document.querySelector('.map__pins');
  mapElemet.appendChild(fragment);
};

var adFormFieldsetList = adForm.querySelectorAll('fieldset');
for (var k = 0; k < adFormFieldsetList.length; k++) {
  adFormFieldsetList[k].disabled = true;
}

pinMain.addEventListener('click', function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var l = 0; l < adFormFieldsetList.length; l++) {
    adFormFieldsetList[l].disabled = false;
  }
  pinPlace();
});

var pxDelete = function (str) {
  return str.substring(0, str.length - 2);
};

var addressField = adForm.querySelector('#address');
pinMain.addEventListener('mouseup', function () {
  addressField.value = pxDelete(pinMain.style.left) + ', ' + pxDelete(pinMain.style.top);
});

var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');

adFormType.onchange = function () {
  var adFormTypeValue = adFormType.options[adFormType.selectedIndex].value;
  switch (adFormTypeValue) {
    case 'bungalo': {
      adFormPrice.min = '0';
      adFormPrice.placeholder = '0';}
      break;
    case 'flat': {
      adFormPrice.min = '1000';
      adFormPrice.placeholder = '1000';}
      break;
    case 'house': {
      adFormPrice.min = '5000';
      adFormPrice.placeholder	= '5000';}
      break;
    case 'palace': {
      adFormPrice.min = '10000';
      adFormPrice.placeholder	= '10000';}
      break;
    default: break;
}
}

var adFormTimein = adForm.querySelector('#timein');
var adFormTimeout = adForm.querySelector('#timeout');

adFormTimein.onchange = function () {
  var adFormTimeinValue = adFormTimein.options[adFormTimein.selectedIndex].value;
  switch (adFormTimeinValue) {
    case '12:00': adFormTimeout[0].selected = true; break;
    case '13:00': adFormTimeout[1].selected = true; break;
    case '14:00': adFormTimeout[2].selected = true; break;
    default: break;
  }
}

adFormTimeout.onchange = function () {
  var adFormTimeoutValue = adFormTimeout.options[adFormTimeout.selectedIndex].value;
  switch (adFormTimeoutValue) {
    case '12:00': adFormTimein[0].selected = true; break;
    case '13:00': adFormTimein[1].selected = true; break;
    case '14:00': adFormTimein[2].selected = true; break;
    default: break;
  }
}
