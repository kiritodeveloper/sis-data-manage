#include "dht22.h"
#include <dht.h>

dht220::dht220(uint8_t id,uint8_t pin, char sala, char bloquex, uint8_t bloquey, char frontal, char lateral, uint8_t rack){
    _id = id;
    _pin = pin;
    _sala = sala;
    _bloquex = bloquex;
    _bloquey = bloquey;
    _frontal = frontal;
    _lateral = lateral;
    _rack = rack;
}

uint8_t dht220::obtenerId() {
    return _id;
}

uint8_t dht220::obtenerPin() {
    return _pin;
}

float dht220::obtenerTemperatura() {
    DHT.read22(_pin);
    return DHT.temperature;
}

float dht220::obtenerHumedad() {
    DHT.read22(_pin);
    return DHT.humidity;
}

char dht220::obtenerSala() {
    return _sala;
}

char dht220::obtenerBloquex() {
    return _bloquex;
}

uint8_t dht220::obtenerBloquey() {
    return _bloquey;
}

char dht220::obtenerFrontal() {
    return _frontal;
}

char dht220::obtenerLateral() {
    return _lateral;
}

uint8_t dht220::obtenerRack() {
    return _rack;
}


