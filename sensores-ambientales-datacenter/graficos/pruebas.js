db.sensores.DHT22_AC02_FI10.temperatura.find({_id:{$lte: new Date()}},{_id:0,dato:1}).sort({_id:-1}).limit(120).toArray()

var array=[
   {10005:[{},{},{}]},
   {10002:[]},
   {10009:[]},
   {10010:[]},
   {10001:[]},
];

var otro2=[
   {fecha:10001,datos:[{"DH1231":1},{"DH1231":12},{"DH1231":13},{"DH1231":14}]},
   {fecha:10010,datos:[{"DH1231":4},{"DH1231":13},{"DH1231":14},{"DH1231":15}]},
   {fecha:10009,datos:[{"DH1231":5},{"DH1231":13},{"DH1231":14},{"DH1231":15}]},
   {fecha:10005,datos:[{"DH1231":6},{"DH1231":13},{"DH1231":14},{"DH1231":15}]}
];

otro2.sort(function(a,b){ var c = new Date(a.fecha); var d = new Date(b.fecha); return c-d; });

//oreden descendente 10, 9, ....
otro2.sort(function(a,b){
  return new Date(b.fecha) - new Date(a.fecha);
});

otro2.sort(function(a,b){
  return new Date(a.fecha) - new Date(b.fecha);
});

//consulta inicial
var serie1 = {
   dispositivo : 'DH1231',
   datos: [
      {_id:1233213.23,dato:23},
      {_id:1233214.23,dato:23},
      {_id:1233215.23,dato:23},
      {_id:1233216.23,dato:23}
   ]
};


//de cosnulta mongo

var uno=[
   {_id:10010.1,dato:1},
   {_id:10009.1,dato:2},
   {_id:10005.4,dato:3},
   {_id:10002.7,dato:4},
   {_id:10001.6,dato:5},
   
];

//asc
function redondeOrdenASC(series,fechaActual,muestras){
   var redondeado=[],terminado=[], datoAux=0;
   //redondeando.
   for(var i=0;i<series.length;i++){
      redondeado.push({fecha:Math.floor(serie[i]._id),dato:serie[i].dato});
   }
   //ordenando
   redondeado.sort(function(a,b){
     return new Date(b.fecha) - new Date(a.fecha);
   });
   //rellenando valores
  
   var i=0;
   for(var j=0 ; j<muestras ; j++){
      if(redondeado[i].fecha==fechaActual){
         datoAux=redondeado[i].dato;
         terminado.push(redondeado[i]);
         i++;
      }else{
         terminado.push({fecha:fechaActual,dato:datoAux});
      }
      fechaActual--;
   }
   return terminado;
}
redondeOrdenASC(uno,10010,10);
/*******************************************************************************************/
var uno=[
   {_id:10001.1,dato:1},
   {_id:10003.1,dato:2},
   {_id:10005.4,dato:3},
   {_id:10007.7,dato:4},
   {_id:10010.6,dato:5},
   
];
redondeOrdenDES(uno,10010,10);
/*******************************************************************************************/

/* redondea, ordena y rellena los datos de un sensor o dispositivo,
   en funcion al numero de muestras y a partir de la fechaActual. */

