var Mongo = require('../librerias/mongo.js');
var Mosquito = require('../librerias/mqtt.js');
var Gpio = require('../librerias/gpio.js');

var mongo = new Mongo();
var mosquito = new Mosquito('cliente-gpio');
mosquito.conectar();

mosquito.suscribir('actuadores/+/eventos', function (topico, mensaje) {
  mongo.buscar('raspberries', {'actuadores': {'$elemMatch': {'id': topico.split('/')[1]}}}, {'actuadores.pin.$': 1, '_id': 0}, null, null, function (docs) {
    if (docs.length == 0) {
      console.log('No existe el actuador con el id ' + topico.split('/')[1]);
      process.exit(0);
    };
    for (i = 0; i < docs[0].actuadores[0].pin.length; i++) {
      new Gpio(Number(docs[0].actuadores[0].pin[i]), !(Number(mensaje)));
      console.log('GPIO-' + docs[0].actuadores[0].pin[i] + ': ' + Boolean(Number(mensaje.toString())));
    };
  });
});
