var Suscriptor = require('../librerias/suscriptor.js');

var suscriptor = new Suscriptor('suscriptor-actuadores');
suscriptor.escuchar('actuadores/+/+');
