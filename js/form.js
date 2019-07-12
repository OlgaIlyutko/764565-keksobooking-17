'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRoom = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormCapacityOptions = adFormCapacity.querySelectorAll('option');
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


  var onChangeAdFormType = function () {
    var adFormTypeValue = adFormType.options[adFormType.selectedIndex].value;
    adFormPrice.min = typeToPrice[adFormTypeValue];
    adFormPrice.placeholder = typeToPrice[adFormTypeValue];
  };

  var onChangeAdFormTimein = function () {
    adFormTimeout.value = adFormTimein.value;
  };

  var onChangeAdFormTimeout = function () {
    adFormTimein.value = adFormTimeout.value;
  };

  var onChangeAdFormRoom = function () {
    var adFormRoomValue = adFormRoom.value;
    var availableOptions = roomToGuest[adFormRoomValue];
    adFormCapacityOptions.forEach(function (option) {
      option.disabled = availableOptions.indexOf(option.value) === -1;
    });
    var guests = Array.from(availableOptions);
    adFormCapacity.value = guests[guests.length - 1];
  };


  var createMessage = function (type, message) {
    var messageTempl = document.querySelector('#' + type).content.querySelector('.' + type);
    var messageTemplClone = messageTempl.cloneNode(true);
    messageTemplClone.querySelector('p').textContent = message;
    return messageTemplClone;
  };

  var onPopupMessage = function (type, message) {
    document.querySelector('main').appendChild(createMessage(type, message));
    var popup = document.querySelector('.' + type);
    var closePopup = function () {
      popup.remove();
      popup.removeEventListener('click', onClosePopup);
      document.removeEventListener('keydown', onClosePopupEsc);
    };
    var onClosePopup = function () {
      closePopup();
    };
    popup.addEventListener('click', onClosePopup);
    var onClosePopupEsc = function (evt) {
      window.util.isEsc(evt, closePopup);
    };
    document.addEventListener('keydown', onClosePopupEsc);
    var popupCloseButton = popup.querySelector('.' + type + '__button');
    if (popupCloseButton) {
      popupCloseButton.addEventListener('click', function () {
        onClosePopup();
      });
    }
  };

  var onSuccessSave = function () {
    var successMessage = 'Объявление успешно отправлено';
    onPopupMessage('success', successMessage);
  };

  var onError = function (errorMessage) {
    onPopupMessage('error', errorMessage);
  };

  var adFormResetButton = adForm.querySelector('.ad-form__reset');
  adFormResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    clearImage();
    window.map.dеactivateMap();
  });


  var adFormInputs = adForm.querySelectorAll('input');
  adFormInputs.forEach(function (input) {
    input.addEventListener('invalid', function () {
      input.classList.add('field__invalid');
      input.addEventListener('input', function () {
        input.classList.remove('field__invalid');
      });
    });
  });
  var onSubmitAdForm = function (evt) {
    evt.preventDefault();
    window.backend.saveData(new FormData(adForm), onSuccessSave, onError);
    window.map.dеactivateMap();
  };

  window.form = {
    onError: onError,
    onSubmitAdForm: onSubmitAdForm,
    onChangeAdFormType: onChangeAdFormType,
    onChangeAdFormTimein: onChangeAdFormTimein,
    onChangeAdFormTimeout: onChangeAdFormTimeout,
    onChangeAdFormRoom: onChangeAdFormRoom
  };
})();
