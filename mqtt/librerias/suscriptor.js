var Mosquito = require('./mqtt.js');
var Mongo = require('./mongo.js');

var Suscriptor = function (id) {
  id = typeof id !== 'undefined' ? id : 'cliente-suscriptor';
  Suscriptor.prototype.mongo = new Mongo();
  Suscriptor.prototype.mosquito = new Mosquito(id);
  Suscriptor.prototype.mosquito.conectar();
  this.escuchar = escuchar;
}

var escuchar = function (variable) {
  if (typeof variable == 'undefined') {
    console.log('Debe suscribirse a un tópico');
    process.exit(0);
  };
  Suscriptor.prototype.mosquito.suscribir(variable, function(topico, mensaje) {
    var coleccion = [topico.split('/')[0],topico.split('/')[1],topico.split('/')[2]].join('.');
    if (topico.split('/')[0] == 'sensores') {
      valor = Number(mensaje.toString());
    }
    else {
      valor = Boolean(Number(mensaje.toString()));
    };
    var dato = {
      _id: new Date(new Date() - new Date().getMilliseconds()),
      dato: valor
    };
    Suscriptor.prototype.mongo.insertar(coleccion, dato);
  });
};

module.exports = Suscriptor;
