var mosca = require('mosca');

var Mosca = function (id, host, puerto) {
  this.configuracion = {
    id: id || 'mosca',
    // host: host || 'localhost',
    port: puerto || 1883
  };
};

Mosca.prototype.iniciar = function () {
  var servidor = new mosca.Server(this.configuracion);

  servidor.on('ready', function() {
    console.log('\n');
    console.log('Servidor mqtt iniciado en ' + [servidor.opts.host, servidor.opts.port].join(':'));
  });

  servidor.on('clientConnected', function(cliente) {
    console.log('\n');
    console.log('Cliente conectado -> ', cliente.id);
    console.log('Hora: ', [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join(':'));
    var mensaje = {
      topic: 'clientes',
      payload: cliente.id,
      qos: 0,
      retain: false
    };
    servidor.publish(mensaje);
  });

  servidor.on('clientDisconnected', function(cliente) {
    console.log('\n');
    console.log('Cliente desconectado: ' + cliente.id);
    console.log('Hora: ', [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join(':'));
  });

  servidor.on('published', function(mensaje, cliente) {
    console.log('\n');
    console.log('Publicación -> ' + [mensaje.topic.toString(), mensaje.payload.toString()].join(': '));
    if (typeof cliente != 'undefined') {
      console.log('Cliente: ' + cliente.id);
    }
    console.log('Hora: ', [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join(':'));
  });

  servidor.on('subscribed', function(topico, cliente) {
    console.log('\n');
    console.log('Suscripción -> ' + [cliente.id.toString(), topico.toString()].join(': '));
    console.log('Hora: ', [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join(':'));
  });

  servidor.on('unsubscribed', function(topico, cliente) {
    console.log('\n');
    console.log('Desuscripción -> ' + [cliente.id.toString(), topico.toString()].join(': '));
    console.log('Hora: ', [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join(':'));
    console.log(topico.toString());
  });
};

module.exports = Mosca;
