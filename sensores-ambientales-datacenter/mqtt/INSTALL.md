# Manual de instalación del servicio para obtener información del estado de los sensores ambientales (Backend)
## Instalación de programas basicos y librerias
```sh
sudo apt-get update
sudo apt-get install -y curl
sudo apt-get install -y git

sudo apt-get install -y libzmq3-dev
sudo apt-get install -y libkrb5-dev
```
## Instalación de Node
```sh
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```
## Descargar el codigo del backend
Clonar la aplicación del repositorio de GitLab

```sh
git clone hhttps://github.com/kiritodeveloper/sis-data-manage/tree/master/sensores-ambientales-datacenter

```
**Nota.-** Si obtiene el mensaje: *"serve certificate verification failed"*, introducir el siguiente comando:

```sh
git config --global http.sslverify false
```
## Compilar el programa
Ingresar a la carpeta del codigo fuente en especifico a la carpeta **mqtt**

```sh
cd sensores-ambientales-datacenter
cd mqtt
```

Instalar las dependencias necesarias

```sh
cd librerias
npm install
```
## Instalacion de MongoDB
Instalamos el gestor de base e iniciamos el servicio
### Actualizamos repositorios
Primero actualizamos los repositorios para poder instalar mongo

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

sudo apt-get update
```
Instalar mongodb 

```sh
sudo apt-get install -y mongodb-org

sudo service mongod start
```
### Creamos la base de datos
Ejecutar los siguientes scripts

```sh
cd ..
cd ..
cd mongo
cd sensores
mongo principal.js
cd ejemplo
mongo principal.js
```
```sh
cd ..
cd ..
cd usuarios
mongo principal.js
cd ejemplo
mongo principal.js
```
## Probar los scripts
Probar la ejecución de cada script para verificar que funcionen correctamente.
**Nota.-** Para que estos scripts funcionen correctamente: 
* Todos estos scripts deben estar instalados en el dispositivo.
* Todos los conectores deben esta montados segun el manual de montaje de dispositivos.

```sh
cd ..
cd ..
cd ..
cd mqtt

node suscriptores/subMosca.js

node suscriptores/subSensorBD.js

node suscriptores/subActuadorBD.js

node suscriptores/subDisparadorTemperatura.js

node suscriptores/subDisparadorHumedad.js

node suscriptores/subDisparadorHumo.js

node suscriptores/subActuador.js

node suscriptores/subGpio.js
```
## Instalar el programa como servicio
Si los anteriores scripts funcionan correctamente levantarlos todos como servicios utilizando *forever*
### Configurar forever
Configurar las aplicaciones segun la carpeta en donde se encuentre instalado el programa
```sh
pwd
```
Prestar atención en la ruta que se muestra, sera algo parecido a: */home/jaimito/sensores-ambientales-datacenter* este sera utilizado para el archivo de configuración del **forever**
Editar el archivo *sensores-ambientales-datacenter.json*
```sh
nano forever/sensores-ambientales-datacenter.json
```
Cambiar el **souceDir** de todos los parametros segun corresponda
```json
[
  {
    "uid": "ServidorMosca",
    "append": true,
    "watch": true,
    "script": "subMosca.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "SensorBD",
    "append": true,
    "watch": true,
    "script": "subSensorBD.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "ActuadorBD",
    "append": true,
    "watch": true,
    "script": "subActuadorBD.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "DisparadorTemperatura",
    "append": true,
    "watch": true,
    "script": "subDisparadorTemperatura.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "DisparadorHumedad",
    "append": true,
    "watch": true,
    "script": "subDisparadorHumedad.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "DisparadorHumo",
    "append": true,
    "watch": true,
    "script": "subDisparadorHumo.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "Actuador",
    "append": true,
    "watch": true,
    "script": "subActuador.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  },
  {
    "uid": "GPIO",
    "append": true,
    "watch": true,
    "script": "subGpio.js",
    "sourceDir": "/home/jaimito/sensores-ambientales-datacenter/mqtt/suscriptores"
  }
]
```
Ejecutar todos los scripts con forever
```sh
sudo npm install forever -g
forever start forever/sensores-ambientales-datacenter.json
```
Si todo salio correctamente los servicios ya fueron levantados y pueden ser probados con el frontend

**Nota.-** Por defecto el usuario es *demo* y la contraseña *arcon412*