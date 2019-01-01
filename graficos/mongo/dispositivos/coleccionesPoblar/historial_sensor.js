var historial_sensor_temperatura_ejemplo = [
  {
    _id: ISODate("2015-05-20T20:23:43Z"),
    valor: 20.5
  },
  {
    _id: ISODate("2015-06-20T20:23:43Z"),
    valor: 21.8
  },
  {
    _id: ISODate("2015-07-20T20:23:43Z"),
    valor: 23.0
  },
  {
    _id: ISODate("2015-08-20T20:23:43Z"),
    valor: 24.9
  }
];


var historial_sensor_humedad_ejemplo = [
  {
    _id: ISODate("2015-05-20T20:23:43Z"),
    valor: 45.0
  },
  {
    _id: ISODate("2015-06-20T20:23:43Z"),
    valor: 45.1
  },
  {
    _id: ISODate("2015-07-20T20:23:43Z"),
    valor: 45.3
  },
  {
    _id: ISODate("2015-08-20T20:23:43Z"),
    valor: 46
  }
];

db.sensores.DHT22_AC02_FI10.temperatura.insert(historial_sensor_temperatura_ejemplo);
print("~~~~> Creado historial de temperatura de sensor");

db.sensores.DHT22_AC02_FI10.humedad.insert(historial_sensor_humedad_ejemplo);
print("~~~~> Creado historial de humedad de sensor");