function redondeOrdenDES(serie, fechaActual, muestras, dispositivo){
   
   var redondeado=[], 
       terminado=[], 
       datoAux=0, 
       k=0, 
       kmax = serie.length,
       fechaAnterior=fechaActual-muestras;
   
   for( var i = 0 ; i < kmax ; i++ ){
      redondeado.push({
         fecha:Math.floor(serie[i]._id),
         dato:serie[i].dato
      });
   }
   
   redondeado.sort(function(a,b){
     return new Date(a.fecha) - new Date(b.fecha);
   });

   for(var j=0 ; j < muestras ; j++){
      fechaAnterior++;
      if(k<kmax){
         if(redondeado[k].fecha==fechaAnterior){
            datoAux=redondeado[k].dato;
            terminado.push(redondeado[k]);
            
            for( var l = 0 ; l < muestras ; l++ ){
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
   return terminado;
}

// genera una nueva serie con el mismo formate que el original, pero con 
//   datos corregidos. 

function correctorDeDatos(series, fechaActual, muestras){
   var corregido = [];
   for(var i=0;i<series.length;i++){
      corregido.push({name:series[i].name,datos:redondeOrdenDES(series[i].datos, fechaActual, muestras,series[i].name)});
   }
   return corregido;
}

/* datos a cargar para las  graficas */
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
}

//ejemplo de datos
var series = [
   {name:'DHasdsa1',datos:[{_id: 9991.1,dato: 1},{_id:10007.1,dato: 2},{_id:10007.4,dato: 3},{_id:10010.7,dato: 4},{_id:10189.6,dato: 155},{_id:10013.6,dato: 5},{_id:10014.6,dato: 50},{_id:10016.6,dato: 150}]},
   {name:'DHasdsa2',datos:[{_id:10002.1,dato: 6},{_id:10003.1,dato: 7},{_id:10006.4,dato: 8},{_id:10012.7,dato: 9},{_id:10014.6,dato:10}]},
   {name:'DHasdsa3',datos:[{_id: 9992.1,dato:11},{_id:10006.1,dato:12},{_id:10007.4,dato:13},{_id:10012.7,dato:14},{_id:10014.6,dato:15}]},
   {name:'DHasdsa4',datos:[{_id: 9992.1,dato:110},{_id:10006.1,dato:120},{_id:10007.4,dato:130},{_id:10012.7,dato:140},{_id:10014.6,dato:154}]},
   {name:'DHasdsa5',datos:[{_id:10003.1,dato:16},{_id:10005.1,dato:17},{_id:10007.4,dato:18},{_id:10009.7,dato:19},{_id:10011.6,dato:20}]},
];

aCargar(series,10030,30);

/*******************************************************************************************/

var series = [
{ DHT22_AC02_FI10: 1188.070612512529,
  DHT22_AC02_FI11: 1376.4529451658018,
  DHT22_AC02_FI12: 625.4846981205046,
  DHT22_AC02_FI13: 2001.6127555444837 },
{ DHT22_AC02_FI10: 251.1919467211701,
  DHT22_AC02_FI11: 448.3095692843199,
  DHT22_AC02_FI12: 506.9834790606983,
  DHT22_AC02_FI13: 816.8358205934055 },
{ DHT22_AC02_FI10: 744.0637130266987,
  DHT22_AC02_FI11: 860.5513414195739,
  DHT22_AC02_FI12: 557.453974741511,
  DHT22_AC02_FI13: 3376.7175229638815 },
{ DHT22_AC02_FI10: 15.47844932274893,
  DHT22_AC02_FI11: 723.1658931039274,
  DHT22_AC02_FI12: 596.3217442841269,
  DHT22_AC02_FI13: 848.1421726690605 },
{ DHT22_AC02_FI10: 1382.5328934937716,
  DHT22_AC02_FI11: 1592.7775653821882,
  DHT22_AC02_FI12: 534.8739654337987,
  DHT22_AC02_FI13: 537.8743262663484 },
{ DHT22_AC02_FI10: 1000.2089246185496,
  DHT22_AC02_FI11: 2529.9646295560524,
  DHT22_AC02_FI12: 184.73222580202855,
  DHT22_AC02_FI13: 2203.1894014824647 },
{ DHT22_AC02_FI10: 1337.233958769124,
  DHT22_AC02_FI11: 2095.8464631673414,
  DHT22_AC02_FI12: 189.5192922996357,
  DHT22_AC02_FI13: 809.4577371748164 },
{ DHT22_AC02_FI10: 1439.120768364286,
  DHT22_AC02_FI11: 634.2439629673027,
  DHT22_AC02_FI12: 650.8409372367896,
  DHT22_AC02_FI13: 3748.9987139450386 },
{ DHT22_AC02_FI10: 1410.6424870043993,
  DHT22_AC02_FI11: 376.52488961676136,
  DHT22_AC02_FI12: 369.31764750927687,
  DHT22_AC02_FI13: 3009.4116964568384 },
{ DHT22_AC02_FI10: 642.2398950066417,
  DHT22_AC02_FI11: 682.1626621540636,
  DHT22_AC02_FI12: 600.5916035920382,
  DHT22_AC02_FI13: 3275.9324979863595 },
{ DHT22_AC02_FI10: 918.7401126963086,
  DHT22_AC02_FI11: 216.4742599229794,
  DHT22_AC02_FI12: 55.11533464724198,
  DHT22_AC02_FI13: 2745.359303513542 },
{ DHT22_AC02_FI10: 986.0023181524593,
  DHT22_AC02_FI11: 534.1304656052962,
  DHT22_AC02_FI12: 550.718337201979,
  DHT22_AC02_FI13: 1331.6086955356877 }
];

/* para antes de graficar*/
function minimoDeSerieOriginal(series){
   var minN = undefined;
   for(var n in series){
      min = minimoDeSerie(series[n]);
      if( minN == undefined ) minN = min;
      minN = Math.min(minN, min);
   }
   if(isNaN(minN))minN=0;
   return minN;
}

function minimoDeSerie(serie){
   var min = undefined;
   for(var m in serie){
      if( min == undefined ) min = serie[m];
      min = Math.min(serie[m], min);
   }
   return min;
}

function minimoTiempoReal(serieOriginal, serieNueva){
   serie.shift()
   return minimoDeSerie(serie);
}
print(minimoM(cuatro));

/**********************************************************************************/

var series=[
{ DHT22_AC02_FI10: undefined,
  DHT22_AC02_FI11: 376.52488961676136,
  DHT22_AC02_FI12: undefined,
  DHT22_AC02_FI13: 3009.4116964568384 },
{ DHT22_AC02_FI10: undefined,
  DHT22_AC02_FI11: undefined,
  DHT22_AC02_FI12: undefined,
  DHT22_AC02_FI13: undefined },
{ DHT22_AC02_FI10: 918.7401126963086,
  DHT22_AC02_FI11: 216.4742599229794,
  DHT22_AC02_FI12: undefined,
  DHT22_AC02_FI13: 2745.359303513542  },
{ DHT22_AC02_FI10: 986.0023181524593,
  DHT22_AC02_FI11: 534.1304656052962,
  DHT22_AC02_FI12: 550.718337201979,
  DHT22_AC02_FI13: 1331.6086955356877 }
];

function minimoDeSerie(serie){
   var min = undefined;
   for(var m in serie){
      if(serie[m]==undefined) continue;
      if( min == undefined ) min = serie[m];
      min = Math.min(serie[m], min);
   }
   return min;
}
var arrayMin=[];
for(var ma in series){
   arrayMin.push(minimoDeSerie(series[ma]));
}
arrayMin
minimoDeSerie(arrayMin);


var uno = function(){
   print("asdsad");
}
/****************************************************************************************/

var dispositivo = 'ALA';
db.actuadores.find({ $and:[{conectado: true},{id: new RegExp('^'+dispositivo) }]},{_id:0, id:1}).sort({id:1}).toArray()

/************************************************************************************************/

//expresiones regulares
var text = /^sensores/.test("sensores_control_ambiental_datacenter");
text

function (tipoDispositivo){
   var text = /^sensores/.test(tipoDispositivo);
   if(/^sensores/.test(tipoDispositivo)){
      return 'dato';
   }
   if(/^actuadores/.test(tipoDispositivo)){
      return 'prendido';
   }
}

/**********************************************************************************************/

var myRe = ;
if(myRe.test(coleccion)){
   doc[configdb.tipoDisp_tipoMed[j]]= undefined;
}

new RegExp('^'+'jose').test('luisjose')

/**********************************************************************************************/
var datos=[
{ "_id" : ISODate("2015-09-03T01:46:21Z"), "prendido" : true } ,
{ "_id" : ISODate("2015-09-03T01:46:22Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:23Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:24Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:25Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:26Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:27Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:28Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:29Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:30Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:31Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:32Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:33Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:34Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:35Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:36Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:37Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:38Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:39Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:40Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:41Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:42Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:43Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:44Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:46:45Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:46Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:47Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:48Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:49Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:50Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:51Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:52Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:53Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:54Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:55Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:56Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:57Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:58Z"), "prendido" : true },
{ "_id" : ISODate("2015-09-03T01:46:59Z"), "prendido" : false },
{ "_id" : ISODate("2015-09-03T01:47:00Z"), "prendido" : false }
];


   //nombreDato = configdb.tipoDisp_tipoMed[tipoDispositivo];

function cambiarNombreMedicion(datos, medicion){
   var retorno=[];
   if(medicion!='dato'){
      for(var m in datos){
         retorno.push({_id:datos[m]._id, dato:datos[m][medicion]});
      }
      return retorno;
   }else{
      return datos;
   }
}

cambiarNombreMedicion(datos,'prendido');


/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
var graficarTiempoReal = function(conf,socketDispositivo){

   var socket = io.connect(socketDispositivo);       //  <----------------------
   // socketNuevosDatos es una variable auxiliar para enviar los nuevos datos a graficar.
   var socketNuevosDatos;
   socket.on('rickshaw', function (data) {
      socketNuevosDatos=data.mensaje;
   });

//   var vistaPrevia=conf.preview || false;
   conf.interpolation = conf.interpolation || 'cardinal';
   var graph = new Rickshaw.Graph( {
      element: document.getElementById("chart"),
      width: 	conf.ancho,
      height: 	conf.alto,
      renderer: conf.renderer,
      preserve: true,
      interpolation: conf.interpolation,
      min: 'auto',
      series: new Rickshaw.Series.FixedDuration(conf.sensoresIniciales, undefined, {
         timeInterval: conf.timeInterval,
         maxDataPoints: conf.muestras,
         timeBase: Math.floor((conf.timeBase - conf.muestrasIniciales.length*conf.timeInterval)/1000),	//se resta el numero de muestras para la grafica inicial
      }) 
   });

   // se obtiene el promedio de una serie de datos introducidos.
//   function promedioD(datos){
//      var suma=0,i,j=0;
//      for(i in datos){
//         if(i!='Promedio'){
//            suma+=datos[i];
//            j++;
//         }
//      }
//      return suma/j;
//   }
   
   // ploblar la serie inial 
   var n;
   for( n in conf.muestrasIniciales ){
//      conf.muestrasIniciales[n].Promedio = promedioD(conf.muestrasIniciales[n]);
      graph.series.addData(conf.muestrasIniciales[n]);
   }
   
   var datoAnterior = conf.muestrasIniciales[n];
//   delete datoAnterior.Promedio;
   
   graph.render();

   var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph,
      xFormatter: function(x) {
         return new Date(x * 1000).toString();
      }
   } );

   var legend = new Rickshaw.Graph.Legend( {
      graph: graph,
      element: document.getElementById('legend')
   } );

   var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      graph: graph,
      legend: legend
   } );

   var order = new Rickshaw.Graph.Behavior.Series.Order( {
      graph: graph,
      legend: legend
   } );

   var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
      graph: graph,
      legend: legend
   } );

   var ticksTreatment = 'glow';

   var xAxis = new Rickshaw.Graph.Axis.Time( {
      graph: graph,
      ticksTreatment: ticksTreatment,
      timeFixture: new Rickshaw.Fixtures.Time.Local()
   } );

   xAxis.render();

