//#include <dht.h>

#include <Arduino.h>

//#include <dht.h>

class mqt220 {
    public:
        //dht220(uint8_t id, uint8_t pin);
        mqt220(uint8_t id, uint8_t pin, char sala, char bloquex, uint8_t bloquey);
        uint8_t obtenerId();
        uint8_t obtenerPin();
        char obtenerSala();
        char obtenerBloquex();
        uint8_t obtenerBloquey();
        
    private:
        uint8_t _id;
        uint8_t _pin;
        char _sala;
        char _bloquex;
        uint8_t _bloquey;
        
};
