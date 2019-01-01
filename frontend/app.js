var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressJwt = require('express-jwt');
var mqtt = require('mqtt');

var configuracion = require('./app/configuracion');

var fs = require('fs');
var secreto = fs.readFileSync(configuracion.clave.publica);

var clienteSensores = mqtt.connect(configuracion.mqtt.servidor);
var clienteActuadores = mqtt.connect(configuracion.mqtt.servidor);

clienteSensores.on('connect', function () {
  clienteSensores.subscribe('sensores/+/+');
});

clienteSensores.on('message', function (sensor, mensaje) {
  io.sockets.emit('sensores', {
    sensor: sensor.split('/')[1],
    variable: sensor.split('/')[2],
    dato: mensaje.toString()
  });
});

clienteActuadores.on('connect', function () {
  clienteActuadores.subscribe('actuadores/+/eventos');
});

clienteActuadores.on('message', function (actuador, mensaje) {
  io.sockets.emit('actuadores', {
    actuador: actuador.split('/')[1],
    dato: mensaje.toString()
  });
});

var rutas = require('./app/rutas');

app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'publico')));

app.use('/app', expressJwt({
  secret: secreto,
  algorithms: [configuracion.jwt.algoritmo]
}));

app.use('/', rutas);

app.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.status(401).sendFile('index.html', {
      root: path.join(__dirname, '/publico')
    });
  }
});

var io = require('socket.io').listen(app.listen(configuracion.servidor.puerto, function() {
  console.log("Servidor iniciado en " + configuracion.servidor.socket);
}));
