var Mongo = require('./mongo.js');
var Mosquito = require('./mqtt.js');

var Actuador = function (id) {
  id = typeof id !== 'undefined' ? id : 'cliente-actuadores';
  Actuador.prototype.mongo = new Mongo();
  Actuador.prototype.mosquito = new Mosquito(id);
  Actuador.prototype.mosquito.conectar();
};

Actuador.prototype.escuchar = function () {
  Actuador.prototype.mosquito.suscribir('actuadores/+', function (topico, mensaje) {
    if (Boolean(Number(mensaje.toString()))) {
      Actuador.prototype.activar(topico.split('/')[1]);
    }
    else {
      Actuador.prototype.desactivar(topico.split('/')[1]);
    };
  });
};

Actuador.prototype.activar = function (actuador, id) {
  switch (actuador) {
    case 'aireAcondicionado':
      actuador = /ACO/;
      break;
    case 'extractor':
      actuador = /EXT/;
      break;
    case 'alarma':
      actuador = /ALA/;
      break;
    default:
      return 0;
  };
  Actuador.prototype.mongo.buscar('actuadores', {"id": actuador, "prendido": true}, {"_id": 0, "id": 1}, null, null, function(docs) {
    if (!docs) {
      Actuador.prototype.mongo.buscar('actuadores', {"id": actuador, "prendido": false, "automatico": true}, {"_id": 0, "id": 1}, {"ultimo": 1}, 1,function (docs) {
        Actuador.prototype.mongo.actualizar('actuadores', {"id": docs[0].id}, {"prendido": true, "ultimo": new Date()}, false);
        Actuador.prototype.mosquito.publicar(['actuadores', docs[0].id, 'eventos'].join('/'), '1', function () {
          console.log('Prendiendo ' + docs[0].id);
        });
      });
    }
    else if (docs.length == 1) {
      console.log('Ya esta prendido ' + docs[0].id);
    }
    else {
      console.log('No hay actuadores disponibles');
    };
  });
};

Actuador.prototype.desactivar = function (actuador, id) {
  switch (actuador) {
    case 'aireAcondicionado':
      actuador = /ACO/;
      break;
    case 'extractor':
      actuador = /EXT/;
      break;
    case 'alarma':
      actuador = /ALA/;
      break;
    default:
      return 0;
  };
  Actuador.prototype.mongo.buscar('actuadores', {"id": actuador, "prendido": true}, {"_id": 0, "id": 1}, null, null, function (docs) {
    if (!docs) {
      console.log('Todos los actuadores están apagados');
    }
    else if (docs.length == 1) {
      Actuador.prototype.mongo.actualizar('actuadores', {"id": docs[0].id}, {"prendido": false}, false);
      Actuador.prototype.mosquito.publicar(['actuadores', docs[0].id, 'eventos'].join('/'), '0', function () {
        console.log('Apagando ' + docs[0].id);
      });
    }
    else if (docs.length > 1) {
      console.log('El sistema tiene prendidos ' + docs.length + ' actuadores');
    };
  });
};

module.exports = Actuador;
