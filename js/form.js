'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');

  adFormType.onchange = function () {
    var adFormTypeValue = adFormType.options[adFormType.selectedIndex].value;
    switch (adFormTypeValue) {
      case 'bungalo':
        adFormPrice.min = '0';
        adFormPrice.placeholder = '0';
        break;
      case 'flat':
        adFormPrice.min = '1000';
        adFormPrice.placeholder = '1000';
        break;
      case 'house':
        adFormPrice.min = '5000';
        adFormPrice.placeholder	= '5000';
        break;
      case 'palace':
        adFormPrice.min = '10000';
        adFormPrice.placeholder	= '10000';
        break;
      default: break;
    }
  };

  adFormTimein.addEventListener('change', function () {
    adFormTimeout.value = adFormTimein.value;
  });
  adFormTimeout.addEventListener('change', function () {
    adFormTimein.value = adFormTimeout.value;
  });
})();
