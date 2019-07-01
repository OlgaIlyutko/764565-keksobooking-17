'use strict';
(function () {
  var mapFilters = document.querySelector('.map__filters'); 
  var mapFiltersType = mapFilters.querySelector('#housing-type');
  var FILTER_COUNT = 5;
  var POINTS_COUNT = 8;
 
  mapFiltersType.onchange = function () {
    var pinsType = [];
    pinsType = allPins.filter(function(newPin) {
      if (mapFiltersType.options[mapFiltersType.selectedIndex].value == 'any' ) {
        FILTER_COUNT = POINTS_COUNT;
        return true;
      } else return newPin.offer.type === mapFiltersType.value;
    });  
    window.map.loadPins(pinsType, FILTER_COUNT);
  };  
})();
 