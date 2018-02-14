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



})