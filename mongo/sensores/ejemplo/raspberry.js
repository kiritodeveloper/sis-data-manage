var raspberry_ejemplo = {
  _id: "RAS_AG06_01",
  conectado: true,
  ip: "192.168.1.161",
  arduinos: [
    {
      id: "ARD_AC02_01",
      tipo: "publicador"
    }
  ],
  actuadores: [
    {
      id: "ACO_BA03_01",
      pin: [4,17]
    },
    {
      id: "ACO_BA03_02",
      pin: [27,22]
    },
    {
      id: "EXT_AF05_01",
      pin: [18]
    },
    {
      id: "ALA_0000_01",
      pin: [23]
    }
  ],
  detalle: "Rasperry de control central de los sensores de ambiente del datacenter",
  observaciones: [
    {
      id: new Date(),
      mensaje: "prueba"
    }
  ]
};

db.raspberries.insert(raspberry_ejemplo);
print("--> Creado raspberry " + raspberry_ejemplo._id);
