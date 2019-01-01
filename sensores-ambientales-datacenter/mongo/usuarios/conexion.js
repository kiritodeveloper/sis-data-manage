try {
  cnx = new Mongo(servidor + ":" + puerto);
  print("- Conectado a la base de datos " + bd);
}
catch(e) {
  print(e);
  print("- No se puede conetar a la base de datos " + bd);
  exit;
}
var db = cnx.getDB(bd);