'use strict';
var pointsMap = [];
var typeOffer = ['palace', 'flat', 'house', 'bungalo'];


var randomPointMap = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

for (var i = 0; i < 8; i++) {
  	pointsMap[i] = {author: 'img/avatar/user0' + randomPointMap(1, 8) + '.png',
    offter: typeOffer[randomPointMap(0, 3)],
    locationX: randomPointMap(0, 130),
	locationY: randomPointMap(130, 630)}
		
};


var map = document.querySelector('.map');
	map.classList.remove('map--faded');
	
var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');	
var pointsTemplImg = pointsTempl.querySelector('img');

var pointView = function (pointTempl) {
	var pointTemplClone = pointsTempl.cloneNode(true);
	pointTemplClone.style.cssText = 'left: ' + pointTempl.locationX + 'px; top: ' + pointTempl.locationY;
	pointsTemplImg.src = pointTempl.author;
	pointsTemplImg.atl = pointTempl.author;
	
	return pointTemplClone;
}

var fragment = document.createDocumentFragment();
for (var j = 0; j < 1; j ++) {
	console.log(pointsMap[j]);
	fragment.appendChild(pointView(pointsMap[j]));
}	

var mapElemet = document.querySelector('.map__pins');
mapElemet.appendChild(fragment);