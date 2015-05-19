//var Device = require('zetta-device');
var util = require('util');
var HM_Device = require('./hm_device');


var HM_Thermostat = module.exports = function(device) {
    this.actual_temperature = 0;
    this.set_temperature = 0;
    HM_Device.call(this, device);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Thermostat, HM_Device);

HM_Thermostat.prototype.init = function(config) {
    var self = this;
    this._init(config, handle_event);
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    config
        .monitor('actual_temperature')
        .monitor('set_temperature');


    //noinspection JSUnresolvedVariable
    hm_client.methodCall('getParamset', [this.device_address, "VALUES", 0], function (err, data) {
        if (err){
            self.log("Error retrieving initial temperature of hm_temperature  [" + reference.device_name + "]", err);
        }

        for (var value in data){
            if ((typeof value) != "undefined"){
                self[value.toLowerCase()] = data[value];
            }
        }
    });
};

var handle_event = function (event_data, self) {
    if (event_data[1] == self.device_address) {
        switch (event_data[2]){
            case "ACTUAL_TEMPERATURE":
                self.log("Consumed event for hm_thermostat [" + self.device_name + "] "+event_data);
                self.actual_temperature = event_data[3];
                break;
            case "SET_TEMPERATURE":
                self.log("Consumed event for hm_thermostat [" + self.device_name + "] "+event_data);
                self.set_temperature = event_data[3];
                break;
            default:
                self.log("No event found for hm_thermostat [" + self.device_name + "] "+event_data);
        }
    }
    return "";
};

