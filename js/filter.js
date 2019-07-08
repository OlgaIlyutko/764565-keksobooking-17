'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters'); 
  var houseType = mapFilters.querySelector('#housing-type');
  var housePrice = mapFilters.querySelector('#housing-price');
  var houseRooms = mapFilters.querySelector('#housing-rooms');
  var houseGuests = mapFilters.querySelector('#housing-guests');
  var houseFeatures = mapFilters.querySelector('#housing-features');
  var RangeOfPrice = {
    LOW: {
      MIN: 0,
      MAX: 10000
    },
    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },
    HIGH: {
      MIN: 50000,
      MAX: Infinity
    }
  };
  var DEBOUNCE_INTERVAL = 50000;
  var lastTimeout;
  
  var filterItem = function (it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString();
  };

  var filterMapHouseType = function (item) {
    return filterItem(houseType, item.offer, 'type');
  };
  
  var filterMapHousePrice = function (item) {
    var filterPrice = RangeOfPrice[housePrice.value.toUpperCase()];
    return filterPrice ? item.offer.price >= filterPrice.MIN && item.offer.price <= filterPrice.MAX : true;
  };

  var filterMapHouseRooms = function (item) {
    return filterItem(houseRooms, item.offer, 'rooms');
  };
  
  var filterMapHouseGuests = function (item) {
    return filterItem(houseGuests, item.offer, 'guests');
  };
   
  var filterMapHouseFeatures = function (item) {
    var checkedFeaturesItems = houseFeatures.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };
  
  var onFilterMap = function() {
    window.map.clearAllPins(); debounce(window.map.onPinsCreate(window.map.allPins.filter(filterMapHouseType).filter(filterMapHousePrice).filter(filterMapHouseRooms).filter(filterMapHouseGuests).filter(filterMapHouseFeatures)));
  };
  
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function() {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
  };
  
  mapFilters.addEventListener('change', onFilterMap);
  
  
})();
 