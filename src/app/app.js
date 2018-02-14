import '../css/normalize.css';
import '../css/main.scss';
$(function () {
    const load = setTimeout(function(){
        $('body').addClass('loaded');
    },2000)

/** GLOBALS */

const context = new (window.AudioContext || window.webkitAudioContext)(),
    startBtn = $('.start'),
    display = $('.display'),
    button = $('.button'),
    strictMode = $('.strict-btn'),
    colorArr = ['red', 'yellow', 'green', 'blue'];


const  audioFiles = {
    win: require('./../sounds/success.mp3'),
    lose: require('./../sounds/lose.mp3'),
    red: require('./../sounds/red.m4a'),
    yellow: require('./../sounds/yellow.m4a'),
    green: require('./../sounds/green.m4a'),
    blue: require('./../sounds/blue.m4a')
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
            canPlayerClick();
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


/** Players Move */

button.on('click', function () {
    if (button.hasClass('disabled')) return;

    $(this).css('opacity', '0')
    const color = $(this).attr('data-color');
    simon.player.push(color);
    checkMatch(color);
    setTimeout(() => {
        $(this).css('opacity', '1');
    }, 200)
})


const checkMatch = (color) => {
    // check player seq matches generated seq
    if (simon.player[count] === simon.sequence[count]) {
        playAudio(color);
        // full sequence match
        if (simon.player.length === simon.sequence.length) {
            canPlayerClick();
            count = 0;
            simon.player = [];
            // increase current to get new color in sequence
            simon.current++;
            addSequence();
        } else { count++; }
        // wrong sequence
    } else {
        if (simon.strict) {
            // reset entire game
            simon.setup('Strict', true);
        } else {
            // reset player but retain sequence
            simon.player = [];
        }
        lose();
    }
}



/** Winners :) and Losers :() */

const lose = () => {
    canPlayerClick();
    playAudio('lose');
    printOut('0 0', '#');
    count = 0;
    simon.gameOver = true;
    simon.resetGame = setTimeout(function () {
        addSequence();
    }, 1000)
}

const winner = () => {
    printOut('You', 'Won!');
    setTimeout(() => {
        playAudio('win');
    }, 500)
    simon.setup();
    if (!button.hasClass('disabled')) canPlayerClick();
}


/** Modes */

// toggle strict mode
strictMode.on('click', function () {
    if (startBtn.hasClass('off')) return
    $(this).toggleClass('strict-on');
    if (simon.strict) {
        toggleMode('Easy');
    } else {
        toggleMode('Strict');
    }
    printOut(simon.current, simon.mode);
})



// End Game
const powerOff = () => {
    simon.power = true;
    printOut('', '');
    if (!button.hasClass('disabled')) { canPlayerClick() }
    // turn off strict mode for new start up
    $('.strict-btn').removeClass('strict-on');
}



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

const toggleMode = (mode) => {
    simon.mode = mode;
    simon.strict = !simon.strict;
}

// set level depending on length of player current sequence
const level = () => {
    if (simon.current > 13) { return 400; }
    else if (simon.current > 9) { return 600; }
    else if (simon.current > 5) { return 800; }
    else { return 1000; }
}

const canPlayerClick = () => button.toggleClass('disabled');

/** keep board centered */
let h = $(window).height();
    let p = Math.floor((h - 450)/2);

    $('body').css('padding-top', p + 'px');

    $(window).resize(function(){
        let h = $(window).height();
        let p = Math.floor((h - 450)/2);
        $('body').css('padding-top', p + 'px');
    })


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