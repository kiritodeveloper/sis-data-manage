# Gráficos
## Como usarlo.
Instalar las dependencias 

```sh
$ npm install 
```

Para ejecutar el servidor
```sh
$ node app.js
```

## Configuración de la **Base de Datos**.
Modificar el archivo:
```
./config/database.js
```
## Configuración del **Socket** en el lado del **Cliente**.
Modificar el archivo:
```
./public/js/config/socket.js
```

## Modelo de colección de 'sensores': 
El modelo se observa en: 
```
./mongo/dispositivos/coleccionesPoblar/sensor.js
```
>Donde se agrego el atributo:
```js
"tipoMedicion": {
   "temperatura": false,
   "humedad": false,
   "humo": true
},
```
para su facil selección al momento de hacer la consulta a determonados tipos de sensores.

## Modelo de coleccion de 'sensores.sensorX.tipoMedicion':
>
```js
{
   "_id" : ISODate("2015-08-25T13:36:39Z"),
   "dato" : 133.49748882022686
}
```


