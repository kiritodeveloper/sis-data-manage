var historial_raspberry_ejemplo = [
  {
    _id: ISODate("2015-05-20T20:23:43Z"),
    prendido: true
  },
  {
    _id: ISODate("2015-06-20T20:23:43Z"),
    prendido: false
  }
];

db.raspberries.RAS_AG06_01.eventos.insert(historial_raspberry_ejemplo);
print("~~~~> Creado historial de " + historial_raspberry_ejemplo._id + " de raspberry");