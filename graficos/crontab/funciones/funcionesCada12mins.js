'use strict';
// (1) apto para: (sensores, actuadores)
function seleccionDispositivos(dispositivos){
   var retornar=[];
   for(var i in dispositivos){
      retornar = retornar.concat(seleccionDispositivoHabiles(dispositivos[i].tipoDispositivo, dispositivos[i].disp, dispositivos[i].tipoDato));
   }
   return retornar;
}

// (2) apto para: (sensores, actuadores)
function seleccionDispositivoHabiles(tipoDispositivo, dispositivo, eventos){
   var dispEncontrados = db.getCollection(tipoDispositivo)
   .find({ $and:[{conectado: true},{id: new RegExp('^'+dispositivo) }]},{_id:0, id:1})
   .sort({id:1})
   .toArray();

   var dispARetornar=[]
   for(var n in dispEncontrados){
      dispARetornar.push(tipoDispositivo+"."+dispEncontrados[n].id+"."+eventos);
   }
   return dispARetornar;
}

// (3) apto para: (sensores, actuadores)
function obtenerDatosDeConsulta(coleccion, extensionOrigen, ultimaFecha, muestras, tiempoDeDesfase){
   var extensionOrigen=(extensionOrigen)?'.'+extensionOrigen:'';
   var primeraFecha=Number(ultimaFecha)-(muestras+tiempoDeDesfase)*1000;
   
   var datosObtenidosDeConsulta = db.getCollection(coleccion+extensionOrigen).find({ $and:[{_id:{$lt: new Date(ultimaFecha)}},{_id:{$gte: new Date(primeraFecha)}}]}).sort({_id:1}).toArray();
   
   return datosObtenidosDeConsulta;
}

// (4*S) apto para: (sensores)
function datosAProcesarSensorAgregado(datos, ultimaFecha, adelantarEn){
   var adelantarEn=adelantarEn||0;
   var nuevosDatos={
      Promedio:0,
      max:0,
      min:Infinity,
      med00 :0,
      men19 :0,
      med19 :0,
      med20 :0,
      med21 :0,
      med22 :0,
      med23 :0,
      mayI24:0,
   }
   var suma=0;
   var muestras=datos.length;
   for(var i in datos){
      nuevosDatos.max=Math.max(nuevosDatos.max,datos[i].max);
      nuevosDatos.min=Math.min(nuevosDatos.min,datos[i].min);
      suma+=datos[i].Promedio;
      nuevosDatos.med00 += datos[i].med00;
      nuevosDatos.men19 += datos[i].men19;
      nuevosDatos.med19 += datos[i].med19;
      nuevosDatos.med20 += datos[i].med20;
      nuevosDatos.med21 += datos[i].med21;
      nuevosDatos.med22 += datos[i].med22;
      nuevosDatos.med23 += datos[i].med23;
      nuevosDatos.mayI24+= datos[i].mayI24;
   }
   nuevosDatos.Promedio=suma/muestras;
   nuevosDatos._id=new Date(Number(ultimaFecha)+adelantarEn*1000);
   return nuevosDatos;
}

// (4*A) apto para: (actuadores)
function datosAProcesarActuadorAgregado(datos, ultimaFecha, adelantarEn){
   var adelantarEn=adelantarEn||0;
   var nuevosDatos={ activo:0, inactivo: 0 };
   
   for(var i in datos){
      nuevosDatos.activo   += datos[i].activo;
      nuevosDatos.inactivo += datos[i].inactivo;
   }
   nuevosDatos._id=new Date(Number(ultimaFecha)+adelantarEn*1000);
   return nuevosDatos;
}

// guarda los datos obtenidos y procesados de ... 
// (5) apto para: (sensores, actuadores)
function guardarDatosProcesados(coleccionDondeGuardar,datosProcesados){
   db.getCollection(coleccionDondeGuardar).insert(datosProcesados);
}

// apto para: (sensores)
function procesarInformacionDeSensorAgregado(coleccionAConsultar, extensionOrigen, extensionDestino, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var datos = obtenerDatosDeConsulta(coleccionAConsultar, extensionOrigen, ultimaFecha, muestras, tiempoDeDesfase);
   var datosProcesados = datosAProcesarSensorAgregado(datos,ultimaFecha, adelantarEn);
   guardarDatosProcesados(coleccionAConsultar+'.'+extensionDestino, datosProcesados);
}

// apto para: (actuadores)
function procesarInformacionDeActuadorAgregado(coleccionAConsultar, extensionOrigen, extensionDestino, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var datos = obtenerDatosDeConsulta(coleccionAConsultar, extensionOrigen, ultimaFecha, muestras, tiempoDeDesfase);
   var datosProcesados = datosAProcesarActuadorAgregado(datos, ultimaFecha, adelantarEn);
   guardarDatosProcesados(coleccionAConsultar+"."+extensionDestino, datosProcesados);
}


function realizarTareasAgregado(extensionDestino, extensionOrigen, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var adelantarEn=adelantarEn||0;           //en segundos
   var tiempoDeDesfase=tiempoDeDesfase||0;   //en segundos
   var muestras=muestras||60*12;             //en segundos  // por defecto para 12mins
   var ultimaFecha=ultimaFecha||new Date();
   ultimaFecha=new Date(ultimaFecha.getTime()-ultimaFecha.getSeconds()*1000-ultimaFecha.getMilliseconds());
   var extensionOrigen = extensionOrigen||'cada2mins';      // por defecto para 12mins
   var extensionDestino = extensionDestino||'cada12mins';   // por defecto para 12mins

   var sensores = seleccionDispositivos(sensoresAbuscar);
   var actuadores = seleccionDispositivos(actuadoresAbuscar);
   
   for(var i in sensores){
      procesarInformacionDeSensorAgregado(sensores[i], extensionOrigen, extensionDestino, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn);
   }
   
   for(var j in actuadores){
      procesarInformacionDeActuadorAgregado(actuadores[j], extensionOrigen, extensionDestino, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn);
   }
   
}
