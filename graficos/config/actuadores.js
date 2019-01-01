
exports.aireAcondicionado = {
   render: 'actuadores/aire',     // apartir del directorio (view/)
   title: 'Tiempo vs Evento',
   tipoDispositivo: 'actuadores',
   dispositivo: 'ACO',
   tipoMedicion: 'eventos',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'prendido'   
};

exports.extractor = {
   render: 'actuadores/extractor',     // apartir del directorio (view/)
   title: 'Tiempo vs Evento',
   tipoDispositivo: 'actuadores',
   dispositivo: 'EXT',
   tipoMedicion: 'eventos',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'prendido'   
};

exports.alarma = {
   render: 'actuadores/alarma',     // apartir del directorio (view/)
   title: 'Tiempo vs Evento',
   tipoDispositivo: 'actuadores',
   dispositivo: 'ALA',
   tipoMedicion: 'eventos',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'prendido'   
};

