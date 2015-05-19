var Device = require('zetta-device');
var util = require('util');


var HM_Device = module.exports = function (device) {
    this.device_name = device.NAME;
    this.device_address = device.ADDRESS;
    this.device_type = "hm_" + device.TYPE.toLowerCase();
    Device.call(this);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Device, Device);

HM_Device.prototype._init = function (config, event_handler) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var self = this;
    config
        .name(this.device_name)
        .type(this.device_type);

    //noinspection JSUnresolvedVariable
    hm_server.on('system.multicall', function (err, params, callback) {
        var response = [];

        for (var i = 0; i < params[0].length; i++) {
            //noinspection JSUnresolvedVariable
            switch (params[0][i].methodName) {
                case "event":
                    response.push(event_handler(params[0][i].params, self));
                    break;
                default:
                    response.push("");
                    break;
            }
        }
        callback(null, response);
    });

    //noinspection JSUnresolvedVariable
    hm_server.on('event', function (err, params, callback) {
        event_handler(params[1], self);
        callback("");
    });
};
