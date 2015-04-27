var Device = require('zetta-device');
var util = require('util');

function degToRad(x) {
  return x * ( Math.PI / 180 );
}

var Photocell = module.exports = function() {
  Device.call(this);
  this.intensity = 0;
};
util.inherits(Photocell, Device);

Photocell.prototype.init = function(config) {
  config
    .name('photocell')
    .type('photocell')
    .monitor('intensity');

  var self = this;
  var counter = 0;
  setInterval(function() {
    self.intensity = Math.sin(degToRad(counter)) + 1.0;
    counter += 15;
  }, 100);
};
