var Mongo = require('../librerias/mongo.js');
var Mosquito = require('../librerias/mqtt.js');
var Correo = require('../librerias/correo.js');

var mongo = new Mongo();
var mosquito = new Mosquito('cliente-correos');
mosquito.conectar();

mosquito.suscribir('actuadores/+/eventos', function (topico, mensaje) {
  mongo.buscar('actuadores', {'id': topico.split('/')[1]}, {'detalle': 1}, null, null, function (docs) {
    if (docs.length == 0) {
      console.log('No existe el actuador ' + topico.split('/')[1]);
      process.exit(0);
    }
    else {
      if (Number(mensaje) == 1) {
        Correo(docs[0].detalle + ' encencido');
      }
      else if (Number(mensaje) == 0) {
        Correo(docs[0].detalle + ' apagado');
      }
      else {
        Correo(docs[0].detalle + mensaje);
      };
    };
  });
});