//   var yAxis = new Rickshaw.Graph.Axis.Y( {
//      graph: graph,
//      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
//      ticksTreatment: ticksTreatment
//   } );
//
//   yAxis.render();

//   if(vistaPrevia==1){
//      var preview = new Rickshaw.Graph.RangeSlider.Preview( {
//         graph: graph,
//         element: document.getElementById('preview')
//      } );
//   }else if(vistaPrevia==0){
//      var preview = new Rickshaw.Graph.RangeSlider( {
//         graph: graph,
//         element: document.getElementById('preview'),
//      } );
//   }
   
   
   function reconoceIndefinido(anterior, actual){
      // se asume que 'anterior' tiene valores 
      var retornar = {};
//      delete anterior.Promedio;
      if(typeof actual=='object'){
         //etapa de agregacion 
         for(var p in actual){
            if(actual[p]==undefined){
               if(anterior[p]==undefined){
                  retornar[p]=0;   
               }else{
                  retornar[p]=anterior[p];
               }
            }else{
               retornar[p]=(actual[p])?1:0;
            }
         }
         //etapa de comparacino
         for(var r in anterior){
            if(retornar[r]==undefined){
               retornar[r]=anterior[r];
            }
         }
      }else{
         retornar=anterior;
      }
      return retornar;
   }
   
   // prueba ....
   //socketNuevosDatos={DHT22_AC02_FI10: undefined, DHT22_AC02_FI11: 3000, DHT22_AC02_FI12: undefined, DHT22_AC02_FI13: 3000, DHT22_AC02_FI14: 10};
   
   var iv = setInterval( function() {
      var data = reconoceIndefinido(datoAnterior,socketNuevosDatos);
      datoAnterior = data;
//      data.Promedio = promedioD(data);
      graph.series.addData(data);
      graph.render();
   }, conf.timeInterval );
}


