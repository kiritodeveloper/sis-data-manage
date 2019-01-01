var app = angular.module('myapp', []);

app.controller('controlador1', function ($scope, $http) {
	// obtiene los sensores a graficar.
	$http.get('/db/sensores_Humo_Hab')                   //  <----------------------
		.success(function(datosIniciales){
/******************************** rickshaw - inicio ********************************************************/		
      var configuracionDelGrafico ={
         ancho:900,
         alto:500,
         muestras:120,									//numero de muestras en pantalla
         timeInterval:1000,							//periodo de actulizacion de grafico y datos (en milisegundos)
         renderer:'line',
//         interpolation:'step-after',            // step-after, cardinal, linear, basis 
//         preview: true,                         
         timeBase: new Date(),                  //tiempo inicial
         sensoresIniciales: datosIniciales.sensores,
         muestrasIniciales: datosIniciales.muestras   // tiene que cumplir: muestrasIniciales <= muestras 
      };

      graficarTiempoReal(configuracionDelGrafico,config.socketHumo);       // <----------------
/******************************** rickshaw - fin ********************************************************/		
	});
});
