var raspberry_ejemplo = {
  id: "RAS_AG06_01",
  conectado: true,
  ip: "192.168.1.2",
  arduinos: [
    {
      id: "ARD_AC02_01",
      tipo: "publicador"
    },
    {
      id: "ARD_AD07_01",
      tipo: "suscriptor"
    }
  ],
  actuadores: [
    {
      id: "ACO_BA03_01",
      pin: [17,27]
    },
    {
      id: "ACO_BA03_02",
      pin: [23,24]
    },
    {
      id: "EXT_AF05_01",
      pin: [4]
    },
    {
      id: "ALA_0000_01",
      pin: [18]
    }
  ],
  detalle: "Rasperry de control central de los sensores de ambiente del datacenter",
  observaciones: [
    {
      id: new Date(),
      mensaje: "Falta una tuerca en la parte inferior"
    }
  ]
};

db.raspberries.insert(raspberry_ejemplo);
print("--> Creado raspberry " + raspberry_ejemplo._id);
