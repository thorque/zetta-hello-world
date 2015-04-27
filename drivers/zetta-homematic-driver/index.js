var Scout = require('zetta-scout');
var util = require('util');
var HM_Connector = require("./hm_connector");


//TODO Move this to an own file
global.items = ["KEQ0037772:1", "KEQ0427657:4", "JEQ0696747:1"];
global.TYPE_MAP = {CLIMATECONTROL_RT_TRANSCEIVER: "thermostat"};

var HM_Scout = module.exports = function () {
    Scout.call(this);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Scout, Scout);

HM_Scout.prototype.init = function (next) {
    var self = this;

    new HM_Connector(this.server)
        .init({server_host: "192.168.132.26", server_port: 9091, client_host: "192.168.132.28", client_port: 2001});

    //noinspection JSUnresolvedVariable
    hm_server.on('system.multicall', function (err, params, callback) {
        var response = [];

        for (var i = 0; i < params[0].length; i++) {
            switch (params[0][i].methodName) {
                case "newDevices":
                    console.log("newDevices: " + JSON.stringify(params[0][i].params));
                    response.push("");
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
    hm_server.on('newDevices', function (err, params, callback) {
        self.add_devices(params[1]);
    });

    next();
};

HM_Scout.prototype.add_devices = function (device_data) {
    var self = this;

    for (var data in device_data) {
        (function f() {
            var device = device_data[data];
            //noinspection JSUnresolvedVariable
            if (items.indexOf(device.ADDRESS) > -1) {
                //noinspection JSUnresolvedVariable
                var type = device.TYPE;

                if (TYPE_MAP[type]) {
                    type = TYPE_MAP[type];
                }

                self.server.info(device);

                var query = self.server.where({type: "hm_" + type.toLowerCase(), name: device.ADDRESS});
                self.server.find(query, function (err, results) {
                    if (results[0]) {
                        self.provision(results[0], require('./device_types/hm_' + type.toLowerCase()), device);
                    } else {
                        self.discover(require('./device_types/hm_' + type.toLowerCase()), device);
                    }
                });
            }
        })();
    }
};

