var dirCrontab='/home/jsurco/proyADSIB/scrypts/graficos/sensores-ambientales-datacenter/graficos/crontab';
load(dirCrontab+"/configuracion/database.js");
load(dirCrontab+"/configuracion/conexion.js");
load(dirCrontab+"/configuracion/dispositivos.js");
load(dirCrontab+"/funciones/funcionesCada12mins.js");
realizarTareasAgregado('cada60mins', 'cada12mins', new Date(), 60*60, 0);

