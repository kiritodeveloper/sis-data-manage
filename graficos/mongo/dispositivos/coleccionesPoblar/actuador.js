var actuador_ejemplo = [
  {
    id: "ACO_BA03_01",
//    prendido: false,
//    automatico: true,
//    ultimo: ISODate("2015-06-20T20:23:43Z"),
    detalle: "Aire acondicionado de la sala de comuniación",
    observaciones: [
      {
        _id: ISODate("2015-06-20T20:23:43Z"),
        mensaje: "Tiene un sonido extraño"
      }
    ]
  },
  {
    id: "ACO_BA03_02",
    prendido: false,
    automatico: true,
    ultimo: ISODate("2015-06-21T20:23:43Z"),
    detalle: "Aire acondicionado de la sala de servidores",
    observaciones: [
      {
        _id: ISODate("2015-06-20T20:23:43Z"),
        mensaje: "No se apagara rápido"
      }
    ]
  },
  {
    id: "EXT_AF05_01",
    prendido: false,
    automatico: true,
    ultimo: ISODate("2015-06-21T22:23:43Z"),
    detalle: "Extractor sala de servidores",
    observaciones: [
      {
        _id: ISODate("2015-06-22T20:23:43Z"),
        mensaje: "No se apagara rápido"
      }
    ]
  },
  {
    id: "ALA_0000_01",
    prendido: false,
    automatico: true,
    ultimo: ISODate("2015-06-21T22:23:43Z"),
    detalle: "Extractor sala de servidores",
    observaciones: [
      {
        _id: ISODate("2015-06-22T20:23:43Z"),
        mensaje: "No se apagara rápido"
      }
    ]
  }
];

db.actuadores.insert(actuador_ejemplo);
print("--> Creados actuadores");
