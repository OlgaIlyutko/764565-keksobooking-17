'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  
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
})();
