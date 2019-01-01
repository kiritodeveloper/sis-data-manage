var sensor_ejemplo = [
  {
    _id: "DHT22_AC02_FD05",
    conectado: true,
    tipoMedicion : ["temperatura", "humedad"],
    detalle: "Sensor inferior derecha rack adsib",
    observaciones: [
      {
        _id: new Date(),
        mensaje: "prueba"
      }
    ]
  },
  {
    _id: "DHT22_AC02_FD21",
    conectado: true,
    tipoMedicion : ["temperatura", "humedad"],
    detalle: "Sensor medio derecha rack adsib",
    observaciones: [
      {
        _id: new Date(),
        mensaje: "prueba"
      }
    ]
  },
  {
    _id: "DHT22_AC03_FD05",
    conectado: true,
    tipoMedicion : ["temperatura", "humedad"],
    detalle: "Sensor inferior derecha rack adsib",
    observaciones: [
      {
        _id: new Date(),
        mensaje: "prueba"
      }
    ]
  },
  {
    _id: "DHT22_AC03_FD21",
    conectado: true,
    tipoMedicion : ["temperatura", "humedad"],
    detalle: "Sensor medio derecha rack adsib",
    observaciones: [
      {
        _id: new Date(),
        mensaje: "prueba"
      }
    ]
  },
  {
    _id : "MQT2_DF03",
    conectado : true,
    tipoMedicion : ["humo"],
    detalle : "Sensor techo rack adsib",
    observaciones : [
        {
            _id : ISODate("2015-08-03T14:42:20.310Z"),
            mensaje : "prueba"
        }
    ]
  }
];

db.sensores.insert(sensor_ejemplo);
print("--> Creado sensor " + sensor_ejemplo);