/************************************************************************************************/
var uno = new Date()
db.actuadores.ACO_BA03_01.eventos.find({_id:{$lte: new Date()}},{}).limit(1).sort({_id:-1})
uno = new Date() - uno

var uno = new Date();
db.actuadores.ACO_BA03_01.eventos.findOne({_id:{$lte: new Date()}});
uno = new Date() - uno;

//fechas periodicas
db.actuadores.ACO_BA03_01.eventos.find({_id:Math.floor({$mod: [1000,0]})});

Math.floor()

/************************************************************************************************/

{ $and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]}
//consulta periodica


var perido=1000;
var consulta=function(){
   var fecha = Math.floor(this._id/1000);
   if(fecha%10==0)
   return this._id;

}

db.actuadores.ACO_BA03_01.eventos.find({$where:consulta})

// periodos.



//****************************************************************************************

var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;
var consulta=function(fechaActual,fechaInicial){ 
   if( this._id >= new Date(fechaInicial) && this._id <= new Date(fechaActual))
      if(Math.floor(this._id/1000)%10==0)
         return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta(fechaActual,fechaInicial))



//db.actuadores.ACO_BA03_01.eventos.find({$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}},{$where:consulta}]})
//db.actuadores.ACO_BA03_01.eventos.find({$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}],$where:consulta})


