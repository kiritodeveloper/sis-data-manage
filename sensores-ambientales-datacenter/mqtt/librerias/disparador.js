var Mongo = require('./mongo.js');
var Mosquito = require('./mqtt.js');

var Disparador = function (id) {
  id = typeof id !== 'undefined' ? id : 'cliente-disparadores';
  Disparador.prototype.mongo = new Mongo();
  Disparador.prototype.mosquito = new Mosquito(id);
  Disparador.prototype.activar = true;
};

Disparador.prototype.aire = function (variable) {
  if (typeof variable == 'undefined') {
    console.log('Opciones: temperatura/humedad');
    process.exit(0);
  };
  Disparador.prototype.mosquito.conectar();
  Disparador.prototype.constantes = {};
  Disparador.prototype.constantes.valor = {};
  Disparador.prototype.constantes.tiempo = {};
  Disparador.prototype.constantes.topico = {};
  Disparador.prototype.valores = [];
  Disparador.prototype.mongo.buscar('perfiles', {"seleccionado": true}, {"_id": 0, "seleccionado": 0}, null, 1, function(docs) {
    Disparador.prototype.constantes.tiempo = docs[0].tiempo;
    Disparador.prototype.constantes.sensor = /DHT/;
    switch (variable) {
      case 'temperatura':
        Disparador.prototype.constantes.valor = docs[0].temperatura;
        break;
      case 'humedad':
        Disparador.prototype.constantes.valor = docs[0].humedad;
        break;
      default:
        console.log('Opciones: temperatura/humedad');
        process.exit(0);
    }
    Disparador.prototype.constantes.topico = 'sensores/+/' + variable;
    Disparador.prototype.mongo.buscar('actuadores', {"id": /EXT/, "prendido": true}, {"_id": 0, "id": 1}, null, null, function(docs) {
      if (!docs) {
        Disparador.prototype.mongo.buscar('actuadores', {"id": /ACO/, "prendido": true}, {"_id": 0, "id": 1}, null, null, function(docs) {
          if (!docs) {
            Disparador.prototype.mosquito.publicar('actuadores/aireAcondicionado', '0', function () {
              Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.post));
              Disparador.prototype.mosquito.publicar('actuadores/aireAcondicionado', '0', function () {
                Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.post));
                Disparador.prototype.mosquito.publicar('actuadores/extractor', '1', function () {
                  Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.post));
                  Disparador.prototype.mosquito.desconectar();
                });
              });
            });
            Disparador.prototype.aire(variable);
          }
          else {
            Disparador.prototype.enfriando(variable);
          }
        });
      }
      else {
        Disparador.prototype.calentando(variable);
      }
    });
  });
};

Disparador.prototype.enfriando = function (variable) {
  console.log('-> Enfriando');
  Disparador.prototype.mongo.buscar('sensores', {"id": Disparador.prototype.constantes.sensor, "conectado": true}, {"_id": 1}, null, null, function(docs) {
    Disparador.prototype.constantes.sensores = docs.length;
    Disparador.prototype.mosquito.suscribir(Disparador.prototype.constantes.topico, function (topico, mensaje) {
      if (Disparador.prototype.valores.length < Disparador.prototype.constantes.sensores) {
        Disparador.prototype.valores.push(Number(mensaje.toString()));
      }
      else if (Disparador.prototype.valores.length == Disparador.prototype.constantes.sensores) {
        if (Math.max.apply(Math, Disparador.prototype.valores) < Disparador.prototype.constantes.valor.minimo) {
          Disparador.prototype.mosquito.desuscribir(Disparador.prototype.constantes.topico);
          Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.pre));
          Disparador.prototype.mosquito.publicar('actuadores/aireAcondicionado', '0', function () {
            Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.post));
            Disparador.prototype.mosquito.publicar('actuadores/extractor', '1', function () {
              Disparador.prototype.mosquito.desconectar();
            });
          });
          Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.pre));
          Disparador.prototype.aire(variable);
        }
        else {
          Disparador.prototype.valores.shift();
          Disparador.prototype.valores.push(Number(mensaje.toString()));
        };
      };
      console.dir(Disparador.prototype.valores);
    });
  });
};

