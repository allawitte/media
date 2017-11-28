'use strict';

class MyWindow {
    constructor() {
        this.top = 0;
        this.left = 0;
        this.bottom = window.innerHeight;
        this.right = window.innerWidth;
    }
}

class Eye {
    constructor() {
        this.block = document.querySelector('.big-book__eye');
        this.pupil = new Pupil();
    }

    get rectangle() {
        return this.block.getBoundingClientRect();
    }

    get left() {
        return this.rectangle.left;
    }

    get right() {
        return this.rectangle.right;
    }

    get top() {
        return this.rectangle.top;
    }

    get bottom() {
        return this.rectangle.bottom;
    }

    get  eyeHeight() {
        return parseInt(window.getComputedStyle(this.block, null).getPropertyValue("height"));
    }

    get eyeWidth() {
        return parseInt(window.getComputedStyle(this.block, null).getPropertyValue("width"));
    }

    get eyeBorder() {
        return parseInt(window.getComputedStyle(this.block, null).getPropertyValue("border-width"));
    }

    get center() {
        return {
            x: this.left + this.eyeBorder + this.eyeWidth / 2,
            y: this.top + this.eyeBorder + this.eyeHeight / 2
        };
    }

    get closeRadius() {
        return Math.sqrt(Math.pow(this.eyeWidth / 2 + this.eyeBorder + 30, 2) + Math.pow(this.eyeHeight / 2 + this.eyeBorder + 30, 2));

    }
}

class Pupil {
    constructor() {
        this.pupil = document.querySelector('.big-book__pupil');
    }

    get width() {
        return parseInt(window.getComputedStyle(this.pupil, null).getPropertyValue("width"));
    }

    get height() {
        return parseInt(window.getComputedStyle(this.pupil, null).getPropertyValue("height"));
    }

    get left() {
        return parseInt(window.getComputedStyle(this.pupil, null).getPropertyValue("left"));
    }

    get top() {
        return parseInt(window.getComputedStyle(this.pupil, null).getPropertyValue("top"));
    }

    set pupilSize(size) {
        this.pupil.style.setProperty('--pupil-size', size);
    }

    set pupilShift(mouse) {
        this.pupil.style.setProperty('--pupil-x', mouse.x + '%');
        this.pupil.style.setProperty('--pupil-y', mouse.y + '%');
    }
}

class Mouse {
    constructor(e) {
        this.e = e;
        this.window = new MyWindow();
        this.eye = new Eye();
    }

    isNextToBorder() {
        if (this.e.clientX < 30) {
            return true;
        }
        if (this.e.clientX > this.window.right - 30) {
            return true;
        }
        if (this.e.clientY < 30) {
            console.log('less')
            return true;
        }
        if (this.e.clientY > this.window.bottom - 30) {
            return true;
        }
        return false;
    }

    isNextToEye() {
        let distanceFromCursorToEyeCenter = Math.sqrt(Math.pow((this.e.clientX - this.eye.center.x), 2) + Math.pow((this.e.clientY - this.eye.center.y), 2));
        if (distanceFromCursorToEyeCenter < this.eye.closeRadius) {
            return true;
        }
    }

    get cursorToEye() {
        console.log('this.e.clientX', this.e.clientX);
        console.log('this.eye.left', this.eye.left);
        console.log('this.eye.width', this.eye.eyeWidth);
        let horizontal = this.e.clientX < this.eye.left ?(1- this.e.clientX / this.eye.left) * (-30) :
            this.e.clientX > this.eye.left + this.eye.eyeWidth ? (1-(this.window.right - this.e.clientX) / (this.window.right - this.eye.right)) * 30 : 0;

        let vertical = this.e.clientY < this.eye.top ? (1-this.e.clientY / this.eye.top) * (-30) :
            this.e.clientY > this.eye.top + this.eye.eyeHeight ? (1-(this.window.bottom - this.e.clientY) / (this.window.bottom - this.eye.bottom)) * 30  : 0;
        return {
            x: horizontal,
            y: vertical
        }
    }
}
const body = document.querySelector('body');
body.addEventListener('mousemove', cursorHandler);

function cursorHandler(e) {
    const mouse = new Mouse(e);
    const pupil = new Pupil();
    if (mouse.isNextToEye()) {
        pupil.pupilSize = 3;
    }
    else if (mouse.isNextToBorder()) {
        pupil.pupilSize = 1;
    }
    else {
        pupil.pupilSize = 2;
    }
    pupil.pupilShift = mouse.cursorToEye;
}
