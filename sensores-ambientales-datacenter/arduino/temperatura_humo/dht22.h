#include <dht.h>

#include <Arduino.h>

//#include <dht.h>

class dht220 {
    public:
        //dht220(uint8_t id, uint8_t pin);
        dht220(uint8_t id, uint8_t pin, char sala, char bloquex, uint8_t bloquey, char frontal, char lateral, uint8_t rack);
        uint8_t obtenerId();
        uint8_t obtenerPin();
        float obtenerTemperatura();
        float obtenerHumedad();
        char obtenerSala();
        char obtenerBloquex();
        uint8_t obtenerBloquey();
        char obtenerFrontal();
        char obtenerLateral();
        uint8_t obtenerRack();

    private:
        uint8_t _id;
        uint8_t _pin;
        char _sala;
        char _bloquex;
        uint8_t _bloquey;
        char _frontal;
        char _lateral;
        uint8_t _rack;
        dht DHT;
};
