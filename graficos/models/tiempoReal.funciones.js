/*****************************************************************************************/    
/********* funciones para socket y graficos en tiempo real - inicio **********************/
/*****************************************************************************************/ 
var consultadb = require('./tiempoReal.consulta.js');
var Q = require('q');

// retorna: [{fecha:100, dato:1},{fecha:101, dato: 2}, ... ];
function redondeOrdenDES(serie, fechaActual, muestras, dispositivo){
   var tiempoDeDesfase=20; //este valore es el mismo que se encuentra en 'cargarValoresIniciales'
   var redondeado=[], 
       terminado=[], 
       datoAux=0, 
       k=0, 
       kmax = serie.length,
       fechaAnterior=fechaActual-(muestras+tiempoDeDesfase);
   
   for( var i = 0 ; i < kmax ; i++ ){
      redondeado.push({
         fecha:Math.floor(serie[i]._id/1000),
         dato:serie[i].dato
      });
   }
   
   redondeado.sort(function(a,b){
     return new Date(a.fecha) - new Date(b.fecha);
   });

   for(var j=0 ; j < muestras+tiempoDeDesfase ; j++){
      fechaAnterior++;
      if(k<kmax){
         if(redondeado[k].fecha==fechaAnterior){
            datoAux=redondeado[k].dato;
            terminado.push(redondeado[k]);
            
            for( var l = 0 ; l < muestras+tiempoDeDesfase ; l++ ){
               k++;
               if(k==kmax){
                  break;
               }
               if(redondeado[k].fecha > fechaAnterior){
                  break;
               }
            }
         }else if(redondeado[k].fecha<fechaAnterior){
            fechaAnterior--;
            k++;
            j--;
         }else{
            terminado.push({fecha:fechaAnterior,dato:datoAux});
         }
      }else{
         terminado.push({fecha:fechaAnterior,dato:datoAux});
      }

   }
   terminado.splice(0,tiempoDeDesfase);
   return terminado;
};

// genera una nueva serie con el mismo formate que el original, pero con 
//   datos corregidos. 
// retorna: [{name:'disp1',datos:[{},{}, ... ]},{name:'disp2',datos:[{},{}, ... ]} ... ].
function correctorDeDatos(series, fechaActual, muestras){
   var corregido = [];
   for(var i=0;i<series.length;i++){
      corregido.push({name:series[i].name,datos:redondeOrdenDES(series[i].datos, fechaActual, muestras,series[i].name)});
   }
   return corregido;
};

/* datos a cargar para la  grafica */
// retorna: [{disp1:dato1, disp2:dato2,...},{disp1:dato1, disp2:dato2,...},...]
function aCargar(seriesOriginales, fechaActual, muestras){
   var datos = correctorDeDatos(seriesOriginales, fechaActual, muestras);
   var seriesACargar=[];
   for(var i = 0 ; i < muestras ; i++){
      var aux = {};
      for( var j = 0 ; j < datos.length ; j++ ){
         aux[datos[j].name] = datos[j].datos[i].dato;
      }
      seriesACargar.push(aux);
   }
   return seriesACargar;
};

// retorna: [{name:'disp1',ruta:'rutadeconsultadedisp1'},{name:'disp2',ruta:'rutadeconsultadedisp2'}, ...]
function coleccionesDeDispositivos(tipoDispositivo, nombreDispositivos, dispositivo){
   var i, colecciones = [];
   for (i in nombreDispositivos) {
      colecciones.push({
         name: nombreDispositivos[i].id,
         ruta: tipoDispositivo+"."+ nombreDispositivos[i].id + "." + dispositivo
      });
   }
   return (colecciones);
};

// retorna: [{name:'sensor1'},{name:'sensor2'}.... ,{name:'Promedio'}].
function nombresPromedio(datos) {
   var i, res = [];
   for (i in datos) {
      res.push({
         name: datos[i].id
      });
   }
//   res.push({
//      name: "Promedio"
//   });
   return res;
};

// retorna: [{_id:100,data:1},{_id:104,data:0}, ...]
function cambiarNombreMedicion(datos, medicion){
   var retorno=[];
   if(medicion!='dato'){
      for(var m in datos){
//         retorno.push({_id:datos[m]._id, dato:(datos[m][medicion])?((datos[m][medicion]>1)?datos[m][medicion]:1):0});//para otro tipo de dispositivo
         retorno.push({_id:datos[m]._id, dato:Number(datos[m][medicion])});
      }
      return retorno;
   }else{
      return datos;
   }
};

exports.socketValorActual = function(socket, conf){
   consultadb.cargarDispositivosHabiles(conf.tipoDispositivo, conf.dispositivo, function(data){
      var coleccionesAAgrupar = coleccionesDeDispositivos(conf.tipoDispositivo, data, conf.tipoMedicion);
      //obtiene los valores de la fecha actual de cada sensor habilitado 
      var promises=[], i;
      
      for(i in coleccionesAAgrupar){
         var funcAux = function(){
            var deferred = Q.defer();
            consultadb.cargarValorActual(coleccionesAAgrupar[i].ruta, conf, function(err, doc){
                if (err) deferred.reject(new Error(err));
                else     deferred.resolve(doc);
            });
            return deferred.promise;
         };
         promises.push(funcAux());
      }
      // retorna: { sensor1: 135.14184616040438, sensor2: 20.09241403429769, sensor3: 143.38965554488823 }
      var series={};
      Q.allSettled(promises)
      .then(function (results) {
          results.forEach(function (result,index) {
             if (result.state === "fulfilled") {
                 series[coleccionesAAgrupar[index].name]=result.value;
             } else {
                 var reason = result.reason;
             }
          });
          socket.emit('rickshaw', {
              mensaje: series
          });
      });
   });
};

exports.enviarValoresIniciales = function(res, conf){
   consultadb.cargarDispositivosHabiles(conf.tipoDispositivo, conf.dispositivo,function(data){
      var coleccionesAAgrupar = coleccionesDeDispositivos(conf.tipoDispositivo, data, conf.tipoMedicion);
      var resultado={};
      var promises=[],i;
      resultado.sensores=nombresPromedio(data);
      for(i in coleccionesAAgrupar){
         var funcAux = function(){
            var deferred = Q.defer();
            consultadb.cargarValoresIniciales(coleccionesAAgrupar[i].ruta, conf, function(err, doc){
                if (err) deferred.reject(new Error(err));
                else     deferred.resolve(doc);
            });
            return deferred.promise;
         };
         promises.push(funcAux());
      }
      // retorna: { sensor1: 135.1, sensor2: 20.0, sensor3: 143.3 }
      var series=[];
      Q.allSettled(promises)
      .then(function (results) {
          results.forEach(function (result,index) {
             if (result.state === "fulfilled") {
                 series.push({
                    name:coleccionesAAgrupar[index].name,
                    datos:cambiarNombreMedicion(result.value, conf.nombreMedicion)
                 });
             } else {
                 var reason = result.reason;
             }
          });
          series = aCargar(series, Math.floor(new Date()/1000 - Math.abs(conf.graficoInicial.retraso)), conf.graficoInicial.muestras);
          resultado.muestras = series;
          res.json(resultado);
      });
   });
};

//nuevo en proceso
exports.enviarValoresInicialesPeriodicos = function(res, conf){};

/*****************************************************************************************/    
/********* funciones para socket y graficos en tiempo real - fin *************************/
/*****************************************************************************************/ 


