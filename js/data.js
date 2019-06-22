'use strict';

(function () {
  var pointsMap = [];
  var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var POINTS_COUNT = 8;
  var AREA_MAP = {
    topY: 130,
    bottomY: 630
  };

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
  window.data = pointsMap;
})();
