function crearColeccion(coleccion) {
  if(coleccion.opciones) {
    db.createCollection(coleccion.nombre, coleccion.opciones);
  }
  else {
    db.createCollection(coleccion.nombre);
  }
  print("--> Coleccion " + coleccion.nombre + " creada");
  if(coleccion.indices[0] == 'usuario' && coleccion.indices.length == 1) {
    db.getCollection(coleccion.nombre).createIndex({_id: 1}, {unique: true});
    print("~~~~> Llave índice " + coleccion.indices[0] + " creada en " + coleccion.nombre);
  }
  else if(coleccion.indices[0] == '_id' && coleccion.indices.length == 1) {
    db.getCollection(coleccion.nombre).createIndex({usuario: 1}, {unique: true});
    print("~~~~> Llave índice " + coleccion.indices[0] + " creada en " + coleccion.nombre);
  }
  else {
    db.getCollection(coleccion.nombre).createIndex({_id: 1}, {unique: true});
    print("~~~~> Llave índice " + coleccion.indices[0] + " creada en " + coleccion.nombre);
    db.getCollection(coleccion.nombre).createIndex({usuario: 1}, {unique: true});
    print("~~~~> Llave índice " + coleccion.indices[1] + " creada en " + coleccion.nombre);
  }
}

function crearColecciones(colecciones) {
  for(coleccion in colecciones) {
    crearColeccion(colecciones[coleccion]);
  }
}

crearColecciones(colecciones);