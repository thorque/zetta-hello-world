var Device = require('zetta-device');
var util = require('util');
var HM_Device = require('./hm_device');


var HM_Switch = module.exports = function (device) {
    HM_Device.call(this, device);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Switch, HM_Device);

HM_Switch.prototype.init = function (config) {
    this._init(config, handle_event);
    var self = this;
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    config
        .state('off')
        .when('off', {allow: ['turn-on']})
        .when('on', {allow: ['turn-off']})
        .map('turn-on', this.turnOn)
        .map("turn-off", this.turnOff)
        .monitor(this.state);

    //noinspection JSUnresolvedVariable
    hm_client.methodCall('getValue', [this.device_address, "STATE"], function (err, data) {
        if (err){
            self.log("Error retrieving initial state of hm_switch  [" + self.device_name + "]", err);
        }
        self.state = (data)? "on": "off";
    });
};

HM_Switch.prototype.turnOn = function (cb) {
    var self = this;
    this.state = 'on';
    //noinspection JSUnresolvedVariable
    hm_client.methodCall('setValue', [this.device_address, "STATE", true], function (err, data) {
        self.log("Fired turnOn for hm_switch [" + self.device_name + "]");
    });
    cb();
};

HM_Switch.prototype.turnOff = function (cb) {
    var self = this;
    this.state = 'off';
    //noinspection JSUnresolvedVariable
    hm_client.methodCall('setValue', [this.device_address, "STATE", false], function (err, data) {
        self.log("Fired turnOff for hm_switch [" + self.device_name + "]");
    });
    cb();
};

var handle_event = function (event_data, self) {
    if (event_data[1] == self.device_address && event_data[2] == "STATE") {
        self.log("Consumed event for hm_switch [" + self.device_name + "] "+event_data);
        self.state = (event_data[3]) ? "on" : "off";
    }
    return "";
};