Conexión de Pines para Arduino UNO y EtherCard.

PIN10 -> CS
PIN11 -> SI
PIN12 -> SO
PIN13 -> SCK

Aclaración Topicos:

temperatura/
humedad/
fuego/

Codidicación Arduinos:

ARD_AC02_01
	ARD : Arduino
	A : Centro de Datos; B : Sala de Comunicaciones
	C : Bloque X
	02: Bloque Y
	_01: ID Arduino

ARD_(Sala)(BloqueX)(BloqueY)_(ID)

Codificación Sensores:

DHT22_AC02_FD31

	DHT22: Modelo
	A : Sala
	C : Bloque X
	02: Bloque Y
	F : Frontal; T: Trasero
	I : Izquierda; D : Derecha
	31: Número de Slot de Rack

DHT22_(Sala)(BloqueX)(BloqueY)_(Posición Frontal/Trasero)(Izquierda/Derecha)(Slot de Rack)

MQT2_AD07_01

	MQT2 : Modelo
	A : Sala
	D : Bloque X
	07 : Bloque Y

MQT2_(Sala)(BloqueX)(BloqueY)_(ID)


Codificacion Actuadores

AC0_BA03_01

	ACO : Aire Acondicionado

EXT_AD05_01

	EXT : Extractor
