var gpio = require("gpio");

var Gpio = function (pin, estado, intervalo) {
  if (typeof pin == 'undefined') {
    console.log('No ha definido un pin GPIO');
    process.exit(0);
  };
  if (typeof estado == 'undefined') {
    console.log('No ha definido un estado para el pin GPIO');
    process.exit(0);
  };
  var intervalo = typeof intervalo !== 'undefined' ? intervalo : 200;
  var pin = gpio.export(pin, {
     direction: 'out',
     interval: 200,
     ready: function() {
       pin.set(Number(estado));
     }
  });
};

module.exports = Gpio;
