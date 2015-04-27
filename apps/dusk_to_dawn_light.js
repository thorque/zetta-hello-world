module.exports = function(server) {
    var photocellQuery = server.where({ type: 'photocell' });
    var ledQuery = server.where({ type: 'led' });
    var hm_switch1 = server.where({type: 'hm_1switch', name: "KEQ0037772:1"});
    var hm_switch2 = server.where({type: 'hm_switch', name: "JEQ0696747:1"});

    server.observe([photocellQuery, ledQuery, hm_switch1, hm_switch2], function(photocell, led, hm_switch1, hm_switch2){

        photocell.streams.intensity.on('data', function(m) {
            if(m.data < 0.5) {
                if (led.available('turn-on')) {
                    led.call('turn-on');
                    hm_switch1.call('turn-on');
                    hm_switch2.call('turn-off');
                }
            } else {
                if (led.available('turn-off')) {
                    led.call('turn-off');
                    hm_switch1.call('turn-off');
                    hm_switch2.call('turn-on');
                }
            }
        });
    });


    hm_switch1 = server.where({type: 'hm_switch', name: "KEQ0037772:1"});
    hm_switch2 = server.where({type: 'hm_switch', name: "JEQ0696747:1"});


    server.observe([hm_switch1, hm_switch2], function(hm_switch1, hm_switch2){
        hm_switch1.streams.state.on('data', function(m) {
           console.log(m);
            if (m.data == "on"){
                if (hm_switch2.available("turn-off")){
                    hm_switch2.call('turn-off');
                }
            }else{
                if (hm_switch2.available("turn-on")){
                    hm_switch2.call('turn-on');
                }
            }
        });
    });

    var heating_lr_temperature = server.where({type: 'hm_thermostat', name: "KEQ0427657:4"});
    hm_switch1 = server.where({type: 'hm_switch', name: "KEQ0037772:1"});

    server.observe([hm_switch1, heating_lr_temperature], function(hm_switch1, heating_lr_temperature){
        heating_lr_temperature.streams.set_temperature.on('data', function(m) {
            console.log(m);
            if (m.data < 20){
                if (hm_switch1.available("turn-off")){
                    hm_switch1.call('turn-off');
                }
            }else{
                if (hm_switch1.available("turn-on")){
                    hm_switch1.call('turn-on');
                }
            }
        });
    });



}



