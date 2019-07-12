'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var fileChooserAvatar = adForm.querySelector('.ad-form__field input');
  var fileViewerAvatar = adForm.querySelector('.ad-form-header__preview img');
  var fileChooserPhoto = adForm.querySelector('.ad-form__upload input');
  var fileViewerPhoto = adForm.querySelector('.ad-form__photo-container');
  var FILES_TYPES = ['gif', 'jpg'];
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
  
  window.image = {
    onChangeFileChooserPhoto: onChangeFileChooserPhoto,
    onChangeFileChooserAvatar: onChangeFileChooserAvatar,
    clearImage: clearImage
  };
})();
