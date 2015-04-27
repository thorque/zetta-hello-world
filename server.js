var zetta = require('zetta');
var LED = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var homematic = require('./drivers/zetta-homematic-driver');

var z = zetta()
    .name('Thorsten-Kamann')
    .use(LED)
    .use(Photocell)
    .use(homematic)
    .use(duskToDawnLight)
    //.link('http://hello-zetta.herokuapp.com/')
    .listen(1337, function(){
        console.log('Zetta is running at http://127.0.0.1:1337');
    });
