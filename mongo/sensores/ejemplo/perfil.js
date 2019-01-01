var perfil_ejemplo = [
  {
    seleccionado: true,
    temperatura: {
      maximo: 22,
      minimo: 18
    },
    humedad: {
      maximo: 70,
      minimo: 40
    },
    humo: {
      maximo: 10,
      minimo: 0
    },
    tiempo: {
      pre: 10,
      post: 2
    }
  },
  {
    seleccionado: false,
    temperatura: {
      maxima: 21,
      minima: 17
    },
    humedad: {
      maxima: 60,
      minima: 30
    },
    humo: {
      maximo: 15,
      minimo: 0
    },
    tiempo: {
      pre: 5,
      post: 1
    }
  }
];

db.perfiles.insert(perfil_ejemplo);
print("--> Creados perfiles");
