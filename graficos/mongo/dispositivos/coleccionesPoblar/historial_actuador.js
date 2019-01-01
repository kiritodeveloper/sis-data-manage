var historial_actuador_ejemplo = [
  {
    _id: ISODate("2015-05-20T20:23:43Z"),
    prendido: true
  },
  {
    _id: ISODate("2015-06-20T20:23:43Z"),
    prendido: false
  }
];

db.actuadores.ACO_BA03_01.eventos.insert(historial_actuador_ejemplo);
print("~~~~> Creado historial de eventos de actuador");