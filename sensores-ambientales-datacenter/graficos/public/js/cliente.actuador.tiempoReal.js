var graficarTiempoRealActuador = function(conf,socketDispositivo){

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
      formatter: function(series, x, y, formattedX, formattedY, d) {
//         return series.name + ':&nbsp;' + formattedY;
         return "";
      },
      xFormatter: function(x) {
         
         return  new Date(x * 1000).toString();
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