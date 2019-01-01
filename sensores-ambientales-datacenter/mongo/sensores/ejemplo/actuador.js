var actuador_ejemplo = [
  {
    "_id": "ACO_BA03_01",
    "conectado": false,
    "automatico": true,
    "detalle": "Aire acondicionado superior",
    "observaciones": [
      {
        "_id": new Date(),
        "mensaje": "prueba"
      }
    ]
  },
  {
    "_id": "ACO_BA03_02",
    "conectado": false,
    "automatico": true,
    "detalle": "Aire acondicionado inferior",
    "observaciones": [
      {
        "_id": new Date(),
        "mensaje": "prueba"
      }
    ]
  },
  {
    "_id": "EXT_AF05_01",
    "conectado": false,
    "automatico": true,
    "detalle": "Extractor",
    "observaciones": [
      {
        "_id": new Date(),
        "mensaje": "prueba"
      }
    ]
  },
  {
    "_id": "ALA_0000_01",
    "conectado": false,
    "automatico": true,
    "detalle": "Alarma exterior",
    "observaciones": [
      {
        "_id": new Date(),
        "mensaje": "prueba"
      }
    ]
  }
];

db.actuadores.insert(actuador_ejemplo);
print("--> Creados actuadores");
