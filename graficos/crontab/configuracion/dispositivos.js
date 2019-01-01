var tipoMedicion = {
   sensores   : 'dato',
   actuadores : 'prendido'
};
var sensoresAbuscar = [
   {tipoDispositivo:'sensores', disp: 'DHT', tipoDato:'temperatura'},
   {tipoDispositivo:'sensores', disp: 'DHT', tipoDato:'humedad'    },
   {tipoDispositivo:'sensores', disp: 'MQT', tipoDato:'humo'       }
];
var actuadoresAbuscar = [
   {tipoDispositivo:'actuadores', disp: 'ACO', tipoDato:'eventos'},
   {tipoDispositivo:'actuadores', disp: 'EXT', tipoDato:'eventos'},
   {tipoDispositivo:'actuadores', disp: 'ALA', tipoDato:'eventos'}
];
