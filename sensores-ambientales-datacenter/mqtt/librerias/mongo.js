var mongodb = require('mongodb').MongoClient;

var Mongo = function (bd, servidor, puerto) {
  this.servidor = typeof servidor !== 'undefined' ? servidor : 'localhost';
  this.puerto = typeof puerto !== 'undefined' ? puerto.toString() : '27017';
  this.bd = typeof bd !== 'undefined' ? bd : 'sensores_control_ambiental_datacenter';
};

Mongo.prototype.insertar = function (coleccion, dato) {
  if (typeof coleccion == 'undefined') {
    console.log('No ha especificado una colección');
    return 0;
  };
  if (typeof dato == 'undefined') {
    console.log('No ha introducido ningún dato');
    return 0;
  }
  else {
    mongodb.connect(['mongodb:/', [this.servidor, this.puerto].join(':'), this.bd].join('/'), function (err, db) {
      coleccion = db.collection(coleccion);
      coleccion.insert(dato, function (err, docs) {});
      db.close();
    });
  };
};

Mongo.prototype.buscar = function (coleccion, consulta, restriccion, ordenar, limitar, callback) {
  if (typeof coleccion == 'undefined') {
    console.log('No ha especificado una colección');
    return 0;
  }
  else {
    if (consulta == null) {
      consulta = {};
    };
    if (restriccion == null) {
      restriccion = {};
    };
    mongodb.connect(['mongodb:/', [this.servidor, this.puerto].join(':'), this.bd].join('/'), function (err, db) {
      coleccion = db.collection(coleccion);
      if (ordenar == null && limitar == null) {
        coleccion.find(consulta, restriccion).toArray(function (err, docs) {
          db.close();
          if (docs.length != 0) {
            return callback(docs);
          }
          else {
            return callback(false);
          };
        });
      }
      else if (ordenar != null && limitar == null) {
        coleccion.find(consulta, restriccion).sort(ordenar).toArray(function (err, docs) {
          db.close();
          if (docs.length != 0) {
            return callback(docs);
          }
          else {
            return callback(false);
          };
        });
      }
      else if (ordenar == null && limitar != null) {
        coleccion.find(consulta, restriccion).limit(limitar).toArray(function (err, docs) {
          db.close();
          if (docs.length != 0) {
            return callback(docs);
          }
          else {
            return callback(false);
          };
        });
      }
      else if (ordenar != null && limitar != null) {
        coleccion.find(consulta, restriccion).sort(ordenar).limit(limitar).toArray(function (err, docs) {
          db.close();
          if (docs.length != 0) {
            return callback(docs);
          }
          else {
            return callback(false);
          };
        });
      };
    });
  };
};

Mongo.prototype.actualizar = function (coleccion, consulta, dato, multiple) {
  if (typeof coleccion == 'undefined') {
    console.log('No ha especificado una colección');
    return 0;
  };
  if (typeof dato == 'undefined') {
    console.log('No ha introducido ningún dato');
    return 0;
  }
  else {
    if (typeof multiple == 'undefined') {
      multiple = true;
    };
    mongodb.connect(['mongodb:/', [this.servidor, this.puerto].join(':'), this.bd].join('/'), function (err, db) {
      coleccion = db.collection(coleccion);
      coleccion.update(consulta, {$set: dato}, {multi: multiple});
      db.close();
    });
  };
};

Mongo.prototype.eliminar = function (coleccion, consulta, unico) {
  if (typeof coleccion == 'undefined') {
    console.log('No ha especificado una colección');
    return 0;
  }
  else {
    if (typeof unico == 'undefined') {
      unico = false;
    };
    mongodb.connect(['mongodb:/', [this.servidor, this.puerto].join(':'), this.bd].join('/'), function (err, db) {
      coleccion = db.collection(coleccion);
      coleccion.remove(consulta, unico);
      db.close();
    });
  };
};

module.exports = Mongo;
