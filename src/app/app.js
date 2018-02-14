import '../css/main.scss';

$(function () {

/** GLOBALS */

const context = new (window.AudioContext || window.webkitAudioContext)(),
    startBtn = $('.start'),
    display = $('.display'),
    button = $('.button'),
    strictMode = $('.strict-btn'),
    colorArr = ['red', 'yellow', 'green', 'blue'];


const win = require('./../sounds/success.mp3'),
    lose = require('./../sounds/lose.mp3'),
    red = require('./../sounds/red.m4a'),
    yellow = require('./../sounds/yellow.m4a'),
    green = require('./../sounds/green.m4a'),
    blue = require('./../sounds/blue.m4a'),

const  audioFiles = 
{
    lose: lose,
    win: win,
    yellow: yellow,
    green: green,
    blue: blue,
    red: red 
}

let simon = {},
    idxSeq = 0,
    count = 0;

/** Setup Defaults */
simon.setup = function (mode = 'Easy', strict = false) 
{
    this.sequence = [];  
    this.current = 1;    
    this.mode = mode;    
    this.strict = strict; 
    this.power = false;
    this.player = [];   
    this.gameOver = false;
}

/** Let's Play */

startBtn.on('click', function () {
    $(this).toggleClass('off');
    if ($(this).hasClass('off')) {
        powerOff();
    } else {
        printOut('Let\'s', 'Play');
        simon.setup();
        addSequence();
    }
})

// Add sequence to array
const addSequence = () => {
    simon.sequence.push(colorArr[Math.floor(Math.random() * 4)]);
    simon.interval = setInterval(playGame, level())
}


const playGame = () => {}

// End Game
const powerOff = () => {}



/** Helper Functions */

// display message to console
const printOut = (top, bottom) => {
    display.html(`<p>${top}<br><span class='enabled'>${bottom}</span></p>`);
}

// clear sequence timers
const clearTimers = () => {
    clearInterval(simon.interval);
    clearTimeout(simon.resetGame);
}

// set level depending on length of player current sequence
const level = () => {
    if (simon.current > 13) { return 400; }
    else if (simon.current > 9) { return 600; }
    else if (simon.current > 5) { return 800; }
    else { return 1000; }
}

/** Audio */

})