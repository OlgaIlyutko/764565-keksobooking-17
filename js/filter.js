'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters'); 
  var filterMapFiltersType = mapFilters.querySelector('#housing-type');
  var pinsCount;
  
  filterMapFiltersType.onchange = function () {
    var pinsType = [];
    pinsType = window.map.allPins.filter(function(onePin) {
      if (filterMapFiltersType.options[filterMapFiltersType.selectedIndex].value == 'any' ) {
        return true;
      } 
      return onePin.offer.type === filterMapFiltersType.value;
    });  
    var map = document.querySelector('.map'); 
    var mapCardRemovable = map.querySelector('.map__card');
      if (mapCardRemovable) {
        mapCardRemovable.remove();
      } 
    window.map.onPinsCreate(pinsType);
  };  
})();
 