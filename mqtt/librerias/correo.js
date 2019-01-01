var os = require('os');
var moment = require('moment');
var mail = require('sendmail')();

var Correo = function (mensaje, detinatario, remitente) {
  remitente = typeof remitente !== 'undefined' ? remitente : 'datacenter@adsib.gob.bo';
  destinatario = typeof destinatario !== 'undefined' ? destinatario : ['djimenez@adsib.gob.bo'];
  mensaje = typeof mensaje !== 'undefined' ? mensaje : 'Sin texto';
  mail({
    from: remitente,
    to: destinatario.join(','),
    subject: 'Evento Datacenter',
    content: mensaje + os.EOL + 'Fecha: ' + moment().format('DD/MM/YYYY') + os.EOL + 'Hora: ' + moment().format('HH:mm')
  });
}

module.exports = Correo;
