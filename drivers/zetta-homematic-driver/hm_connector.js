var binrpc = require('binrpc');

var rpc_server_started = false;
var log = null;

global.hm_client = null;
global.hm_server = null;

var HM_Connector = module.exports = function(zetta_log_service) {
    log = zetta_log_service;
};

HM_Connector.prototype.init = function(config, callback) {
    //noinspection JSUndeclaredVariable
    hm_client = binrpc.createClient({
        host: config.client_host,
        port: config.client_port,
        path: '/'
    });

    if (!rpc_server_started){
        var self = this;
        //noinspection JSUndeclaredVariable
        hm_server = binrpc.createServer({ host: config.server_host, port: config.server_port });
        log.info("Homematic server listening on "+ config.server_host +":"+config.server_port);
        rpc_server_started = true;
    }

    hm_client.methodCall('init', ["xmlrpc_bin://"+config.server_host+":"+config.server_port, "hmm_0"], function(err, data) {
        if (err){
            log.error("Cannot initializing Homematic client.", err);
        }
    });
};