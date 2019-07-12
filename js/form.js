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
  var fileChooserAvatar = adForm.querySelector('.ad-form__field input');
  var fileViewerAvatar = adForm.querySelector('.ad-form-header__preview img');
  var fileChooserPhoto = adForm.querySelector('.ad-form__upload input');
  var fileViewerPhoto = adForm.querySelector('.ad-form__photo-container');
  var FILES_TYPES = ['gif', 'jpg'];
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


  var createReaderAvatar = function (file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      fileViewerAvatar.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  var createReaderPhoto = function (file) {
    clearEmptyDivPhoto();
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      var divPhoto = document.createElement('div');
      divPhoto.classList.add('ad-form__photo');
      var imgPhoto = document.createElement('img');
      divPhoto.classList.add('ad-form__img');
      imgPhoto.src = reader.result;
      imgPhoto.classList.add('popup__photo');
      imgPhoto.setAttribute('width', '70px');
      imgPhoto.setAttribute('height', '70px');
      divPhoto.appendChild(imgPhoto);
      fileViewerPhoto.appendChild(divPhoto);
    });
    reader.readAsDataURL(file);
  };

  var createDefaultDivPhoto = function () {
    var emptyDiv = document.createElement('div');
    emptyDiv.classList.add('ad-form__photo');
    fileViewerPhoto.appendChild(emptyDiv);
  };

  var clearEmptyDivPhoto = function () {
    var fileDivsPhoto = adForm.querySelectorAll('.ad-form__photo');
    fileDivsPhoto.forEach(function (div) {
      if (!div.classList.contains('ad-form__img')) {
        div.remove();
      }
    });
  };

  var clearAvatar = function () {
    var fileAvatar = adForm.querySelector('.ad-form-header__preview img');
    fileAvatar.src = 'img/muffin-grey.svg';
  };

  var clearPhoto = function () {
    var fileDivsPhoto = adForm.querySelectorAll('.ad-form__photo');
    fileDivsPhoto.forEach(function (it) {
      it.remove();
    });
    createDefaultDivPhoto();
  };

  var clearImage = function () {
    clearAvatar();
    clearPhoto();
  };

  var checkFileType = function (file) {
    return FILES_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  var chooseImages = function (input, container) {
    var matches = Array.from(input.files).filter(checkFileType);
    if (matches) {
      matches.forEach(container);
    }
  };

  var onChangeFileChooserPhoto = function () {
    chooseImages(fileChooserPhoto, createReaderPhoto);
  };

  var onChangeFileChooserAvatar = function () {
    chooseImages(fileChooserAvatar, createReaderAvatar);
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
    onChangeAdFormRoom: onChangeAdFormRoom,
    onChangeFileChooserPhoto: onChangeFileChooserPhoto,
    onChangeFileChooserAvatar: onChangeFileChooserAvatar,
    clearImage: clearImage
  };
})();
