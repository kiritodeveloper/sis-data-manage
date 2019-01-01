var arduino_ejemplo = {
  id: "ARD_AC02_01",
  conectado: true,
  ip: "192.168.1.4",
  usuario: "ARD_AC02_01",
  clave: "adsib",
  sensores: [
    {
      _id: "DHT22_AC02_FI10",
      pin: [1]
    },
    {
      _id: "DHT22_AC02_FI40",
      pin: [2]
    }
  ],
  detalle: "Arduino del rack de adsib",
  observaciones: [
    {
      _id: new Date(),
      mensaje: "Se ha roto uno de los cables de conexión"
    }
  ]
};

db.arduinos.insert(arduino_ejemplo);
print("--> Creado arduino " + arduino_ejemplo._id);
