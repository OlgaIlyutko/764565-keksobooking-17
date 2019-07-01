'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters'); 
  var filterMapFiltersType = mapFilters.querySelector('#housing-type');
  var pinsCount;
  var FILTER_COUNT = 5;
  var POINTS_COUNT = 8;
 
  filterMapFiltersType.onchange = function () {
    var pinsType = [];
    pinsType = window.map.allPinsMap.filter(function(onePin) {
      if (filterMapFiltersType.options[filterMapFiltersType.selectedIndex].value == 'any' ) {
        pinsCount = POINTS_COUNT;
        return true;
      } else {
        pinsCount = FILTER_COUNT;
      }
      return onePin.offer.type === filterMapFiltersType.value;
    });  
    window.map.loadPins(pinsType, pinsCount);
  };  
})();
 