'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRoom = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  
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
    adFormCapacity.value = adFormRoomValue;
      var valRo = adFormRoomValue;
      adFormCapacity.value = valRo;
      console.log(valRo);
      var indVapRo = adFormCapacity.indexOf(valRo);
      console.log(indVapRo);
    for (var i = 0; i < 4 ; i++) {
   
      if (adFormCapacity.value != valRo) {
        
        
      }
     /* for (var i = adFormRoomValue - 1; i > 0; i-- ) {

       if (adFormCapacity.value != i) {
         adFormCapacity.options[i].disabled = false; 
       }

      }*/
    }
    
   /* switch (adFormRoomValue) {
      case '100':
        console.log('100');
        adFormCapacity.options[1].disabled = true;
        adFormCapacity.options[2].disabled = true;
        adFormCapacity.options[0].disabled = true;
        adFormCapacity.options[3].selected = true;
        break;
      case '1':
        
        break;
      case '2':
        
        break;
      case '3':
       
        break;
      default: break;
    }*/
  });  
  
})();
