'use strict';

(function () {
  var ServerUrl = {
   LOAD: 'https://js.dump.academy/keksobooking/data',
   SAVE: 'https://js.dump.academy/keksobooking'
  }
  var OK_STATUS = 200;
  var TIMEOUT = 100000;

  var createXhr = function (onLoad, onError, method, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === OK_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    return xhr;
  };

  var loadData = function (onLoad, onError) {
    createXhr(onLoad, onError, 'GET', ServerUrl.LOAD).send();
  };


  var saveData = function (data, onLoad, onError) {
    createXhr(onLoad, onError, 'POST', ServerUrl.SAVE).send(data);
  };


  window.backend = {
    loadData: loadData,
    saveData: saveData
  };
})();
