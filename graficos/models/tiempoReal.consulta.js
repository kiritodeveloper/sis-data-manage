var configdb = require('../config/database.js');
var mongojs = require('mongojs');
var db = mongojs(configdb.mongoJsDB);

exports.cargarValorActual=function(coleccion, conf, cb){
   var fechaActual = new Date() - Math.abs(conf.graficoInicial.retraso*1000);
   db.collection(coleccion)
      .findOne({_id:{$gte: new Date(fechaActual)}},{_id:0},function(err, doc){

      // retorna: doc = { dato : undefined }; o { prendido : undefined }
      if(doc == null){
         doc = {};
         doc[conf.nombreMedicion]= undefined;
      }
      
      // retorna: doc=valor; //eliminando el nombre de medicion
      doc = doc[conf.nombreMedicion];
      
      cb(err, doc);
   });
};

exports.cargarValoresIniciales = function(coleccion, conf, cb){
   var tiempoDeDesfase=20; //en segundos
   var fechaActual = new Date() - Math.abs(conf.graficoInicial.retraso*1000);
   var fechaInicial = fechaActual - (conf.graficoInicial.muestras+tiempoDeDesfase)*1000;     //modificar para multiplicar por periodo.
   db.collection(coleccion)
//      .find({ $and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]})
      .find({ $and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gt: new Date(fechaInicial)}}]})
      .sort({_id:1})
      .toArray(function(err ,doc ){
      cb(err,doc);
   });
};

exports.cargarDispositivosHabiles=function(tipoDispositivo, dispositivo, cb){
	db.collection(tipoDispositivo)
      .find({ $and:[{conectado: true},{id: new RegExp('^'+dispositivo)}]},{_id:0, id:1}).sort({id:1})
      .toArray(function(err,doc){
      if(err) console.log(err);
		cb(doc);
	});
};

// en proceso de contruccion.
exports.cargarValoresInicialesPeriodicamente = function(coleccion, conf, cb){
   var fechaActual = new Date() - Math.abs(conf.graficoInicial.retraso*1000);
   var fechaInicial = fechaActual - conf.graficoInicial.muestras*1000;     //modificar para multiplicar por periodo.
   db.collection(coleccion)
      .find({ $and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]})
      .sort({_id:1})
      .toArray(function(err ,doc ){
      cb(err,doc);
   });
};