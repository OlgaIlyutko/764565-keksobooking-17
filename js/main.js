'use strict';
var pointsMap = [];
var type = ['palace', 'flat', 'house', 'bungalo'];
var map = document.querySelector('.map');

var randomPointMap = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var pointMap;

for (var i = 0; i < 8; i++) {
   pointsMap.push({
    author: {avatar: './img/avatars/user0' + (i + 1) + '.png'},
    offter: {type: type[randomPointMap(0, 3)]},
    location: {x: randomPointMap(0, document.querySelector('main').offsetWidth),
      y: randomPointMap(130, 630)}});
	
}

map.classList.remove('map--faded');

var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');

var pointView = function (pointTempl) {
  var pointTemplClone = pointsTempl.cloneNode(true);
  pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
  pointTemplClone.querySelector('img').src = pointTempl.author.avatar;

  return pointTemplClone;
};

var fragment = document.createDocumentFragment();
for (var j = 0; j < 8; j++) {
  fragment.appendChild(pointView(pointsMap[j]));
}

var mapElemet = document.querySelector('.map__pins');
mapElemet.appendChild(fragment);
