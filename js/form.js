'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapElement = document.querySelector('.map__pins');
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
  
  adFormRoom.addEventListener('change', function () {
    
    var adFormRoomValue = adFormRoom.options[adFormRoom.selectedIndex].value;
    for (var i=0; i < 4; i++) {
      if ((adFormCapacity.options[i].value > parseInt(adFormRoomValue, 10)) || (adFormCapacity.options[i].value == 0)) {
        if (adFormRoomValue != 100) {
          adFormCapacity.options[i].disabled = true;
        } else {
          adFormCapacity.options[i].disabled = false;
        }
      } else {
        if (adFormRoomValue != 100) {
          adFormCapacity.options[i].disabled = false;
          adFormCapacity.value = adFormRoomValue;
        } else {
          adFormCapacity.options[i].disabled = true;
          adFormCapacity.value = 0;
        }  
      }      
    }
 }); 
  var adFormResetButton = adForm.querySelector('.ad-form__reset');
  adFormResetButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    
    var mapPins = mapElement.querySelectorAll("[class=map__pin]");
    mapPins.forEach(function(mapPin) {
      mapPin.remove();
    })
    
    
    adForm.reset();
    
    pinMain.style.left = window.map.pinMainCoords.left + 'px';
    pinMain.style.top = window.map.pinMainCoords.top + 'px';
    /*window.map.setAddressPinMain();*/
    
  })
  
  var adFormSubmitButton = adForm.querySelector('.ad-form__submit');
  
  adFormSubmitButton.addEventListener('submit', function (Wevt) {
    Wevt.preventDefault();
    var viewSuccess = function () {
      var successTemplClone = successTempl.cloneNode(true);
      successTemplClone.querySelector('p').textContent = successMessage;
      return successTemplClone;
    };
    var successMessage = "ww";
    document.querySelector('main').appendChild(viewSuccess(successMessage));

    var successModal = document.querySelector('.success');
    

    var onSuccessClose = function () {
      successModal.remove();
    };

    successModal.addEventListener('click', function () {
      onSuccessClose();
    });

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, onSuccessClose);
    });
  });
  
})();
