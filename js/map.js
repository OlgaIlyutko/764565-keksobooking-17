'use strict';

(function () {

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRoom = adForm.querySelector('#room_number');
  var fileChooserAvatar = adForm.querySelector('.ad-form__field input');
  var fileChooserPhoto = adForm.querySelector('.ad-form__upload input');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelector('.map__filters');
  var pinTempl = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTempl = document.querySelector('#card').content.querySelector('.map__card');
  var popupPhotoTempl = document.querySelector('#card').content.querySelector('.popup__photo');
  var pinMain = map.querySelector('.map__pin--main');
  var mapAllPins = document.querySelector('.map__pins');
  var addressField = adForm.querySelector('#address');
  var mapActivated = false;
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
  var Limits = {
    TOP: AreaMap.TOP_Y - PinMainSizes.HEIGHT,
    BOTTOM: AreaMap.BOTTOM_Y - PinMainSizes.HEIGHT,
    LEFT: -Math.floor(PinMainSizes.WIDTH / 2),
    RIGHT: map.offsetWidth - Math.floor(PinMainSizes.WIDTH / 2)
  };
  var PinMainDefaultCoords = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };
  var roomRuToEng = {
    'Квартира': 'flat',
    'Бунгало': 'bungalo',
    'Дом': 'house',
    'Дворец': 'palace'
  };


  var hideOneForm = function (form, flag) {
    Array.from(form.children).forEach(function (field) {
      field.disabled = flag;
    });
  };
  var hideAllForm = function (flag) {
    hideOneForm(adForm, flag);
    if (!flag) {
      adFormType.addEventListener('change', window.form.onChangeAdFormType);
      adFormTimein.addEventListener('change', window.form.onChangeAdFormTimein);
      adFormTimeout.addEventListener('change', window.form.onChangeAdFormTimeout);
      adFormRoom.addEventListener('change', window.form.onChangeAdFormRoom);
      fileChooserPhoto.addEventListener('change', window.image.onChangeFileChooserPhoto);
      fileChooserAvatar.addEventListener('change', window.image.onChangeFileChooserAvatar);
    } else {
      adFormType.removeEventListener('change', window.form.onChangeAdFormType);
      adFormTimein.removeEventListener('change', window.form.onChangeAdFormTimein);
      adFormTimeout.removeEventListener('change', window.form.onChangeAdFormTimeout);
      adFormRoom.removeEventListener('change', window.form.onChangeAdFormRoom);
      fileChooserPhoto.removeEventListener('change', window.image.onChangeFileChooserPhoto);
      fileChooserAvatar.removeEventListener('change', window.image.onChangeFileChooserAvatar);
    }
    hideOneForm(mapFilters, flag);
  };


  var clearAllPins = function () {
    var mapPins = mapAllPins.querySelectorAll('[class=map__pin]');
    mapPins.forEach(function (it) {
      it.remove();
    });
    var mapCardRemovable = map.querySelector('.map__card');
    if (mapCardRemovable) {
      mapCardRemovable.remove();
    }
  };


  var viewPin = function (elementPin) {
    var pinTemplClone = pinTempl.cloneNode(true);
    pinTemplClone.style = 'left: ' + (elementPin.location.x - document.querySelector('.map__pin').offsetWidth / 2) + 'px; top: ' + (elementPin.location.y - document.querySelector('.map__pin').offsetHeight) + 'px;';
    pinTemplClone.querySelector('img').src = elementPin.author.avatar;
    pinTemplClone.querySelector('img').atl = elementPin.offer.title;
    pinTemplClone.setAttribute('name', elementPin.author.avatar + '_' + elementPin.location.x + '_' + elementPin.location.y);
    return pinTemplClone;
  };
  var onPinsCreate = function (data) {
    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > PINS_COUNT ? PINS_COUNT : data.length;
    for (var j = 0; j < takeNumber; j++) {
      fragment.appendChild(viewPin(data[j]));
    }
    mapAllPins.appendChild(fragment);
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
  var createPinPopup = function (elementCard) {
    var cardTemplClone = cardTempl.cloneNode(true);
    cardTemplClone.querySelector('.popup__avatar').src = elementCard.author.avatar;
    cardTemplClone.querySelector('.popup__title').textContent = elementCard.offer.title;
    cardTemplClone.querySelector('.popup__text--address').textContent = elementCard.offer.address;
    cardTemplClone.querySelector('.popup__text--price').textContent = elementCard.offer.price + 'Р/ночь';
    cardTemplClone.querySelector('.popup__type').textContent = roomRuToEng[elementCard.offer.type];
    cardTemplClone.querySelector('.popup__text--capacity').textContent = elementCard.offer.rooms + ' комнаты для ' + elementCard.offer.guests + 'гостей';
    cardTemplClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + elementCard.offer.checkin + ' выезд до ' + elementCard.offer.checkout;
    cardTemplClone.querySelector('.popup__features').innerHTML = '';
    cardTemplClone.querySelector('.popup__features').appendChild(createFeaturesFragment(elementCard));
    cardTemplClone.querySelector('.popup__description').textContent = elementCard.offer.description;
    cardTemplClone.querySelector('.popup__photos').removeChild(cardTemplClone.querySelector('.popup__photo'));
    cardTemplClone.querySelector('.popup__photos').appendChild(createPhotosFragment(elementCard));
    mapFiltersContainer.insertAdjacentElement('beforebegin', cardTemplClone);
    var closePopupButton = cardTemplClone.querySelector('.popup__close');
    var closePopup = function () {
      cardTemplClone.remove();
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
    return cardTemplClone;
  };


  var setPinMainCoords = function (coords) {
    pinMain.style.left = coords.x + 'px';
    pinMain.style.top = coords.y + 'px';
  };
  var onAddressPinMain = function () {
    var addressFieldLeft = pinMain.offsetLeft + Math.floor(pinMain.offsetWidth / 2);
    var addressFieldTop = mapActivated ? pinMain.offsetTop + Math.floor(PinMainSizes.HEIGHT) : pinMain.offsetTop + Math.floor(pinMain.offsetHeight / 2);
    addressField.value = addressFieldLeft + ', ' + addressFieldTop;
  };


  var pinMainCoords = {
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
      pinMainCoords = {
        x: pinMain.offsetLeft - delta.x,
        y: pinMain.offsetTop - delta.y
      };
      if (pinMainCoords.x > Limits.RIGHT) {
        pinMainCoords.x = Limits.RIGHT;
      }
      if (pinMainCoords.y > Limits.BOTTOM) {
        pinMainCoords.y = Limits.BOTTOM;
      }
      if (pinMainCoords.x < Limits.LEFT) {
        pinMainCoords.x = Limits.LEFT;
      }
      if (pinMainCoords.y < Limits.TOP) {
        pinMainCoords.y = Limits.TOP;
      }
      pinMain.style.left = pinMainCoords.x + 'px';
      pinMain.style.top = pinMainCoords.y + 'px';
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!mapActivated) {
        activateMap();
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', onAddressPinMain);
  });

  var onSuccessLoad = function (data) {
    onPinsCreate(data);
    window.map.allPins = data;
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    hideAllForm(false);
    mapActivated = true;
    window.backend.loadData(onSuccessLoad, window.form.onError);
    mapAllPins.addEventListener('click', onClickPin);
    mapFilters.addEventListener('change', window.filter.onFilterMap);
    adForm.addEventListener('submit', window.form.onSubmitAdForm);
  };

  var dеactivateMap = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    hideAllForm(true);
    adForm.reset();
    window.image.clearImage();
    window.filter.clearAllFilter();
    clearAllPins();
    mapActivated = false;
    setPinMainCoords(PinMainDefaultCoords);
    onAddressPinMain();
    mapAllPins.removeEventListener('click', onClickPin);
    mapFilters.removeEventListener('change', window.filter.onFilterMap);
    adForm.removeEventListener('submit', window.form.onSubmitAdForm);
  };

  dеactivateMap();

  var onClickPin = function (event) {
    var target = event.target;
    while (target !== mapAllPins) {
      if (target.tagName === 'BUTTON' && target.type === 'button') {
        var targetPin = window.map.allPins.find(function (it) {
          return target.name === it.author.avatar + '_' + it.location.x + '_' + it.location.y;
        });
        var mapCardRemovable = map.querySelector('.map__card');
        if (mapCardRemovable) {
          mapCardRemovable.remove();
        }
        createPinPopup(targetPin);
        return;
      }
      target = target.parentNode;
    }
  };


  window.map = {
    onPinsCreate: onPinsCreate,
    setPinMainCoords: setPinMainCoords,
    onAddressPinMain: onAddressPinMain,
    clearAllPins: clearAllPins,
    dеactivateMap: dеactivateMap,
    onSuccessLoad: onSuccessLoad,
    allPins: allPins
  };

})();
