var Device = require('zetta-device');
var util = require('util');


var HM_Thermostat = module.exports = function(device) {
    this.device_name = device.ADDRESS;
    //noinspection JSUnresolvedVariable
    this.device_type = "hm_"+((TYPE_MAP[device.TYPE])? TYPE_MAP[device.TYPE]: device.TYPE);
    this.actual_temperature = 0;
    this.set_temperature = 0;
    Device.call(this);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Thermostat, Device);

HM_Thermostat.prototype.init = function(config) {
    var self = this;
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    config
        .name(this.device_name)
        .type(this.device_type)
        .monitor('actual_temperature')
        .monitor('set_temperature');

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

    //noinspection JSUnresolvedVariable
    hm_client.methodCall('getParamset', [this.device_name, "VALUES", 0], function (err, data) {
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

var handle_event = function (event_data, reference) {
    if (event_data[1] == reference.device_name) {
        switch (event_data[2]){
            case "ACTUAL_TEMPERATURE":
                reference.log("Consumed event for hm_thermostat [" + reference.device_name + "] "+event_data);
                reference.actual_temperature = event_data[3];
                break;
            case "SET_TEMPERATURE":
                reference.log("Consumed event for hm_thermostat [" + reference.device_name + "] "+event_data);
                reference.set_temperature = event_data[3];
                break;
            default:
                reference.log("No event found for hm_thermostat [" + reference.device_name + "] "+event_data);
        }
    }
    return "";
};

