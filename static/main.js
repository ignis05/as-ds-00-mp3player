var net;
var ui;
var music;

$(document).ready(() => {
    console.log("document ready");

    new Music();
    new Net();
    new Ui();
})

console.log("main.js loaded");