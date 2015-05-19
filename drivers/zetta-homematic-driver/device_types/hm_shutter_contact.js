var util = require('util');
var HM_Device = require('./hm_device');

var HM_Shutter_Contact = module.exports = function(device) {
    HM_Device.call(this, device);
};
//noinspection JSUnresolvedFunction
util.inherits(HM_Shutter_Contact, HM_Device);

HM_Shutter_Contact.prototype.init = function(config) {
    var self = this;
    this._init(config, handle_event);

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    config
        .state('off')
        .monitor('state');

    //noinspection JSUnresolvedVariable
    hm_client.methodCall('getValue', [this.device_address, "STATE"], function (err, data) {
        if (err){
            self.log("Error retrieving initial state of hm_shutter_contact  [" + self.device_name + "]", err);
        }
        self.state = (data)? "on": "off";
    });
};

var handle_event = function (event_data, self) {
    if (event_data[1] == self.device_address) {
        switch (event_data[2]){
            case "STATE":
                self.log("Consumed event for hm_shutter_contact [" + self.device_name + "] "+event_data);
                self.state = (event_data[3]) ? "on" : "off";
                break;
        }
    }
    return "";
};

