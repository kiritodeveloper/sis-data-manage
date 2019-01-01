var usuario_ejemplo = {
  nombre: "Daniel Jiménez Jerez",
  usuario: "djimenez",
  _id: "djimenez",
  clave: hex_md5("1234"),
  permiso: "administrador"
};
var usuario_demo = {
  nombre: "Demo",
  usuario: "demo",
  _id: "demo",
  clave: '$2a$10$iUgR3JLfg5f1HRMTNUviYupcrPc4omlj3/6.aaUlmg9fFgxQHZdPm',
  permiso: "administrador"
};
//tipos de permisos: administrador, usuario
//donde el administrador puede dar de alta a los sensores
db.usuarios.insert(usuario_ejemplo);
print("--> Creado usuario " + usuario_ejemplo.nombre);
db.usuarios.insert(usuario_demo);
print("--> Creado usuario " + usuario_demo.nombre);