Disparador.prototype.calentando = function (variable) {
  console.log('-> Calentando');
  Disparador.prototype.mongo.buscar('sensores', {"id": Disparador.prototype.constantes.sensor, "conectado": true}, {"_id": 1}, null, null, function(docs) {
    Disparador.prototype.constantes.sensores = docs.length;
    Disparador.prototype.mosquito.suscribir(Disparador.prototype.constantes.topico, function (topico, mensaje) {
      if (Disparador.prototype.valores.length < Disparador.prototype.constantes.sensores) {
        Disparador.prototype.valores.push(Number(mensaje.toString()));
      }
      else if (Disparador.prototype.valores.length == Disparador.prototype.constantes.sensores) {
        if (Math.max.apply(Math, Disparador.prototype.valores) > Disparador.prototype.constantes.valor.maximo) {
          Disparador.prototype.mosquito.desuscribir(Disparador.prototype.constantes.topico);
          Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.post));
          Disparador.prototype.mosquito.publicar('actuadores/extractor', '0', function () {
            Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.pre));
            Disparador.prototype.mosquito.publicar('actuadores/aireAcondicionado', '1', function () {
              Disparador.prototype.mosquito.desconectar();
            });
          });
          Disparador.prototype.temporizador(Number(Disparador.prototype.constantes.tiempo.pre));
          Disparador.prototype.aire(variable);
        }
        else {
          Disparador.prototype.valores.shift();
          Disparador.prototype.valores.push(Number(mensaje.toString()));
        };
      };
      console.dir(Disparador.prototype.valores);
    });
  });
};

Disparador.prototype.alarma = function (variable) {
  if (typeof variable == 'undefined') {
    console.log('Opciones: humo');
    process.exit(0);
  };
  Disparador.prototype.mosquito.conectar();
  Disparador.prototype.constantes = {};
  Disparador.prototype.constantes.valor = {};
  Disparador.prototype.constantes.topico = {};
  Disparador.prototype.constantes.topico.publicacion = [];
  Disparador.prototype.valores = [];
  Disparador.prototype.mongo.buscar('perfiles', {"seleccionado": true}, {"_id": 0, "seleccionado": 0}, null, 1, function(docs) {
    Disparador.prototype.constantes.sensor = /MQT/;
    switch (variable) {
      case 'humo':
        Disparador.prototype.constantes.valor = docs[0].humo;
        break;
      default:
        console.log('Opciones: humo');
        process.exit(0);
    }
    Disparador.prototype.constantes.topico.suscripcion = 'sensores/+/' + variable;
    Disparador.prototype.constantes.topico.publicacion[0] = 'actuadores/alarma';
    console.dir(Disparador.prototype.constantes);
    Disparador.prototype.mongo.buscar('sensores', {"id": Disparador.prototype.constantes.sensor, "conectado": true}, {"_id": 1}, null, null, function(docs) {
      Disparador.prototype.constantes.sensores = docs.length;
      Disparador.prototype.mosquito.suscribir(Disparador.prototype.constantes.topico.suscripcion, function (topico, mensaje) {
        if (Disparador.prototype.valores.length < Disparador.prototype.constantes.sensores) {
          Disparador.prototype.valores.push(Number(mensaje.toString()));
        }
        else if (Disparador.prototype.valores.length == Disparador.prototype.constantes.sensores) {
          if (Math.max.apply(Math, Disparador.prototype.valores) > Disparador.prototype.constantes.valor.maximo) {
            Disparador.prototype.mosquito.desuscribir(Disparador.prototype.constantes.topico);
            Disparador.prototype.mosquito.publicar(Disparador.prototype.constantes.topico.publicacion[0], '1', function () {
              Disparador.prototype.mosquito.desconectar();
            });
            Disparador.prototype.alarma(variable);
          }
          else {
            Disparador.prototype.valores.shift();
            Disparador.prototype.valores.push(Number(mensaje.toString()));
          };
        };
        console.dir(Disparador.prototype.valores);
      });
    });
  });
};

Disparador.prototype.temporizador = function (tiempo) {
  tiempoInicial = Number(new Date().getMinutes());
  var a = true;
  do {
    tiempoActual = Number(new Date().getMinutes());
    if ((tiempoActual - tiempoInicial) <= tiempo) {
      a = true;
    }
    else {
      a = false;
    };
    if ((tiempoActual - tiempoInicial) < 0) {
      a = false;
    };
  } while (a);
};

module.exports = Disparador;
