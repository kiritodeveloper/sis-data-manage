// configuracion de los controladores

exports.temperatura = {
   render: 'sensores/temperatura',     // apartir del directorio (view/)
   title: 'Tiempo vs Temperatura',
   titleEvento: 'Tiempo vs Evento',
   titleActuador: 'Aire Acondicionado',
   tipoDispositivo: 'sensores',
   dispositivo: 'DHT',
   tipoMedicion: 'temperatura',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'dato'   
};

exports.humedad = {
   render: 'sensores/humedad',
   title: 'Tiempo vs Humedad',
   titleEvento: 'Tiempo vs Evento',
   titleActuador: 'Alarma',
   tipoDispositivo: 'sensores',
   dispositivo: 'DHT',
   tipoMedicion: 'humedad',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'dato'   
};

exports.humo = {
   render: 'sensores/humo',
   title: 'Tiempo vs Humo',
   titleEvento: 'Tiempo vs Evento',
   titleActuador: 'Extintor',
   tipoDispositivo: 'sensores',
   dispositivo: 'MQT',
   tipoMedicion: 'humo',
   graficoInicial: {
      muestras: 720,       // numero de puntos a graficar en pantalla
      retraso: 2          // (segundos)
   },
   graficoTiempoReal:{
   },
   periodo: 1000,           // (milisegundos) usado en 'graficoInicial' y en 'graficoTiempoReal'
   nombreMedicion:'dato'   
};

