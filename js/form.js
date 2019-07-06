'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapElement = map.querySelector('.map__pins');
  var pinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRoom = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var addressField = adForm.querySelector('#address');
  var successTempl = document.querySelector('#success').content.querySelector('.success');

  var typeToPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };

  var roomToGuest = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  adFormType.onchange = function () {
    var adFormTypeValue = adFormType.options[adFormType.selectedIndex].value;
    adFormPrice.min = typeToPrice[adFormTypeValue];
    adFormPrice.placeholder = typeToPrice[adFormTypeValue];
  };

  adFormTimein.addEventListener('change', function () {
    adFormTimeout.value = adFormTimein.value;
  });
  adFormTimeout.addEventListener('change', function () {
    adFormTimein.value = adFormTimeout.value;
  });

  var adFormCapacityOptions = adFormCapacity.querySelectorAll('option');
  adFormRoom.addEventListener('change', function () {
    var adFormRoomValue = adFormRoom.value;
    var availableOptions = roomToGuest[adFormRoomValue];
    adFormCapacityOptions.forEach(function (option) {
      option.disabled = availableOptions.indexOf(option.value) === -1;
    })
    var guests = Array.from(availableOptions);
    adFormCapacity.value = guests[guests.length - 1];
  });


  var clearAdForm = function() {
    window.map.clearAllPins();
    adForm.reset();
    window.map.dеactivateForm();
    window.map.setPinMainCoords(window.map.pinMainDefaultCoords);
    window.map.onAddressPinMain();
  };

  var onSuccessSave = function (response) {
    var successMessage = 'Объявление успешно отправлено';
    var viewSuccess = function (successMessage) {
      var successTemplClone = successTempl.cloneNode(true);
      successTemplClone.querySelector('p').textContent = successMessage;
      return successTemplClone;
    };

    document.querySelector('main').appendChild(viewSuccess(successMessage));
    var successModal = document.querySelector('.success');
    var onSuccessClose = function () {
      successModal.remove();
    };
    successModal.addEventListener('click', function () {
      onSuccessClose();
    });
    document.addEventListener('keydown', function (evt) {
      window.util.isEsc(evt, onSuccessClose);
    });
  };


  var adFormResetButton = adForm.querySelector('.ad-form__reset');
  adFormResetButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    clearAdForm();

  });

  var adFormSubmitButton = adForm.querySelector('.ad-form__submit');

  var adFormInput = adForm.querySelectorAll('input');

  adFormInput.forEach(function (input) {
    input.addEventListener('invalid', function (evt) {
      input.classList.add('field__invalid');
      input.addEventListener('input', function (evt) {
        input.classList.remove('field__invalid');
      })
    })
  })

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.saveData(new FormData(adForm), onSuccessSave, window.map.onError);
    clearAdForm();
  });

})();
