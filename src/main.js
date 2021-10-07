const overlay = document.querySelector('.overlay');
const boxes = document.querySelectorAll('.box');
const fields = document.querySelectorAll('.field');
const timeEl = document.querySelector('.time h3');
const endModal = document.querySelector('.end-modal');
const startModal = document.querySelector('.start-modal');
const buttonPlay = document.querySelector('.button-area .button.play');
const buttonPause = document.querySelector('.button-area .button.pause');

let game, timeInterval;
let time = 0;

function init() {
    startModal.style.display = 'none';

    game = new Game();

    runTimer();
}

function runTimer() {
    timeInterval = setInterval(() => {
        if (!game.end) {
            time++;

            let min = ~~(time / 60);
            let sec = ~~(time - (min * 60));
            
            timeEl.innerHTML = `${formatTime(min)}:${formatTime(sec)}`;
        } else {
            clearInterval(timeInterval);
        }
    }, 1000);
}

function formatTime(time) {
    return (time < 10) ? `0${time}` : time;
}

function pause() {
    overlay.style.display = 'block';
    buttonPlay.style.display = 'block';
    buttonPause.style.display = 'none';
    
    clearInterval(timeInterval);
}

function play() {
    overlay.style.display = 'none';
    buttonPlay.style.display = 'none';
    buttonPause.style.display = 'block';
    
    runTimer();
}