var ip_backend='127.0.0.1';

exports.bd = {
  usuarios: 'mongodb://'+ip_backend+':27017/usuarios',
  sensores: 'mongodb://'+ip_backend+':27017/sensores_control_ambiental_datacenter'
}

exports.clave = {
  privada: 'cert/servidor.key',
  publica: 'cert/servidor.crt'
}

exports.jwt = {
  expiracion: '1d',
  algoritmo: 'RS256'
}

exports.servidor = {
  socket: 'http://'+ip_backend+':3000',
  puerto: 3000
}

exports.mqtt = {
  servidor: 'mqtt://'+ip_backend+':1883'
}
