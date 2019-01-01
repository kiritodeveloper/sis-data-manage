var mqtt = require('mqtt');

var Mosquito = function (id) {
  this.id = typeof id !== 'undefined' ? id : 'mosquito-cliente';
};

Mosquito.prototype.conectar = function (usuario, clave, servidor, puerto) {
  configuracion = {
    host: servidor || 'localhost',
    port: puerto || 1883,
    keepalive: 65000,
    connectTimeout: 65000,
    clientId: this.id || 'mosquito-cliente',
    username: usuario || 'mosquito',
    password: clave || '0000'
  };
  this.cliente = mqtt.connect(configuracion);
  console.log(this.id + ' conectado a ' + configuracion.host + ':' + configuracion.port);
};

Mosquito.prototype.suscribir = function (topico, callback) {
  topico = typeof topico !== 'undefined' ? topico : 'topico/prueba';
  console.log('Escuchando: ' + topico);
  this.cliente.subscribe(topico);
  this.cliente.on("message", function (topico, mensaje) {
    console.log([topico, mensaje].join(": "));
    callback(topico, Number(mensaje.toString()));
  });
};

Mosquito.prototype.desuscribir = function (topico) {
  topico = typeof topico !== 'undefined' ? topico : 'topico/prueba';
  console.log('Saliendo de: ' + topico);
  this.cliente.unsubscribe(topico);
};

Mosquito.prototype.publicar = function (topico, mensaje, callback) {
  topico = typeof topico !== 'undefined' ? topico : 'topico/prueba';
  mensaje = typeof mensaje !== 'undefined' ? mensaje : 'mensaje_prueba';
  console.log([topico, mensaje].join(': '));
  this.cliente.publish(topico, mensaje);
  callback();
};

Mosquito.prototype.desconectar = function () {
  this.cliente.end();
};

module.exports = Mosquito;
