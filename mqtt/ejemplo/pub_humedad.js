var Mosquito = require('../mqtt.js');

var mosquito = new Mosquito('publicador');
mosquito.conectar();
mosquito.publicar('humedad/ARD_AC02_01/DHT22_AC02_FI10', '48.1');
mosquito.desconectar();
