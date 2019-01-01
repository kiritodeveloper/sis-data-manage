var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var path = require('path');
var mongodb = require('mongodb');
var each = require('each');

var configuracion = require('./configuracion');

var mongoUsuarios = mongodb.MongoClient;
var bdUsuarios = configuracion.bd.usuarios;
var mongoSensores = mongodb.MongoClient;
var bdSensores = configuracion.bd.sensores;

var fs = require('fs');
var secreto = fs.readFileSync(configuracion.clave.privada);

router.post('/autenticar', function(req, res) {
  mongoUsuarios.connect(bdUsuarios, function(err, db) {
    db.collection('usuarios').find({_id: req.body.usuario}).toArray(function(error, usuario) {
      if(usuario.length > 0) {
        bcrypt.compare(req.body.clave, usuario[0].clave, function(error, verificado) {
          if(verificado) {
            var token = jwt.sign({
              _id: req.body.usuario
            }, secreto, {
              expiresIn: configuracion.jwt.expiracion,
              algorithm: configuracion.jwt.algoritmo
            });
            //console.log(jwt.decode(token));
            res.status(200).json({
              token: token
            });
          }
          else {
            res.status(401).json({
              msg: 'Contraseña incorrecta'
            });
          };
        });
      }
      else {
        res.status(401).json({
          msg: 'Nombre de usuario incorrecto'
        });
      };
    });
  });
});

router.get('/app/actuadores/ultimo', function(req, res) {
  var historial = [];
  mongoSensores.connect(bdSensores, function(error, db) {
    db.collection('actuadores').find({}, {'_id': 0, 'id': 1}).toArray(function(error, actuadores) {
      each(actuadores)
      .on('item', function(actuador, indice, siguiente) {
        db.collection(['actuadores', actuador.id, 'eventos'].join('.')).find({}).sort({'_id': -1}).limit(1).toArray(function(error, evento) {
          if(evento.length > 0) {
            resultado = {
              id: actuador.id,
              fecha: evento[0]._id,
              dato: evento[0].dato
            }
            historial.push(resultado);
          }
          siguiente();
        });
      })
      .on('end', function() {
        res.status(200).json(historial);
      });
    });
  });
});

router.get('/app/sensores/ultimo/temperatura', function(req, res) {
  var historial = [];
  mongoSensores.connect(bdSensores, function(error, db) {
    db.collection('sensores').find({}, {'_id': 0, 'id': 1}).toArray(function(error, sensores) {
      each(sensores)
      .on('item', function(sensor, indice, siguiente) {
        db.collection(['sensores', sensor.id, 'temperatura'].join('.')).find({}).sort({'_id': -1}).limit(1).toArray(function(error, evento) {
          if(evento.length > 0) {
            resultado = {
              id: sensor.id,
              fecha: evento[0]._id,
              dato: evento[0].dato
            }
            historial.push(resultado);
          }
          siguiente();
        });
      })
      .on('end', function() {
        res.status(200).json(historial);
      });
    });
  });
});

router.get('*', function(req, res) {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'publico')
  });
});

module.exports = router;
