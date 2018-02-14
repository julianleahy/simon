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


const playGame = () => {
    if (idxSeq === simon.current) {
        clearInterval(simon.interval);
        idxSeq = 0;
        // check 'off' wasn't pressed during sequence
        if (simon.power) {
            powerOff();
        } else {
            // allow player to move
            button.toggleClass('disabled');
            printOut(simon.current, simon.mode);
        }
    } else {
        showSequence(simon.sequence[idxSeq]);
        idxSeq++;
    }
}

const showSequence = color => {
    const btn = $(`[data-color="${color}"]`);
    btn.fadeTo('fast', 0, () => {
        btn.fadeTo('fast', 1);
        playAudio(color);
    })
}

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

const playAudio = (sound) => {

    const source = context.createBufferSource();
    // Create the XHR which will grab the audio contents
    const request = new XMLHttpRequest();
    // Set the audio file src here
    request.open('GET', audioFiles[sound], true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    request.responseType = 'arraybuffer';

    request.onload = () => {
        // Decode the audio once the require is complete
        context.decodeAudioData(request.response, function (buffer) {
            source.buffer = buffer;
            // Connect the audio to source (multiple audio buffers can be connected!)
            source.connect(context.destination);
            // Simple setting for the buffer
            source.loop = false;
            // Play the sound!
            source.start(0);
        }, function (e) {
            console.log('Audio error! ', e);
        });
    }
    // Send the request which kicks off 
    request.send();
}

})