db.actuadores.ACO_BA03_01.eventos.find(function(){ var fecha = Math.floor(this._id/1000); return fecha%10;})



/********************************/
//gruup

var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;
db.actuadores.ACO_BA03_01.eventos.group(
   {
     key: { _id: 1, prendido: 1 },
     cond: {$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]},
     reduce: function( curr, result ) {
                 result.total += curr.item.qty;
             },
     initial: { /*total : 0*/ }
   }
)

/****************************/
var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;

db.actuadores.ACO_BA03_01.eventos.group(
   {
     key: {_id: 1, prendido:1},
     cond: {$and:[{_id:{$lte: new Date()}},{_id:{$gte: new Date() -120*1000}}]},
     reduce: function(curr, result){},
     initial: {}
   }
)


var periodo = 1000;
var consulta=function(){ 
//   if( this._id >= new Date() && this._id <= new Date()-120*1000)
//      if(Math.floor(this._id/1000)%10==0 && this._id>=(new Date() - 120*1000) && this.id<= new Date())
//      if(Math.floor(this._id/1000)%10==0 && (this._id>=(new Date() - 120*1000) || this.id<= (new Date())))
      if(Math.floor(this._id/1000)%10==0 && this.id >= (new Date()-1000*120))
         return this._id;
}

//db.actuadores.ACO_BA03_01.eventos.find({$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}},{$where:consulta}]})
db.actuadores.ACO_BA03_01.eventos.find(consulta)


db.actuadores.ACO_BA03_01.eventos.find({_id:{$lte:new Date()}}).sort({_id:-1})


//*************primero

var consulta=function(){ 
   if(Math.floor(this._id/1000)%10==0 )
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta)

//----***********segundo

var consulta=function(){ 
   if(Math.floor(this._id/1000)%10==0 && this._id>=(new Date()-120*1000))
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta)


//----***********tercero

var consulta=function(){ 
   if(Math.floor(this._id/1000)%10==0 && this._id<=(new Date()-120*1000))
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta).sort({_id:-1})

//----***********cuarto

var consulta=function(){ 
   if(Math.floor(this._id/1000)%10==0 && this._id<=(new Date()))
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta).sort({_id:-1})

//----***********quinto    /// <---------------------funcional (sin parametros)

var consulta=function(){ 
   if(Math.floor(this._id/1000)%10==0 && this._id<=(new Date()) && this._id>=(new Date()-120*1000))
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta).sort({_id:-1})
/**********************************************************************************************/
/**********************************************************************************************/
/**********************************************************************************************/
//----***********sexto

var consulta=function(){
   if(Math.floor(this._id/1000)%10 == 0 && this._id >= (new Date()-120*1000) && this._id <= new Date())
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.find(consulta).sort({_id:-1})

/***********************************************************************************/
/***********************************************************************************/
/***********************************************************************************/
/***********************************************************************************/

var consulta=function(){
   if(Math.floor(this._id/1000)%10 == 0 && this._id >= (new Date()-120*1000) && this._id <= new Date())
      return this._id;
}

// primero
var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;
db.actuadores.ACO_BA03_01.eventos.group(
   {
     key: { _id: 1, prendido: 1 },
     cond: {$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]},
     reduce: function( curr, result ) {
//                 result.total += curr.item.qty;
             },
     initial: { /*total : 0*/ }
   }
)


