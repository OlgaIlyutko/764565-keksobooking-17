'use strict';

(function () {
  
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelector('.map__filters');
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var pointsPopupTempl = document.querySelector('#card').content.querySelector('.map__card');
  var popupPhotoTempl = document.querySelector('#card').content.querySelector('.popup__photo');
  var errorsTempl = document.querySelector('#error').content.querySelector('.error');
  var pinMain = map.querySelector('.map__pin--main');
  var mapElement = document.querySelector('.map__pins');
  var addressField = adForm.querySelector('#address');
  var mapActivated = false;
  var pinsLoaded = false;
  var PINS_COUNT = 5;
  var allPins = [];
  var INDICATOR_PIN_HEIGHT = 20;
  var PinMainSizes = {
    WIDTH: pinMain.offsetWidth,
    HEIGHT: pinMain.offsetHeight + INDICATOR_PIN_HEIGHT
  };
  var AreaMap = {
    TOP_Y: 130,
    BOTTOM_Y: 630
  };
  var limits = {
    top: AreaMap.TOP_Y - PinMainSizes.HEIGHT,
    bottom: AreaMap.BOTTOM_Y - PinMainSizes.HEIGHT,
    left: -Math.floor(PinMainSizes.WIDTH / 2),
    right: map.offsetWidth - Math.floor(PinMainSizes.WIDTH / 2)
  };
  var PinMainDefaultCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  }
  var roomRuToEng = {
    'Квартира': 'flat',
    'Бунгало': 'bungalo',
    'Дом': 'house',
    'Дворец': 'palace'
  };  
  
 
  
  var hideAllForm = function(flag) {
    hideOneForm(adForm, flag);
    hideOneForm(mapFilters, flag);
  };
  var hideOneForm = function(form, flag) {
    Array.from(form.children).forEach(function (field) {
      field.disabled = flag;
    })
  }
  
  var loadDataPageFirst = function () {
    hideAllForm(true);
    onAddressPinMain(); 
  };
  
  
  
  var viewPins = function (pointTempl) {
    var pointTemplClone = pointsTempl.cloneNode(true);
    pointTemplClone.style = 'left: ' + (pointTempl.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (pointTempl.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
    pointTemplClone.querySelector('img').src = pointTempl.author.avatar;
    pointTemplClone.querySelector('img').alt = pointTempl.author.avatar + ' ' + pointTempl.location.x + ', ' + pointTempl.location.y;
    return pointTemplClone;
  };
  
  var clearAllPins = function () {
    var mapPins = mapElement.querySelectorAll("[class=map__pin]");
    mapPins.forEach(function(mapPin) {
      mapPin.remove();
    })
  };
  
  var onPinsCreate = function (data) {
    clearAllPins();
    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > PINS_COUNT ? PINS_COUNT : data.length;
    for (var j = 0; j < takeNumber; j++) {
      fragment.appendChild(viewPins(data[j]));
    }
    mapElement.appendChild(fragment);
    if (mapActivated && !pinsLoaded) {
      pinsLoaded = true;
      window.map.allPins = data;
      createPinsPopup(data[0]); 
    }
    
  };
  
  
   var createFeaturesFragment = function (elementFeature) {
    var featureFragment = document.createDocumentFragment();
    elementFeature.offer.features.forEach(function (it) {
      var featureItem = document.createElement('li');
      featureItem.className = 'popup__feature popup__feature--' + it;
      featureFragment.appendChild(featureItem);
    });
    return featureFragment;
  };
  
  

  var createPhotosFragment = function (elementPhoto) {
    var photosFragment = document.createDocumentFragment();
    elementPhoto.offer.photos.forEach(function (it) {
      var popupPhotoItem = popupPhotoTempl.cloneNode(true);
      popupPhotoItem.src = it;
      photosFragment.appendChild(popupPhotoItem);
    });
    return photosFragment;
  };
  
  var createPinsPopup = function (element) {
    var pointPopupTemplClone = pointsPopupTempl.cloneNode(true);
    pointPopupTemplClone.querySelector('.popup__avatar').src = element.author.avatar;
    pointPopupTemplClone.querySelector('.popup__title').textContent = element.offer.title;
    pointPopupTemplClone.querySelector('.popup__text--address').textContent = element.offer.address;
    pointPopupTemplClone.querySelector('.popup__text--price').textContent = element.offer.price + 'Р/ночь';
    pointPopupTemplClone.querySelector('.popup__type').textContent = roomRuToEng[element.offer.type];
    pointPopupTemplClone.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + 'гостей';
    pointPopupTemplClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ' выезд до ' + element.offer.checkout;
    pointPopupTemplClone.querySelector('.popup__features').innerHTML = '';
    pointPopupTemplClone.querySelector('.popup__features').appendChild(createFeaturesFragment(element));
    pointPopupTemplClone.querySelector('.popup__description').textContent = element.offer.description;  
    pointPopupTemplClone.querySelector('.popup__photos').removeChild(pointPopupTemplClone.querySelector('.popup__photo'));
    pointPopupTemplClone.querySelector('.popup__photos').appendChild(createPhotosFragment(element));
    mapFiltersContainer.insertAdjacentElement('beforebegin', pointPopupTemplClone);
    
    var closePopupButton = pointPopupTemplClone.querySelector('.popup__close');
    var closePopup = function () {
      pointPopupTemplClone.remove();
      closePopupButton.removeEventListener('click', onClosePopupButton);
      document.removeEventListener('keydown', onClosePopupEsc);
    };
    var onClosePopupButton = function () {
      closePopup();
    };
    closePopupButton.addEventListener('click', onClosePopupButton);
    var onClosePopupEsc = function (evt) {
      window.util.isEsc(evt, closePopup);
    };
    document.addEventListener('keydown', onClosePopupEsc);
    return pointPopupTemplClone;
  };
  
  
  map.onclick = function(event) {
    var target = event.target;
    var but = target.closest('[type=button]');
    if (!but) return;

    if (!mapElement.contains(but)) return;

    var viewPin = window.map.allPins.find(function(altPin) {
       return target.alt === altPin.author.avatar + ' ' + altPin.location.x + ', ' + altPin.location.y;
    })  
    console.log(target);
    var mapCardRemovable = map.querySelector('.map__card');
      if (mapCardRemovable) {
        mapCardRemovable.remove();
      }
      createPinsPopup(viewPin);
  }
  
  var onError = function (errorMessage) {
    var viewError = function () {
      var errorTemplClone = errorsTempl.cloneNode(true);
      errorTemplClone.querySelector('p').textContent = errorMessage;
      return errorTemplClone;
    };

    document.querySelector('main').appendChild(viewError(errorMessage));
    var errorModal = document.querySelector('.error');
    var errorModalButton = errorModal.querySelector('.error__button');
    var onErrorClose = function () {
      errorModal.remove();
    };
    errorModalButton.addEventListener('click', function () {
      onErrorClose();
    });
    errorModal.addEventListener('click', function () {
      onErrorClose();
    });
    document.addEventListener('keydown', function (evt) {
      window.util.isEsc(evt, onErrorClose);
    });
  };

  
  var activateMap = function () {
    activateForm();    
    window.backend.loadData(onPinsCreate, onError);    
  };

  var activateForm = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    hideAllForm(false);   
  }
  
  var dеactivateForm = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    hideAllForm(true);
    mapActivated = false;
  }
  
  var setPinMainCoords = function (coords) {
    pinMain.style.left = coords.x + 'px';
    pinMain.style.top = coords.y + 'px';
  };
      
  var onAddressPinMain = function () {
    var addressFieldLeft = pinMain.offsetLeft + Math.floor(pinMain.offsetWidth / 2);
    var addressFieldTop = pinMain.offsetTop + PinMainSizes.HEIGHT;
    addressField.value = addressFieldLeft + ', ' + addressFieldTop;
  };
  
  
  var pinMainDefaultCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };
  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var newCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var delta = {
        x: startCoords.x - newCoords.x,
        y: startCoords.y - newCoords.y
      };
      startCoords = {
        x: newCoords.x,
        y: newCoords.y
      };
      pinMainDefaultCoords = {
        x: pinMain.offsetLeft - delta.x,
        y: pinMain.offsetTop - delta.y
      };
      
      if (pinMainDefaultCoords.x > limits.right) {
        pinMainDefaultCoords.x = limits.right;
      }
      if (pinMainDefaultCoords.y > limits.bottom) {
        pinMainDefaultCoords.y = limits.bottom;
      }
      if (pinMainDefaultCoords.x < limits.left) {
        pinMainDefaultCoords.x = limits.left;
      }
      if (pinMainDefaultCoords.y < limits.top) {
        pinMainDefaultCoords.y = limits.top;
      }

      pinMain.style.left = pinMainDefaultCoords.x + 'px';
      pinMain.style.top = pinMainDefaultCoords.y + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!mapActivated) {
        activateMap();
        mapActivated = true;
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    document.addEventListener('mouseup', onAddressPinMain);
  });
  
  
  loadDataPageFirst();
  
  window.map = {
    onPinsCreate: onPinsCreate,
    setPinMainCoords: setPinMainCoords,
    onAddressPinMain: onAddressPinMain,
    clearAllPins: clearAllPins,
    dеactivateForm: dеactivateForm,
    onError: onError,
    allPins: allPins,
    pinMainDefaultCoords: pinMainDefaultCoords
  }
  
})();
