'use strict';
navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then(stream => {
        const video = document.createElement('video');
        const app = document.querySelector('.app');
        const controls = document.querySelector('.controls');
        const takePhotoBtn = document.querySelector('#take-photo');
        controls.classList.add('visible');
        // video.width = 320;
        // video.height = 240;
        video.src = URL.createObjectURL(stream);
        app.insertBefore(video, controls);
    })
    .catch(err => {
       const errorMsg = document.querySelector('#error-message');
        errorMsg.textContent = 'К сожалению, работа с медиа-ресурсами не поддерживается ващшм браузером';
        errorMsg.classList.add('visible');
    });