// segudno

var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;

var consulta=function(){
   if(Math.floor(this._id/1000)%10 == 0 && this._id >= (new Date()-120*1000) && this._id <= new Date())
      return this._id;
}
db.actuadores.ACO_BA03_01.eventos.group(
   {
     key: { _id: 1, prendido: 1 },
     cond: consulta,
     reduce: function( curr, result ) {
//                 result.total += curr.item.qty;
             },
     initial: { /*total : 0*/ }
   }
)


/************** primero ************/

db.actuadores.ACO_BA03_01.eventos.find( { _id: { $ne: { $mod: [ 1000, 0 ] } } } )

/** segundo **/

db.actuadores.ACO_BA03_01.eventos.find( { _id: { $mod: [ 1, 0 ] } } )



/*********************************************************************************************/

var uno = {
   periodo: 1000,
   muestras: 120,
   tiempoInicial:function(){ return this.periodo*this.muestras;}
}
uno.tiempoInicial();

/**********************************************************************************************/

var consulta = function(){
   return this.dato;
}
db.sensores.DHT22_AC02_FI10.temperatura.find({$where:consulta},{_id:0})


/**********************************************************************************************/
//     cond: {$and:[{_id:{$lte: new Date()}},{_id:{$gte: new Date()-120*1000}}]},


var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;

db.sensores.DHT22_AC02_FI10.temperatura.group(
   {
     key: {},
     cond: {$and:[{_id:{$lte: new Date(fechaActual)}},{_id:{$gte: new Date(fechaInicial)}}]},
     reduce: function( curr, result ) {
                 result.min = Math.min(result.min,curr.dato);
                 result.max = Math.max(result.max,curr.dato);
                 result.Promedio = result.Promedio+curr.dato/120;
                 result.aux = result.Promedio+curr.dato/120;
                 result.contador++;
                 result.ultimaFecha;
             },
     initial: { Promedio:0, min:Infinity, max:0, contador:0}
   }
)
fechaActual.getTime()
fechaInicial


/**********************************************************************************************/
/**********************************************************************************************/
var texto = 'hola hola';
texto.replace(texto[0],texto[0].toUpperCase());
//texto:Hola hola

/**********************************************************************************************/
/**********************************************************************************************/

//var sensores= { max:0, min:Infinity, suma:0, contador:0, ceros:0};



var f1=new Date();
//var fechaInicial=new Date('2015-09-05T21:16:05.730Z');
//var fechaFinal=new Date("2015-09-06T21:16:04.730Z");



var fechaActual=new Date();
var fechaInicial=fechaActual - 120*1000;

var uno = db.sensores.DHT22_AC02_FI10.temperatura.group({
   cond: {$and:[{_id:{$lte: new Date(fechaFinal)}},{_id:{$gte: new Date(fechaInicial)}}]},
   reduce: function( curr, result ) {
      result.max = Math.max(result.max,curr.dato);
      result.min = Math.min(result.min,curr.dato);
      result.suma += curr.dato;
      result.contador++;
      result.med00 += (!curr.dato);
      result.men19 += (curr.dato>0&&curr.dato<19)?1:0;
      result.med19 += (curr.dato>=19&&curr.dato<20)?1:0;
      result.med20 += (curr.dato>=20&&curr.dato<21)?1:0;
      result.med21 += (curr.dato>=21&&curr.dato<22)?1:0;
      result.med22 += (curr.dato>=22&&curr.dato<23)?1:0;
      result.med23 += (curr.dato>=23&&curr.dato<24)?1:0;
      result.mayI24 += (curr.dato>=24)?1:0;
   },
   initial: {
      max:0, 
      min:Infinity, 
      suma:0, 
      contador:0, 
      med00:0,
      men19:0,
      med19:0,
      med20:0,
      med21:0,
      med22:0,
      med23:0,
      mayI24:0,
      }
})

uno[0]._id=fechaActual;
uno
var f2=new Date();
f2-f1;


/***********************************************************************************************/
/************************************************************************************************/



