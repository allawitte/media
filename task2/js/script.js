'use strict';
const video = document.createElement('video');

navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then(videoSuccess)
    .catch(err => {
        const errorMsg = document.querySelector('#error-message');
        errorMsg.textContent = 'К сожалению, работа с медиа-ресурсами не поддерживается ващшм браузером';
        errorMsg.classList.add('visible');
    });

function videoSuccess(stream) {
    const app = document.querySelector('.app');
    const controls = document.querySelector('.controls');
    const takePhotoBtn = document.querySelector('#take-photo');
    controls.classList.add('visible');
    video.src = URL.createObjectURL(stream);
    video.setAttribute('autoplay', true);
    video.setAttribute('playsinline', true);
    app.insertBefore(video, controls);
    takePhotoBtn.addEventListener('click', takePhoto);
}

function takePhoto() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const list = document.querySelector('.list');
    const audio = document.createElement('audio');
    audio.src = './audio/click.mp3';
    audio.autoplay = true;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    addImgToList(canvas, list);
}

function addImgToList(canvas, list) {
    let imgPath = canvas.toDataURL();
    const removePhoto = function (i) {
        return function (e) {
            const figure = document.querySelector('figure[data-number="'+i+'"]');
            list.removeChild(figure);
        };
    };
    const uploadImage = function (i) {
        return function (e) {
            canvas.toBlob(blob => {
                const formData = new FormData();
                formData.append('image', blob);
                //const xhr = new XMLHttpRequest();
                // var boundary = String(Math.random()).slice(2);
                // xhr.open('POST', 'https://neto-api.herokuapp.com/photo-booth');
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                // xhr.addEventListener('load', () => {
                //     console.log(xhr.response);
                // });
                // xhr.send(formData);
                fetch('https://neto-api.herokuapp.com/photo-booth', {
                    method: 'POST',
                    body: formData
                })
                    .then(r => console.log(r))
                    .then(r => r.json())
                    .then(data => {
                        console.log(data)
                    });
            });
        }


    };
    let listItem = {
        tag: 'figure',
        attributes: [{
            data: {
                number: ''
            }
        }],
        children: [
            {
                tag: 'img',
                attributes: [{src: imgPath}],
                children: []
            },
            {
                tag: 'figcaption',
                attributes: [],
                children: [
                    {
                        tag: 'a',
                        attributes: [{href: imgPath}, {download: 'snapshot.png'}],
                        children: [{
                            tag: 'i',
                            attributes: [{
                                class: 'material-icons'
                            },
                                {
                                    text: 'file_download'
                                }]
                        }]
                    },
                    {
                        tag: 'a',
                        attributes: [],
                        children: [{
                            tag: 'i',
                            attributes: [{
                                class: 'material-icons'
                            },
                                {
                                    text: 'file_upload'
                                }]
                        }],
                        action: {
                            event: 'click',
                            function: uploadImage
                        }
                    },
                    {
                        tag: 'a',
                        attributes: [],
                        children: [{
                            tag: 'i',
                            attributes: [{
                                class: 'material-icons'
                            },
                                {
                                    text: 'delete'
                                }]
                        }],
                        action: {
                            event: 'click',
                            function: removePhoto
                        }

                    }
                ]
            }
        ]
    };
    let figure = list.querySelector('figure');
    let currentNumber = list.children.length;
    if (figure) {
        list.insertBefore(makeItem(listItem, currentNumber), figure)
    }
    else {
        list.appendChild(makeItem(listItem, currentNumber));
    }
}

function makeItem(item, currentNumber) {

    let elem = document.createElement(item.tag);
    item.attributes.forEach(atr => {
        let keys = Object.keys(atr);
        let key = keys[0];
        if (key == 'text') {
            elem.textContent = atr[key];
        }
        else if (key == 'data') {
            elem.dataset.number = currentNumber;
        }
        else {
            elem.setAttribute(key, atr[key])
        }

    });
    if (item.children) {
        item.children.forEach(child => {
            elem.appendChild(makeItem(child, currentNumber))
        });
    }
    if (item.action) {
        elem.addEventListener(item.action.event, item.action.function.call(null, currentNumber));
    }
    return elem;
}
