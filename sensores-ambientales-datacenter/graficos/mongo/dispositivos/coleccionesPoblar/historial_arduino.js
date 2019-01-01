var historial_arduino_ejemplo = [
  {
    _id: ISODate("2015-05-20T20:23:43Z"),
    prendido: true
  },
  {
    _id: ISODate("2015-06-20T20:23:43Z"),
    prendido: false
  }
];

db.arduinos.ARD_AC02_01.eventos.insert(historial_arduino_ejemplo);
print("~~~~> Creado historial de " + historial_arduino_ejemplo._id + " de arduino");