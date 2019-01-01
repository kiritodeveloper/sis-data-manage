var app = angular.module('myapp', []);

app.controller('controlador1', function ($scope, $http) {
	// obtiene los sensores a graficar.
	$http.get('/db/sensores_Temp_Hab')                   //  <----------------------
		.success(function(datosIniciales){
/******************************** rickshaw - inicio ********************************************************/		
      var configuracionDelGrafico ={
         ancho:900,
         alto:350,
         muestras:720,									//numero de muestras en pantalla
         timeInterval:1000,							//periodo de actulizacion de grafico y datos (en milisegundos)
         renderer:'line',                       // line, stack, area, bar ..
//         interpolation:'step-after',            // step-after, cardinal, linear, basis 
         preview: true,                         // 0 = sinPV, 1 = conPV, 2 = sinZoom .
         timeBase: new Date(),                  //tiempo inicial
         sensoresIniciales: datosIniciales.sensores,
         muestrasIniciales: datosIniciales.muestras   // tiene que cumplir: muestrasIniciales <= muestras 
      };

      graficarTiempoRealSensor(configuracionDelGrafico,config.socketTemperatura);  // <-------------
/******************************** rickshaw - fin ********************************************************/		
	});
});
