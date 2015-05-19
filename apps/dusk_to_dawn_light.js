module.exports = function(server) {
    var photocellQuery = server.where({ type: 'photocell' });
    var ledQuery = server.where({ type: 'led' });
    //var hm_switch1 = server.where({type: 'hm_1switch', name: "KEQ0037772:1"});
    var hm_switch1 = server.where({type: 'hm_switch', name: "Switch 1.1"});
    //var hm_switch2 = server.where({type: 'hm_switch', name: "JEQ0696747:1"});
    var hm_switch2 = server.where({type: 'hm_switch', name: "Switch 2.1"});

    //server.observe([photocellQuery, ledQuery, hm_switch1, hm_switch2], function(photocell, led, hm_switch1, hm_switch2){

    //    photocell.streams.intensity.on('data', function(m) {
    //        if(m.data < 0.5) {
    //            if (led.available('turn-on')) {
    //                led.call('turn-on');
    //                hm_switch1.call('turn-on');
    //                hm_switch2.call('turn-off');
    //            }
    //        } else {
    //            if (led.available('turn-off')) {
    //                led.call('turn-off');
    //                hm_switch1.call('turn-off');
    //                hm_switch2.call('turn-on');
    //            }
    //        }
    //    });
    //});

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

    //var heating_lr_temperature = server.where({type: 'hm_thermostat', name: "KEQ0427657:4"});
    var heating_lr_temperature = server.where({type: 'hm_thermostat', name: "Heating 1.1"});
    //hm_switch1 = server.where({type: 'hm_switch', name: "KEQ0037772:1"});

    server.observe([hm_switch2, heating_lr_temperature], function(hm_switch2, heating_lr_temperature){
        heating_lr_temperature.streams.set_temperature.on('data', function(m) {
            //console.log(m);
            if (m.data < 20){
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


    var bulb1 = server.where({type: 'huebulb', name: "Hue Bulb Hue Lamp 1"})
    server.observe([bulb1, heating_lr_temperature], function(bulb1, heating_lr_temperature){
        heating_lr_temperature.streams.set_temperature.on('data', function(m) {
           switch (m.data){
               case 17:
                   bulb1.call("color", "blue");
                   break;
               case 20:
                   bulb1.call("color", "green");
                   break;
               case 22:
                   bulb1.call("color", "red");
                   break;
           }
        });
    });


    var hm_window = server.where({type: "hm_shutter_contact"});
    //console.log("g123gg"+JSON.stringify(hm_switch1))
    server.observe([hm_window, hm_switch1, bulb1], function(hm_window, hm_switch1, bulb1){
        hm_window.streams.state.on('data', function(m) {
            console.log(m);
            if (m.data == "on"){
                if (hm_switch1.available("turn-off")){
                    hm_switch1.call('turn-off');
                }
                if (bulb1.available("turn-off")){
                    bulb1.call('turn-off');
                }
            }else{
                if (hm_switch1.available("turn-on")){
                    hm_switch1.call('turn-on');
                }
                if (bulb1.available("turn-on")){
                    bulb1.call('turn-on');
                }
            }
        });
    });

}



