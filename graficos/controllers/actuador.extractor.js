var conf = require('../config/actuadores.js').extractor;       // <-------------------
var func = require('../models/tiempoReal.funciones.js');

exports.pagina = function (req, res) {
   res.render(conf.render, {
      title: conf.title
   });
};

exports.datosIniciales = function(req, res){
   func.enviarValoresIniciales(res, conf);
};

exports.tiempoReal = function (socket) {
   console.log('SocketIO: Usuario Conectado...');
   var sendNotification = function () {
      func.socketValorActual(socket, conf);
   };

   var sendNotificationInterval = setInterval(sendNotification, conf.periodo);

   socket.on('stopNotifications', function () {
      console.log('SocketIO: Notificaciones detenidas por el usuario...');
      clearInterval(sendNotificationInterval);
   });

   socket.on('disconnect', function () {
      console.log('SocketIO: Usuario Desconetado...');
      clearInterval(sendNotificationInterval);
   });
};