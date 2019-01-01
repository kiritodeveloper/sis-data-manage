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
function obtenerDatosDeConsulta(coleccion, ultimaFecha, muestras, tiempoDeDesfase){   
   var primeraFecha=Number(ultimaFecha)-(muestras+tiempoDeDesfase)*1000;
   var datosObtenidosDeConsulta = db.getCollection(coleccion).find({ $and:[{_id:{$lt: new Date(ultimaFecha)}},{_id:{$gte: new Date(primeraFecha)}}]}).sort({_id:1}).toArray();
   return datosObtenidosDeConsulta;
}

// (3*A) apto para: (actuadores)
function cambiarNombreMedicion(datos, medicion){
   var retorno=[];
   if(medicion!='dato'){
      for(var m in datos){
         retorno.push({_id:datos[m]._id, dato:Number(datos[m][medicion])});
      }
      return retorno;
   }else{
      return datos;
   }
};

// para un correcto funcionamiento se necesita tomar 30 muestras adicionales 
// (4) apto para: (sensores, actuadores)
function redondaOrdenaEliminaRellena(serie, ultimaFecha, muestras, tiempoDeDesfase){
   
   var tiempoDeDesfase=tiempoDeDesfase||30;
   var muestras=muestras||120;
//   var fechaFinal=ultimaFecha||new Date();
   var fechaFinal=Number(ultimaFecha)||new Date();
   
   var redondeado=[], 
       descartado=[],
       terminado=[];

   // redondea fecha a segundos (elimina los milisegundos)
   for( var i in serie ){
      redondeado.push({
         fecha:Math.floor(serie[i]._id/1000),
         dato:serie[i].dato
      });
   }

   //odenar en forma ascendente
   redondeado.sort(function(a,b){
     return new Date(a.fecha) - new Date(b.fecha);
   });
   
   //eliminar valores repetidos en funcion a la fecha
   var auxAnterior=0;
   for(var o=0;o<redondeado.length ;o++){                             
      if(redondeado[o].fecha==auxAnterior){
         continue;
      }
      auxAnterior = redondeado[o].fecha;
      descartado.push(redondeado[o]);
   }
   
   // rellenar con valores anteriores
   fechaFinal=Number(Math.floor(fechaFinal/1000));
   var auxDatoAnterior=0;
   var auxFechaInicial=fechaFinal-(muestras+tiempoDeDesfase+1);
   for(var p=0, q=0 ; p< muestras+tiempoDeDesfase ; p++){
      auxFechaInicial++;
      if(q==descartado.length){
         terminado.push({fecha:auxFechaInicial,dato:auxDatoAnterior});
      }else if(descartado[q].fecha>auxFechaInicial){
         terminado.push({fecha:auxFechaInicial,dato:auxDatoAnterior});
      }else if(descartado[q].fecha==auxFechaInicial){
         terminado.push({fecha:auxFechaInicial,dato:descartado[q].dato});
         auxDatoAnterior=descartado[q].dato;
         q++;
      }else{ // (descartado[q].fecha < auxFechaInicial)
         auxFechaInicial--;
         q++;
         p--;
      }
   }
   terminado.splice(0,tiempoDeDesfase);
   return terminado;
};

// retorna: {Promedio: 123, max: 123, min: 0 ,...}
// (5*S) apto para: (sensores)
function datosAProcesarSensor(datos, ultimaFecha, adelantarEn){
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
      nuevosDatos.max=Math.max(nuevosDatos.max,datos[i].dato);
      nuevosDatos.min=Math.min(nuevosDatos.min,datos[i].dato);
      suma+=datos[i].dato;
      nuevosDatos.med00 += (!datos[i].dato);
      nuevosDatos.men19 += (datos[i].dato > 0&&datos[i].dato<19)?1:0;
      nuevosDatos.med19 += (datos[i].dato>=19&&datos[i].dato<20)?1:0;
      nuevosDatos.med20 += (datos[i].dato>=20&&datos[i].dato<21)?1:0;
      nuevosDatos.med21 += (datos[i].dato>=21&&datos[i].dato<22)?1:0;
      nuevosDatos.med22 += (datos[i].dato>=22&&datos[i].dato<23)?1:0;
      nuevosDatos.med23 += (datos[i].dato>=23&&datos[i].dato<24)?1:0;
      nuevosDatos.mayI24+= (datos[i].dato>=24)?1:0;
   }
   nuevosDatos.Promedio=suma/muestras;
   nuevosDatos._id=new Date(Number(ultimaFecha)+adelantarEn*1000);
   return nuevosDatos;
}

// (5*A) apto para: (actuadores)
function datosAProcesarActuador(datos, ultimaFecha, adelantarEn){
   var adelantarEn=adelantarEn||0;
   var nuevosDatos={ activo:0, inactivo: 0 };
   
   for(var i in datos){
      nuevosDatos.activo   += ( datos[i].dato)?1:0;
      nuevosDatos.inactivo += (!datos[i].dato)?1:0;
   }
   nuevosDatos._id=new Date(Number(ultimaFecha)+adelantarEn*1000);
   return nuevosDatos;
}

// (6) apto para: (sensores, actuadores)
function guardarDatosProcesados(coleccionDondeGuardar,datosProcesados){
   db.getCollection(coleccionDondeGuardar).insert(datosProcesados);
}

// apto para: (sensores)
function procesarInformacionDeSensor(coleccionAC, extensionDes, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var datos = obtenerDatosDeConsulta(coleccionAC, ultimaFecha, muestras, tiempoDeDesfase);
   var datosReAdecuados = redondaOrdenaEliminaRellena(datos, ultimaFecha, muestras, tiempoDeDesfase);
   var datosProcesados = datosAProcesarSensor(datosReAdecuados, ultimaFecha, adelantarEn);
   guardarDatosProcesados(coleccionAC+"."+extensionDes, datosProcesados);
}

// apto para: (actuadores)
function procesarInformacionDeActuador(coleccionAC, extensionDes, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var datos = obtenerDatosDeConsulta(coleccionAC, ultimaFecha, muestras, tiempoDeDesfase);
   datos = cambiarNombreMedicion(datos,'prendido');
   var datosReAdecuados = redondaOrdenaEliminaRellena(datos,ultimaFecha,muestras,tiempoDeDesfase);
   var datosProcesados = datosAProcesarActuador(datosReAdecuados, ultimaFecha, adelantarEn);
   guardarDatosProcesados(coleccionAC+"."+extensionDes,datosProcesados);
}

function realizarTareas(extension, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn){
   var adelantarEn = adelantarEn||0;
   
   var tiempoDeDesfase = tiempoDeDesfase||30;  
   var muestras = muestras||120;              
   var ultimaFecha = ultimaFecha||new Date();
   ultimaFecha = new Date(ultimaFecha.getTime()-ultimaFecha.getSeconds()*1000-ultimaFecha.getMilliseconds());
   var extension = extension||'cada2mins';

   var sensores = seleccionDispositivos(sensoresAbuscar);
   var actuadores = seleccionDispositivos(actuadoresAbuscar);
   
   for(var i in sensores){
      procesarInformacionDeSensor(sensores[i], extension, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn);
   }
   
   for(var j in actuadores){
      procesarInformacionDeActuador(actuadores[j], extension, ultimaFecha, muestras, tiempoDeDesfase, adelantarEn);
   }
   
}
