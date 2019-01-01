var sensor_ejemplo = [
   {
      "id": "DHT22_AC02_FI12",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": true,
         "humedad": true,
         "humo": false
      },
      "detalle": "Sensor inferior izquierdo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-07-24T22:53:08.524Z"),
            "mensaje": "El cable es muy corto"
			}
		]
	},
   {
      "id": "DHT22_AC02_FI10",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": true,
         "humedad": false,
         "humo": false
      },
      "detalle": "Sensor inferior izquierdo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-07-24T22:53:36.412Z"),
            "mensaje": "El cable es muy corto"
			}
		]
	},
   {
      "id": "DHT22_AC02_FI09",
      "conectado": false,
      "tipoMedicion": {
         "temperatura": true,
         "humedad": false,
         "humo": false
      },
      "detalle": "Sensor inferior izquierdo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-07-24T22:53:55.253Z"),
            "mensaje": "El cable es muy corto"
			}
		]
	},
   {
      "id": "DHT22_AC02_FI11",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": true,
         "humedad": true,
         "humo": false
      },
      "detalle": "Sensor inferior izquierdo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-07-24T22:54:13.580Z"),
            "mensaje": "El cable es muy corto"
			}
		]
	},
   {
      "id": "DHT22_AC02_FI13",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": true,
         "humedad": true,
         "humo": false
      },
      "detalle": "Sensor inferior izquierdo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-07-24T22:54:20.867Z"),
            "mensaje": "El cable es muy corto"
			}
		]
	},
   {
      "id": "MQT12_DF03",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": false,
         "humedad": false,
         "humo": true
      },
      "detalle": "Sensor techo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-08-03T14:42:20.310Z"),
            "mensaje": "El sensor tarda en encender"
        }
    ]
   },
   {
      "id": "MQT12_DF04",
      "conectado": true,
      "tipoMedicion": {
         "temperatura": false,
         "humedad": false,
         "humo": true
      },
      "detalle": "Sensor techo rack adsib",
      "observaciones": [
         {
            "_id": ISODate("2015-08-03T14:42:20.310Z"),
            "mensaje": "El sensor tarda en encender"
        }
    ]
  }
];

db.sensores.insert(sensor_ejemplo);
print("--> Creado sensor " + sensor_ejemplo);
