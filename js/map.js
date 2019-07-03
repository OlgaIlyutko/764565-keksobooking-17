'use strict';

(function () {
  
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters'); 
  var pointsTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var pointsPopupTempl = document.querySelector('#card').content.querySelector('.map__card');
  var errorsTempl = document.querySelector('#error').content.querySelector('.error');
  var pinMain = map.querySelector('.map__pin--main');
  var mapElement = document.querySelector('.map__pins');
  var addressField = adForm.querySelector('#address');
  var mapActivated = false;
  var pinsLoaded = false;
  var INDICATOR_PIN_HEIGHT = 20;
  var pinMainSizes = {
    WIDTH: pinMain.offsetWidth,
    HEIGHT: pinMain.offsetHeight + INDICATOR_PIN_HEIGHT
  };
  var AreaMap = {
    TOP_Y: 130,
    BOTTOM_Y: 630
  };
  
  var pinMainDefaultCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  }
  
  var roomRuToEng = {
    'Квартира': 'flat',
    'Бунгало': 'bungalo',
    'Дом': 'house',
    'Дворец': 'palace'
  }
  
  var limits = {
    top: AreaMap.TOP_Y - pinMainSizes.HEIGHT,
    bottom: AreaMap.BOTTOM_Y - pinMainSizes.HEIGHT,
    left: -pinMain.offsetWidth / 2,
    right: map.offsetWidth - (pinMain.offsetWidth / 2)
  };
  
  var allPins = [];
  
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
  
  var onPinsCreate = function (data, count) {
    clearAllPins();
    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > count ? count : data.length;
    for (var j = 0; j < takeNumber; j++) {
      fragment.appendChild(viewPins(data[j]));
    }
    mapElement.appendChild(fragment);
    
    if (mapActivated && !pinsLoaded) {
      pinsLoaded = true;
      window.map.allPins = data;
      
    }
    createPinsPopup(data[1]);
   
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
    Array.from(pointPopupTemplClone.querySelectorAll('.popup__feature')).forEach(function(liElem) {
      var countMatches = 0;
      element.offer.features.forEach(function (feature) {
        if (liElem.className.indexOf('-' + feature) != -1) {
          countMatches++;
        }
      })
      if (countMatches == 0) {
        liElem.remove();
      }
    });
    pointPopupTemplClone.querySelector('.popup__description').textContent = element.offer.description; 
    var popupPhotos = pointPopupTemplClone.querySelector('.popup__photos');
    var popupPhotoTempl = pointPopupTemplClone.querySelector('.popup__photo');
    element.offer.photos.forEach(function(photo){
      var pointTemplImgClone = popupPhotoTempl.cloneNode(true);
      popupPhotoTempl.src = photo;
      popupPhotos.appendChild(pointTemplImgClone);
    });
    map.insertBefore(pointPopupTemplClone, mapElement);
    
  };
  
  /*mapElement.onclick = function (event) {
    var target = event.target;
    
   /* while (target != mapElement) {
      console.log(target);
      /*if (target.tagName == 'button') {
        console.log(target)/
        return;
      }
    }
    target = target.parentNode;
  }*/
  
  mapElement.onclick = function(event) {
    var target = event.target;
    var td = target.closest('button');
    if (!td) return; // клик вне , не интересует

  // если клик на td, но вне этой таблицы (возможно при вложенных таблицах)
  // то не интересует
    if (!mapElement.contains(td)) return;

  // нашли элемент, который нас интересует!
    console.log('1-' + target.alt);
    var viewPin = allPins.filter(function(altPin) {
      
      
      console.log(window.map.allPins);
      return target.alt === altPin.author.avatar + ' ' + altPin.location.x + ', ' + altPin.location.y;
    })  
    console.log(viewPin);
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
    var addressFieldLeft = pinMain.offsetLeft + Math.round(pinMain.offsetWidth / 2);
    var addressFieldTop = pinMain.offsetTop + pinMainSizes.HEIGHT;
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
