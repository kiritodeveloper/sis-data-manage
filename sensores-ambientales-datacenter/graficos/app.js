var express = require('express'), 
	 app = express(),
	 index = require('./controllers/index'),
	 sensorT = require('./controllers/sensor.temperatura'),
	 sensorH = require('./controllers/sensor.humedad'),
	 sensorHu = require('./controllers/sensor.humo'),
	 actuadorACO = require('./controllers/actuador.aire'),
	 actuadorALA = require('./controllers/actuador.alarma'),
	 actuadorEXT = require('./controllers/actuador.extractor'),
	 http = require('http'),
	 server = http.createServer(app),
	 socket = require('socket.io'),
	 io = socket.listen(server),
	 MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', index.index);

app.get('/sensores/temperatura', sensorT.pagina);
app.get('/db/sensores_Temp_Hab', sensorT.datosIniciales);
var grafTemp = io.of('/grafTemp').on('connection', sensorT.tiempoReal);

app.get('/sensores/humedad', sensorH.pagina);
app.get('/db/sensores_Hum_Hab', sensorH.datosIniciales);
var grafHum = io.of('/grafHum').on('connection', sensorH.tiempoReal);

app.get('/sensores/humo', sensorHu.pagina);
app.get('/db/sensores_Humo_Hab', sensorHu.datosIniciales);
var grafHumo = io.of('/grafHumo').on('connection', sensorHu.tiempoReal);

app.get('/actuadores/aire', actuadorACO.pagina);
app.get('/db/actuadores_ACO_Hab', actuadorACO.datosIniciales);
var grafHumo = io.of('/grafACO').on('connection', actuadorACO.tiempoReal);

app.get('/actuadores/alarma', actuadorALA.pagina);
app.get('/db/actuadores_ALA_Hab', actuadorALA.datosIniciales);
var grafHumo = io.of('/grafALA').on('connection', actuadorALA.tiempoReal);

app.get('/actuadores/extractor', actuadorEXT.pagina);
app.get('/db/actuadores_EXT_Hab', actuadorEXT.datosIniciales);
var grafHumo = io.of('/grafEXT').on('connection', actuadorEXT.tiempoReal);

app.use(express.static(__dirname + '/public'));

server.listen(3000, function(){
	console.log("Puerto 3000 en uso.\n***********************************************************************");
});

