#include "mqt22.h"
//#include <dht.h>

mqt220::mqt220(uint8_t id,uint8_t pin, char sala, char bloquex, uint8_t bloquey){
    _id = id;
    _pin = pin;
    _sala = sala;
    _bloquex = bloquex;
    _bloquey = bloquey;
    
}

uint8_t mqt220::obtenerId() {
    return _id;
}

uint8_t mqt220::obtenerPin() {
    return _pin;
}

char mqt220::obtenerSala() {
    return _sala;
}

char mqt220::obtenerBloquex() {
    return _bloquex;
}

uint8_t mqt220::obtenerBloquey() {
    return _bloquey;
}



