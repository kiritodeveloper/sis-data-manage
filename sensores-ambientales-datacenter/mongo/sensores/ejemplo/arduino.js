var arduino_ejemplo = {
  _id: "ARD_AC02_01",
  conectado: true,
  ip: "192.168.1.4",
  usuario: "ARD_AC02_01",
  clave: "adsib",
  sensores: [
    {
      _id: "DHT22_AC02_FD05",
      pin: 1
    },
    {
      _id: "DHT22_AC02_FD21",
      pin: 2
    },
    {
      _id: "DHT22_AC03_FD05",
      pin: 3
    },
    {
      _id: "DHT22_AC03_FD21",
      pin: 4
    }
  ],
  detalle: "Arduino del rack de adsib",
  observaciones: [
    {
      _id: new Date(),
      mensaje: "prueba"
    }
  ]
};

db.arduinos.insert(arduino_ejemplo);
print("--> Creado arduino " + arduino_ejemplo._id);
