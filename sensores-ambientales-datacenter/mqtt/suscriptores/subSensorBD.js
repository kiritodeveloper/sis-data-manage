var Suscriptor = require('../librerias/suscriptor.js');

var suscriptor = new Suscriptor('suscriptor-sensores-bd');
suscriptor.escuchar('sensores/+/+');
