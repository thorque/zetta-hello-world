var Device = require('zetta-device');
var util = require('util');


var Starter = module.exports = function (device) {
    this.device_name = device.ADDRESS;
    this.device_type = "hm_" + device.TYPE.toLowerCase();
    Device.call(this);
};
//noinspection JSUnresolvedFunction
util.inherits(Starter, Device);

Starter.prototype.init = function (config) {
    var self = this;
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    config
        .name(this.device_name)
        .type(this.device_type)
        .state('off')
        .when('off', {allow: ['turn-on']})
        .when('on', {allow: ['turn-off']})
        .map('turn-on', this.turnOn)
        .map("turn-off", this.turnOff)
        .monitor(this.state);

    //noinspection JSUnresolvedVariable
    hm_server.on('system.multicall', function (err, params, callback) {
        var response = [];

        for (var i = 0; i < params[0].length; i++) {
            switch (params[0][i].methodName) {
                case "event":
                    response.push(handle_event(params[0][i].params, self));
                    break;
                default:
                    response.push("");
                    break;
            }
            ;
        }
        callback(null, response);
    });

    //noinspection JSUnresolvedVariable
    hm_server.on('event', function (err, params, callback) {
        handle_event(params[1], self);
        callback("");
    });

    hm_client.methodCall('getValue', [this.device_name, "STATE"], function (err, data) {
        if (err){
            self.log("Error retrieving initial state of hm_switch  [" + reference.device_name + "]", err);
        }
        self.state = (data)? "on": "off";
        //console.log(data);
    });
};

Starter.prototype.turnOn = function (cb) {
    var self = this;
    this.state = 'on';
    //noinspection JSUnresolvedVariable
    hm_client.methodCall('setValue', [this.device_name, "STATE", true], function (err, data) {
        self.log("Fired turnOn for hm_switch [" + self.device_name + "]");
    });
    cb();
};

Starter.prototype.turnOff = function (cb) {
    var self = this;
    this.state = 'off';
    //noinspection JSUnresolvedVariable
    hm_client.methodCall('setValue', [this.device_name, "STATE", false], function (err, data) {
        self.log("Fired turnOff for hm_switch [" + self.device_name + "]");
    });
    cb();
};

var handle_event = function (event_data, reference) {
    if (event_data[1] == reference.device_name && event_data[2] == "STATE") {
        reference.log("Consumed event for hm_switch [" + reference.device_name + "] "+event_data);
        reference.state = (event_data[3]) ? "on" : "off";
    }
    return "";
};